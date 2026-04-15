import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { TwilioService } from '../twilio/twilio.service';
import { EmailService } from '../email/email.service';
import { CampaignType, MessageStatus, CampaignStatus } from '../../generated/prisma';
import { CAMPAIGN_QUEUE, CAMPAIGN_JOB_RECIPIENT } from './campaigns.constants';
import { ConfigService } from '@nestjs/config';

@Processor(CAMPAIGN_QUEUE)
export class CampaignProcessor extends WorkerHost {
  private readonly logger = new Logger(CampaignProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly twilioService: TwilioService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { name, data } = job;

    switch (name) {
      case CAMPAIGN_JOB_RECIPIENT:
        return this.handleRecipient(data);
      default:
        this.logger.warn(`Unknown job name: ${name}`);
    }
  }

  private async handleRecipient(data: {
    recipientId: string;
    campaignId: string;
    businessId: string;
  }) {
    const { recipientId, campaignId, businessId } = data;

    const recipient = await this.prisma.campaignRecipient.findUnique({
      where: { id: recipientId },
      include: { campaign: true },
    });

    if (!recipient || recipient.status !== MessageStatus.PENDING) {
      return;
    }

    const { campaign } = recipient;
    const webhookBaseUrl = this.configService.get('WEBHOOK_BASE_URL');
    const statusCallback = `${webhookBaseUrl}/twilio/webhook/campaign/status?recipientId=${recipientId}&businessId=${businessId}`;

    try {
      let externalId: string | undefined;

      if (campaign.type === CampaignType.EMAIL) {
        const result = await this.emailService.sendEmail(businessId, {
          to: recipient.email!,
          subject: campaign.name,
          text: campaign.messageTemplate,
        }, { persist: false });
        externalId = result.emailId;
      } else if (campaign.type === CampaignType.WHATSAPP) {
        const result = await this.twilioService.sendWhatsApp(
          businessId,
          recipient.phoneNumber!,
          campaign.messageTemplate,
          statusCallback
        );
        externalId = result.sid;
      } else {
        const result = await this.twilioService.sendSMS(
          businessId,
          recipient.phoneNumber!,
          campaign.messageTemplate,
          statusCallback
        );
        externalId = result.sid;
      }

      await this.prisma.campaignRecipient.update({
        where: { id: recipientId },
        data: {
          status: MessageStatus.SENT,
          externalId,
          sentAt: new Date(),
        },
      });

      // Update campaign aggregate
      await this.prisma.campaign.update({
        where: { id: campaignId },
        data: { messagesSent: { increment: 1 } },
      });

    } catch (error) {
      this.logger.error(`Failed to send campaign message to ${recipientId}: ${error.message}`);
      
      await this.prisma.campaignRecipient.update({
        where: { id: recipientId },
        data: {
          status: MessageStatus.FAILED,
          error: error.message,
        },
      });

      await this.prisma.campaign.update({
        where: { id: campaignId },
        data: { messagesFailed: { increment: 1 } },
      });
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`Job ${job.id} completed`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(`Job ${job.id} failed: ${error.message}`);
  }
}
