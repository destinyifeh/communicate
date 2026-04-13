import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SubaccountService } from './services/subaccount.service';
import { PhoneProvisioningService } from './services/phone-provisioning.service';
import { MockTwilioService } from './services/mock-twilio.service';
import * as twilio from 'twilio';
import { Twilio } from 'twilio';

@Injectable()
export class TwilioService {
  private readonly logger = new Logger(TwilioService.name);
  private readonly useMock: boolean;
  private client: Twilio | null = null;
  private readonly defaultPhoneNumber: string;
  private readonly whatsappNumber: string;
  private readonly webhookBaseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly subaccountService: SubaccountService,
    private readonly phoneProvisioningService: PhoneProvisioningService,
    private readonly mockTwilioService: MockTwilioService,
  ) {
    this.useMock = this.configService.get<string>('TWILIO_USE_MOCK', 'true') === 'true';
    this.defaultPhoneNumber = this.configService.get<string>('TWILIO_PHONE_NUMBER', '');
    this.whatsappNumber = this.configService.get<string>('TWILIO_WHATSAPP_NUMBER', '');
    this.webhookBaseUrl = this.configService.get<string>('WEBHOOK_BASE_URL', '');

    if (!this.useMock) {
      const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
      const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
      if (accountSid && authToken) {
        this.client = twilio(accountSid, authToken);
        this.logger.log('Twilio client initialized for real messaging');
      }
    } else {
      this.logger.log('Twilio running in MOCK mode');
    }
  }

  // Expose services for other modules
  get subaccount() {
    return this.subaccountService;
  }

  get phone() {
    return this.phoneProvisioningService;
  }

  // Send SMS
  async sendSMS(businessId: string, to: string, body: string, from?: string): Promise<{ sid: string; status: string }> {
    // Get business phone number or use default
    let fromNumber = from;
    if (!fromNumber) {
      const phones = await this.phoneProvisioningService.getBusinessPhoneNumbers(businessId);
      const primaryPhone = phones.find((p) => p.isPrimary) || phones[0];
      fromNumber = primaryPhone?.phoneNumber || this.defaultPhoneNumber;
    }

    if (!fromNumber) {
      throw new Error('No phone number available for SMS');
    }

    if (this.useMock || !this.client) {
      this.logger.log(`[MOCK] Sending SMS from ${fromNumber} to ${to}: ${body}`);
      return this.mockTwilioService.sendSMS(fromNumber, to, body);
    }

    // Real Twilio SMS
    this.logger.log(`Sending real SMS from ${fromNumber} to ${to}`);
    const message = await this.client.messages.create({
      body,
      from: fromNumber,
      to,
      // Status callback for delivery tracking
      ...(this.webhookBaseUrl && {
        statusCallback: `${this.webhookBaseUrl}/twilio/webhook/sms/status?businessId=${businessId}`,
      }),
    });

    this.logger.log(`SMS sent successfully: ${message.sid}`);
    return {
      sid: message.sid,
      status: message.status,
    };
  }

  // Send WhatsApp message
  async sendWhatsApp(businessId: string, to: string, body: string, from?: string): Promise<{ sid: string; status: string }> {
    // Get WhatsApp number
    let fromNumber = from;
    if (!fromNumber) {
      const phones = await this.phoneProvisioningService.getBusinessPhoneNumbers(businessId);
      const whatsappPhone = phones.find((p) => p.whatsappEnabled);
      fromNumber = whatsappPhone?.phoneNumber || this.whatsappNumber;
    }

    if (!fromNumber) {
      throw new Error('No WhatsApp number available');
    }

    // Ensure WhatsApp format
    const whatsappFrom = fromNumber.startsWith('whatsapp:') ? fromNumber : `whatsapp:${fromNumber}`;
    const whatsappTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;

    if (this.useMock || !this.client) {
      this.logger.log(`[MOCK] Sending WhatsApp from ${whatsappFrom} to ${whatsappTo}: ${body}`);
      return this.mockTwilioService.sendWhatsApp(fromNumber, to, body);
    }

    // Real Twilio WhatsApp
    this.logger.log(`Sending real WhatsApp from ${whatsappFrom} to ${whatsappTo}`);
    const message = await this.client.messages.create({
      body,
      from: whatsappFrom,
      to: whatsappTo,
      // Status callback for delivery tracking
      ...(this.webhookBaseUrl && {
        statusCallback: `${this.webhookBaseUrl}/twilio/webhook/sms/status?businessId=${businessId}`,
      }),
    });

    this.logger.log(`WhatsApp sent successfully: ${message.sid}`);
    return {
      sid: message.sid,
      status: message.status,
    };
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
