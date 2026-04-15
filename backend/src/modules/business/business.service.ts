import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreateBusinessDto, UpdateBusinessDto } from './dto/create-business.dto';
import { Business, FeatureType, User } from '../../generated/prisma';

@Injectable()
export class BusinessService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBusinessDto: CreateBusinessDto, userId: string): Promise<Business> {
    const { features, ...businessData } = createBusinessDto;

    const business = await this.prisma.business.create({
      data: {
        ...businessData,
        ownerId: userId,
      },
    });

    // Create features
    if (features && features.length > 0) {
      await this.prisma.businessFeature.createMany({
        data: features.map((featureType) => ({
          featureType,
          enabled: true,
          businessId: business.id,
        })),
      });
    }

    return this.findOne(business.id, userId);
  }

  async findAll(userId: string): Promise<Business[]> {
    return this.prisma.business.findMany({
      where: { ownerId: userId },
      include: {
        features: true,
        subscription: true,
        phoneNumbers: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string): Promise<Business> {
    const business = await this.prisma.business.findUnique({
      where: { id },
      include: {
        features: true,
        subscription: true,
        phoneNumbers: true,
        twilioSubaccount: true,
      },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    if (business.ownerId !== userId) {
      throw new ForbiddenException('Access denied to this business');
    }

    return business;
  }

  async update(id: string, updateBusinessDto: UpdateBusinessDto, userId: string): Promise<Business> {
    await this.findOne(id, userId); // Verify access

    await this.prisma.business.update({
      where: { id },
      data: updateBusinessDto,
    });

    return this.findOne(id, userId);
  }

  async updateFeatures(id: string, features: FeatureType[], userId: string): Promise<Business> {
    const business = await this.findOne(id, userId);

    // Remove existing features
    await this.prisma.businessFeature.deleteMany({
      where: { businessId: business.id },
    });

    // Create new features
    await this.prisma.businessFeature.createMany({
      data: features.map((featureType) => ({
        featureType,
        enabled: true,
        businessId: business.id,
      })),
    });

    return this.findOne(id, userId);
  }

  async toggleFeature(
    businessId: string,
    featureType: FeatureType,
    enabled: boolean,
    userId: string,
  ) {
    const business = await this.findOne(businessId, userId);

    const existingFeature = await this.prisma.businessFeature.findFirst({
      where: { businessId: business.id, featureType },
    });

    if (!existingFeature) {
      return this.prisma.businessFeature.create({
        data: {
          featureType,
          enabled,
          businessId: business.id,
        },
      });
    }

    return this.prisma.businessFeature.update({
      where: { id: existingFeature.id },
      data: { enabled },
    });
  }

  async switchBusiness(businessId: string, userId: string): Promise<User> {
    // Verify user has access to this business
    await this.findOne(businessId, userId);

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { currentBusinessId: businessId },
    });
  }

  async updateFAQResponses(
    businessId: string,
    faqs: { question: string; answer: string; keywords: string[] }[],
    userId: string,
  ): Promise<Business> {
    await this.findOne(businessId, userId);

    return this.prisma.business.update({
      where: { id: businessId },
      data: { faqResponses: faqs },
    });
  }

  async updateBusinessHours(
    businessId: string,
    hours: { [key: string]: { open: string; close: string; enabled: boolean } },
    userId: string,
  ): Promise<Business> {
    await this.findOne(businessId, userId);

    return this.prisma.business.update({
      where: { id: businessId },
      data: { businessHours: hours },
    });
  }

  async getStats(businessId: string, userId: string) {
    const business = await this.findOne(businessId, userId);

    // Get real counts
    const [contactCount, conversationCount, bookingCount, campaignCount] = await Promise.all([
      this.prisma.contact.count({ where: { businessId } }),
      this.prisma.conversation.count({ where: { businessId } }),
      this.prisma.booking.count({ where: { businessId } }),
      this.prisma.campaign.count({ where: { businessId } }),
    ]);

    const subscription = await this.prisma.subscription.findUnique({
      where: { businessId },
    });

    return {
      businessId: business.id,
      totalContacts: contactCount,
      totalConversations: conversationCount,
      totalBookings: bookingCount,
      totalCampaigns: campaignCount,
      messagesThisMonth: subscription?.messagesUsedThisMonth || 0,
      messageLimit: subscription?.maxMessagesPerMonth || 100,
    };
  }
}
