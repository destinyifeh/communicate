import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma';
import { MockTwilioService } from './mock-twilio.service';
import { TwilioSubaccount } from '@prisma/client';

@Injectable()
export class SubaccountService {
  private readonly logger = new Logger(SubaccountService.name);
  private readonly useMock: boolean;

  constructor(
    private readonly configService: ConfigService,
    private readonly mockTwilioService: MockTwilioService,
    private readonly prisma: PrismaService,
  ) {
    this.useMock = this.configService.get('TWILIO_USE_MOCK', 'true') === 'true';
  }

  async createSubaccount(businessId: string): Promise<TwilioSubaccount> {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new Error('Business not found');
    }

    // Check if subaccount already exists
    const existing = await this.prisma.twilioSubaccount.findUnique({
      where: { businessId },
    });

    if (existing) {
      return existing;
    }

    let accountData;

    if (this.useMock) {
      this.logger.log(`Creating mock Twilio subaccount for business: ${business.name}`);
      accountData = await this.mockTwilioService.createSubaccount(business.name);
    } else {
      // Real Twilio implementation would go here
      throw new Error('Real Twilio integration not implemented yet');
    }

    const subaccount = await this.prisma.twilioSubaccount.create({
      data: {
        accountSid: accountData.sid,
        authToken: accountData.authToken,
        friendlyName: accountData.friendlyName,
        status: accountData.status,
        isMock: this.useMock,
        businessId,
      },
    });

    this.logger.log(`Subaccount created: ${subaccount.accountSid} for business: ${businessId}`);

    return subaccount;
  }

  async getSubaccount(businessId: string): Promise<TwilioSubaccount | null> {
    return this.prisma.twilioSubaccount.findUnique({
      where: { businessId },
    });
  }

  async setupFlexWorkspace(businessId: string): Promise<TwilioSubaccount> {
    const subaccount = await this.getSubaccount(businessId);

    if (!subaccount) {
      throw new Error('Subaccount not found. Create subaccount first.');
    }

    if (subaccount.workspaceSid) {
      return subaccount; // Already set up
    }

    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (this.useMock) {
      const workspace = await this.mockTwilioService.createFlexWorkspace(business?.name || 'Business');
      return this.prisma.twilioSubaccount.update({
        where: { id: subaccount.id },
        data: { workspaceSid: workspace.workspaceSid },
      });
    } else {
      throw new Error('Real Twilio Flex integration not implemented yet');
    }
  }

  async setupMessagingService(businessId: string): Promise<TwilioSubaccount> {
    const subaccount = await this.getSubaccount(businessId);

    if (!subaccount) {
      throw new Error('Subaccount not found. Create subaccount first.');
    }

    if (subaccount.messagingServiceSid) {
      return subaccount; // Already set up
    }

    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (this.useMock) {
      const service = await this.mockTwilioService.createMessagingService(
        `${business?.name || 'Business'} Messaging`,
      );
      return this.prisma.twilioSubaccount.update({
        where: { id: subaccount.id },
        data: { messagingServiceSid: service.sid },
      });
    } else {
      throw new Error('Real Twilio messaging service integration not implemented yet');
    }
  }
}
