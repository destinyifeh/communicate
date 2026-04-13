import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma';
import { MockTwilioService, MockPhoneNumber } from './mock-twilio.service';
import { SubaccountService } from './subaccount.service';
import { BusinessPhoneNumber } from '@prisma/client';

export interface AvailableNumber {
  phoneNumber: string;
  friendlyName: string;
  capabilities: {
    voice: boolean;
    sms: boolean;
    whatsapp: boolean;
  };
  country: string;
  areaCode: string;
  monthlyPrice: number;
}

@Injectable()
export class PhoneProvisioningService {
  private readonly logger = new Logger(PhoneProvisioningService.name);
  private readonly useMock: boolean;
  private readonly baseWebhookUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly mockTwilioService: MockTwilioService,
    private readonly subaccountService: SubaccountService,
    private readonly prisma: PrismaService,
  ) {
    this.useMock = this.configService.get('TWILIO_USE_MOCK', 'true') === 'true';
    this.baseWebhookUrl = this.configService.get('WEBHOOK_BASE_URL', 'http://localhost:3001/api');
  }

  async searchAvailableNumbers(
    businessId: string,
    country: string = 'US',
    areaCode?: string,
  ): Promise<AvailableNumber[]> {
    // Verify business exists and has subaccount
    const subaccount = await this.subaccountService.getSubaccount(businessId);
    if (!subaccount) {
      throw new BadRequestException('Business must be set up with Twilio first');
    }

    let numbers: MockPhoneNumber[];

    if (this.useMock) {
      numbers = await this.mockTwilioService.searchAvailableNumbers(country, areaCode);
    } else {
      throw new Error('Real Twilio phone search not implemented yet');
    }

    return numbers.map((n) => ({
      phoneNumber: n.phoneNumber,
      friendlyName: n.friendlyName,
      capabilities: {
        voice: n.capabilities.voice,
        sms: n.capabilities.sms,
        whatsapp: false, // WhatsApp requires separate approval
      },
      country: n.country,
      areaCode: n.areaCode,
      monthlyPrice: 5.0, // Base price per number
    }));
  }

  async purchaseNumber(
    businessId: string,
    phoneNumber: string,
    options?: {
      friendlyName?: string;
      voiceEnabled?: boolean;
      smsEnabled?: boolean;
    },
  ): Promise<BusinessPhoneNumber> {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      include: {
        subscription: true,
        phoneNumbers: true,
      },
    });

    if (!business) {
      throw new BadRequestException('Business not found');
    }

    // Check phone number limit
    const currentCount = business.phoneNumbers?.length || 0;
    const maxAllowed = business.subscription?.maxPhoneNumbers || 1;

    if (currentCount >= maxAllowed) {
      throw new BadRequestException(
        `Phone number limit reached (${maxAllowed}). Upgrade your plan for more numbers.`,
      );
    }

    // Check if number already purchased
    const existing = await this.prisma.businessPhoneNumber.findFirst({
      where: { phoneNumber, businessId },
    });

    if (existing) {
      throw new BadRequestException('Phone number already purchased');
    }

    const subaccount = await this.subaccountService.getSubaccount(businessId);
    if (!subaccount) {
      throw new BadRequestException('Twilio subaccount not set up');
    }

    // Webhook URLs for this business
    const voiceUrl = `${this.baseWebhookUrl}/twilio/webhook/voice?businessId=${businessId}`;
    const smsUrl = `${this.baseWebhookUrl}/twilio/webhook/sms?businessId=${businessId}`;

    let purchasedNumber;

    if (this.useMock) {
      purchasedNumber = await this.mockTwilioService.purchasePhoneNumber(
        phoneNumber,
        subaccount.accountSid,
        voiceUrl,
        smsUrl,
      );
    } else {
      throw new Error('Real Twilio phone purchase not implemented yet');
    }

    const phone = await this.prisma.businessPhoneNumber.create({
      data: {
        phoneNumber: purchasedNumber.phoneNumber,
        friendlyName: options?.friendlyName || purchasedNumber.friendlyName,
        twilioSid: purchasedNumber.sid,
        country: purchasedNumber.country,
        areaCode: purchasedNumber.areaCode,
        voiceEnabled: options?.voiceEnabled ?? true,
        smsEnabled: options?.smsEnabled ?? true,
        whatsappEnabled: false,
        voiceWebhookUrl: voiceUrl,
        smsWebhookUrl: smsUrl,
        status: 'active',
        isPrimary: currentCount === 0, // First number is primary
        isMock: this.useMock,
        monthlyCost: 5.0,
        businessId,
      },
    });

    this.logger.log(`Phone number purchased: ${phone.phoneNumber} for business: ${businessId}`);

    return phone;
  }

  async getBusinessPhoneNumbers(businessId: string): Promise<BusinessPhoneNumber[]> {
    return this.prisma.businessPhoneNumber.findMany({
      where: { businessId },
      orderBy: [{ isPrimary: 'desc' }, { createdAt: 'asc' }],
    });
  }

  async setPrimaryNumber(businessId: string, phoneId: string): Promise<BusinessPhoneNumber> {
    // Remove primary from all other numbers
    await this.prisma.businessPhoneNumber.updateMany({
      where: { businessId, isPrimary: true },
      data: { isPrimary: false },
    });

    // Set new primary
    const phone = await this.prisma.businessPhoneNumber.findFirst({
      where: { id: phoneId, businessId },
    });

    if (!phone) {
      throw new BadRequestException('Phone number not found');
    }

    return this.prisma.businessPhoneNumber.update({
      where: { id: phoneId },
      data: { isPrimary: true },
    });
  }

  async releaseNumber(businessId: string, phoneId: string): Promise<void> {
    const phone = await this.prisma.businessPhoneNumber.findFirst({
      where: { id: phoneId, businessId },
    });

    if (!phone) {
      throw new BadRequestException('Phone number not found');
    }

    // In real implementation, would release number back to Twilio
    if (this.useMock) {
      this.logger.log(`Mock releasing phone number: ${phone.phoneNumber}`);
    }

    await this.prisma.businessPhoneNumber.delete({
      where: { id: phoneId },
    });
  }
}
