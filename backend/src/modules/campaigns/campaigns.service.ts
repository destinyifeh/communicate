import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../../prisma';
import { TwilioService } from '../twilio/twilio.service';
import { EmailService } from '../email/email.service';
import { Campaign, CampaignStatus, CampaignType, MessageStatus } from '../../generated/prisma';
import { CAMPAIGN_QUEUE, CAMPAIGN_JOB_RECIPIENT } from './campaigns.constants';
import { PaginatedResponseDto, PaginationDto } from '../../common/dto';

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
  private readonly logger = new Logger(CampaignsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly twilioService: TwilioService,
    private readonly emailService: EmailService,
    @InjectQueue(CAMPAIGN_QUEUE) private readonly campaignQueue: Queue,
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

  async findAll(
    businessId: string, 
    pagination: PaginationDto,
    status?: CampaignStatus
  ): Promise<PaginatedResponseDto<Campaign>> {
    const where = {
      businessId,
      ...(status && { status }),
    };

    const [data, total] = await Promise.all([
      this.prisma.campaign.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.campaign.count({ where }),
    ]);

    return PaginatedResponseDto.create(data, total, pagination);
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
    const campaign = await this.prisma.campaign.findFirst({
      where: { id, businessId },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    if (campaign.status !== CampaignStatus.DRAFT && campaign.status !== CampaignStatus.SCHEDULED) {
      throw new BadRequestException('Campaign cannot be sent');
    }

    // 1. Get Recipients
    const recipientData = await this.getRecipientDetailedData(businessId, campaign);
    
    if (recipientData.length === 0) {
      throw new BadRequestException('No recipients found for this campaign');
    }

    // 2. Update Campaign status to SENDING
    await this.prisma.campaign.update({
      where: { id },
      data: {
        status: CampaignStatus.SENDING,
        startedAt: new Date(),
        totalRecipients: recipientData.length,
        messagesSent: 0,
        messagesFailed: 0,
      },
    });

    // 3. Create CampaignRecipient records in bulk
    // We use createMany for performance
    await this.prisma.campaignRecipient.createMany({
      data: recipientData.map(r => ({
        campaignId: id,
        contactId: r.contactId,
        phoneNumber: r.phoneNumber,
        email: r.email,
        status: MessageStatus.PENDING,
      })),
    });

    // 4. Fetch the created recipients to get their IDs
    const recipients = await this.prisma.campaignRecipient.findMany({
      where: { campaignId: id },
      select: { id: true },
    });

    // 5. Queue individual jobs
    await this.campaignQueue.addBulk(
      recipients.map((recipient) => ({
        name: CAMPAIGN_JOB_RECIPIENT,
        data: {
          recipientId: recipient.id,
          campaignId: id,
          businessId,
        },
      }))
    );

    this.logger.log(`Queued campaign ${id} for ${recipients.length} recipients`);

    return this.prisma.campaign.findUnique({
      where: { id },
    }) as Promise<Campaign>;
  }

  private async getRecipientDetailedData(
    businessId: string, 
    campaign: Campaign
  ): Promise<Array<{ contactId?: string, phoneNumber?: string, email?: string }>> {
    const targetTags = campaign.targetTags as string[] | null;
    const excludeTags = campaign.excludeTags as string[] | null;

    if (campaign.type === CampaignType.EMAIL) {
      const emails = campaign.recipientEmails as string[] | null;
      if (emails?.length) {
        return emails.map(email => ({ email }));
      }

      const contacts = await this.prisma.contact.findMany({
        where: {
          businessId,
          optedOutEmail: false,
          AND: [
            { email: { not: null } },
            { email: { not: "" } },
            ...(targetTags?.length ? [{
              tags: {
                path: [],
                array_contains: targetTags,
              }
            }] : []),
            ...(excludeTags?.length ? excludeTags.map(tag => ({
              NOT: {
                tags: {
                  path: [],
                  array_contains: [tag],
                }
              }
            })) : []),
          ]
        },
        select: { id: true, email: true },
      });

      return contacts.map((c: any) => ({ contactId: c.id, email: c.email! }));
    }

    const phones = campaign.recipientPhones as string[] | null;
    if (phones?.length) {
      return phones.map(phone => ({ phoneNumber: phone }));
    }

    const optOutField = campaign.type === CampaignType.SMS ? 'optedOutSms' : 'optedOutWhatsapp';

    const contacts = await this.prisma.contact.findMany({
      where: {
        businessId,
        [optOutField]: false,
        phone: { not: null },
        AND: [
          { phone: { not: "" } },
          ...(targetTags?.length ? [{
            tags: {
              path: [],
              array_contains: targetTags,
            }
          }] : []),
          ...(excludeTags?.length ? excludeTags.map(tag => ({
            NOT: {
              tags: {
                path: [],
                array_contains: [tag],
              }
            }
          })) : []),
        ]
      },
      select: { id: true, phone: true },
    });

    return contacts.map((c: any) => ({ contactId: c.id, phoneNumber: c.phone }));
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
        ...(dto.type === CampaignType.EMAIL 
          ? { AND: [{ email: { not: null } }, { email: { not: "" } }] }
          : { AND: [{ phone: { not: null } }, { phone: { not: "" } }] }
        ),
        AND: [
          ...(dto.targetTags?.length ? [{
            tags: {
              path: [],
              array_contains: dto.targetTags,
            }
          }] : []),
          ...(dto.excludeTags?.length ? dto.excludeTags.map(tag => ({
            NOT: {
              tags: {
                path: [],
                array_contains: [tag],
              }
            }
          })) : []),
        ]
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
        phone: { not: null },
        AND: [{ phone: { not: "" } }],
      },
      select: { phone: true },
    });

    return contacts.map((c) => c.phone!).filter(Boolean);
  }

  async getStats(businessId: string): Promise<{
    totalCampaigns: number;
    activeCampaigns: number;
    totalMessagesSent: number;
    totalDelivered: number;
    totalFailed: number;
    averageDeliveryRate: number;
    averageReadRate: number;
  }> {
    const campaigns = await this.prisma.campaign.findMany({
      where: { businessId },
    });

    const activeCampaigns = campaigns.filter(
      (c) => c.status === CampaignStatus.SENDING || c.status === CampaignStatus.SCHEDULED,
    ).length;

    const totalMessagesSent = campaigns.reduce((sum, c) => sum + c.messagesSent, 0);
    const totalDelivered = campaigns.reduce((sum, c) => sum + c.messagesDelivered, 0);
    const totalFailed = campaigns.reduce((sum, c) => sum + c.messagesFailed, 0);
    const totalRead = campaigns.reduce((sum, c) => sum + c.messagesRead, 0);

    const averageDeliveryRate =
      totalMessagesSent > 0 ? (totalDelivered / totalMessagesSent) * 100 : 0;
    const averageReadRate = totalDelivered > 0 ? (totalRead / totalDelivered) * 100 : 0;

    return {
      totalCampaigns: campaigns.length,
      activeCampaigns,
      totalMessagesSent,
      totalDelivered,
      totalFailed,
      averageDeliveryRate,
      averageReadRate,
    };
  }
}
