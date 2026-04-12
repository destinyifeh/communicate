import { Injectable } from '@nestjs/common';
import { SubaccountService } from './services/subaccount.service';
import { PhoneProvisioningService } from './services/phone-provisioning.service';
import { MockTwilioService } from './services/mock-twilio.service';

@Injectable()
export class TwilioService {
  constructor(
    private readonly subaccountService: SubaccountService,
    private readonly phoneProvisioningService: PhoneProvisioningService,
    private readonly mockTwilioService: MockTwilioService,
  ) {}

  // Expose services for other modules
  get subaccount() {
    return this.subaccountService;
  }

  get phone() {
    return this.phoneProvisioningService;
  }

  // Send SMS
  async sendSMS(businessId: string, to: string, body: string, from?: string) {
    const phones = await this.phoneProvisioningService.getBusinessPhoneNumbers(businessId);
    const primaryPhone = phones.find((p) => p.isPrimary) || phones[0];

    if (!primaryPhone) {
      throw new Error('No phone number available for this business');
    }

    const fromNumber = from || primaryPhone.phoneNumber;

    return this.mockTwilioService.sendSMS(fromNumber, to, body);
  }

  // Send WhatsApp message
  async sendWhatsApp(businessId: string, to: string, body: string, from?: string) {
    const phones = await this.phoneProvisioningService.getBusinessPhoneNumbers(businessId);
    const whatsappPhone = phones.find((p) => p.whatsappEnabled) || phones[0];

    if (!whatsappPhone) {
      throw new Error('No WhatsApp-enabled phone number for this business');
    }

    const fromNumber = from || whatsappPhone.phoneNumber;

    return this.mockTwilioService.sendWhatsApp(fromNumber, to, body);
  }

  // Full setup for a new business
  async setupBusiness(businessId: string): Promise<{
    subaccount: any;
    messagingService: any;
  }> {
    // Create subaccount
    const subaccount = await this.subaccountService.createSubaccount(businessId);

    // Create messaging service
    const withMessaging = await this.subaccountService.setupMessagingService(businessId);

    return {
      subaccount,
      messagingService: withMessaging.messagingServiceSid,
    };
  }
}
