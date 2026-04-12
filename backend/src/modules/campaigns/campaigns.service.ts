import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { TwilioService } from '../twilio/twilio.service';
import { EmailService } from '../email/email.service';
import { Campaign, CampaignStatus, CampaignType } from '@prisma/client';

export interface CreateCampaignDto {
  name: string;
  description?: string;
  type: CampaignType;
  messageTemplate: string;
  mediaUrls?: string[];
  targetTags?: string[];
  excludeTags?: string[];
  recipientPhones?: string[];
  recipientEmails?: string[];
  scheduledAt?: Date;
}

@Injectable()
export class CampaignsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly twilioService: TwilioService,
    private readonly emailService: EmailService,
  ) {}

  async create(businessId: string, dto: CreateCampaignDto, userId: string): Promise<Campaign> {
    const totalRecipients = await this.calculateRecipientCount(businessId, dto);

    return this.prisma.campaign.create({
      data: {
        name: dto.name,
        description: dto.description,
        type: dto.type,
        messageTemplate: dto.messageTemplate,
        mediaUrls: dto.mediaUrls,
        targetTags: dto.targetTags,
        excludeTags: dto.excludeTags,
        recipientPhones: dto.recipientPhones,
        recipientEmails: dto.recipientEmails,
        scheduledAt: dto.scheduledAt,
        status: dto.scheduledAt ? CampaignStatus.SCHEDULED : CampaignStatus.DRAFT,
        totalRecipients,
        businessId,
        createdById: userId,
      },
    });
  }

  async findAll(businessId: string, status?: CampaignStatus): Promise<Campaign[]> {
    return this.prisma.campaign.findMany({
      where: {
        businessId,
        ...(status && { status }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(businessId: string, id: string): Promise<Campaign> {
    const campaign = await this.prisma.campaign.findFirst({
      where: { id, businessId },
      include: { createdBy: true },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    return campaign;
  }

  async send(businessId: string, id: string): Promise<Campaign> {
    const campaign = await this.findOne(businessId, id);

    if (campaign.status !== CampaignStatus.DRAFT && campaign.status !== CampaignStatus.SCHEDULED) {
      throw new BadRequestException('Campaign cannot be sent');
    }

    await this.prisma.campaign.update({
      where: { id },
      data: {
        status: CampaignStatus.SENDING,
        startedAt: new Date(),
      },
    });

    // Get recipients
    const recipients = await this.getRecipients(businessId, campaign);

    // Send messages (in a real app, this would be queued)
    let sent = 0;
    let failed = 0;

    for (const recipient of recipients) {
      try {
        if (campaign.type === CampaignType.EMAIL) {
          await this.emailService.sendEmail(businessId, {
            to: recipient,
            subject: campaign.name,
            text: campaign.messageTemplate,
          });
        } else if (campaign.type === CampaignType.WHATSAPP) {
          await this.twilioService.sendWhatsApp(businessId, recipient, campaign.messageTemplate);
        } else {
          await this.twilioService.sendSMS(businessId, recipient, campaign.messageTemplate);
        }
        sent++;
      } catch (error) {
        failed++;
      }
    }

    return this.prisma.campaign.update({
      where: { id },
      data: {
        messagesSent: sent,
        messagesFailed: failed,
        status: CampaignStatus.COMPLETED,
        completedAt: new Date(),
      },
    });
  }

  async pause(businessId: string, id: string): Promise<Campaign> {
    const campaign = await this.findOne(businessId, id);

    if (campaign.status !== CampaignStatus.SENDING) {
      throw new BadRequestException('Campaign is not sending');
    }

    return this.prisma.campaign.update({
      where: { id },
      data: { status: CampaignStatus.PAUSED },
    });
  }

  async delete(businessId: string, id: string): Promise<void> {
    const campaign = await this.findOne(businessId, id);

    if (campaign.status === CampaignStatus.SENDING) {
      throw new BadRequestException('Cannot delete campaign while sending');
    }

    await this.prisma.campaign.delete({ where: { id } });
  }

  private async calculateRecipientCount(businessId: string, dto: CreateCampaignDto): Promise<number> {
    if (dto.type === CampaignType.EMAIL && dto.recipientEmails?.length) {
      return dto.recipientEmails.length;
    }

    if (dto.recipientPhones?.length) {
      return dto.recipientPhones.length;
    }

    const optOutField = dto.type === CampaignType.EMAIL
      ? 'optedOutEmail'
      : dto.type === CampaignType.SMS
        ? 'optedOutSms'
        : 'optedOutWhatsapp';

    return this.prisma.contact.count({
      where: {
        businessId,
        [optOutField]: false,
      },
    });
  }

  private async getRecipients(businessId: string, campaign: Campaign): Promise<string[]> {
    if (campaign.type === CampaignType.EMAIL) {
      const emails = campaign.recipientEmails as string[] | null;
      if (emails?.length) {
        return emails;
      }

      const contacts = await this.prisma.contact.findMany({
        where: {
          businessId,
          optedOutEmail: false,
          email: { not: null },
        },
        select: { email: true },
      });

      return contacts.map((c) => c.email!).filter(Boolean);
    }

    const phones = campaign.recipientPhones as string[] | null;
    if (phones?.length) {
      return phones;
    }

    const optOutField = campaign.type === CampaignType.SMS ? 'optedOutSms' : 'optedOutWhatsapp';

    const contacts = await this.prisma.contact.findMany({
      where: {
        businessId,
        [optOutField]: false,
      },
      select: { phone: true },
    });

    return contacts.map((c) => c.phone);
  }

  async getStats(businessId: string): Promise<{
    total: number;
    draft: number;
    scheduled: number;
    completed: number;
    totalSent: number;
    totalDelivered: number;
  }> {
    const campaigns = await this.findAll(businessId);

    return {
      total: campaigns.length,
      draft: campaigns.filter((c) => c.status === CampaignStatus.DRAFT).length,
      scheduled: campaigns.filter((c) => c.status === CampaignStatus.SCHEDULED).length,
      completed: campaigns.filter((c) => c.status === CampaignStatus.COMPLETED).length,
      totalSent: campaigns.reduce((sum, c) => sum + c.messagesSent, 0),
      totalDelivered: campaigns.reduce((sum, c) => sum + c.messagesDelivered, 0),
    };
  }
}
