import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export interface MockSubaccount {
  sid: string;
  authToken: string;
  friendlyName: string;
  status: string;
  dateCreated: Date;
}

export interface MockPhoneNumber {
  sid: string;
  phoneNumber: string;
  friendlyName: string;
  capabilities: {
    voice: boolean;
    sms: boolean;
    mms: boolean;
  };
  country: string;
  areaCode: string;
}

export interface MockMessage {
  sid: string;
  from: string;
  to: string;
  body: string;
  status: string;
  direction: string;
  dateCreated: Date;
}

@Injectable()
export class MockTwilioService {
  private generateSid(prefix: string): string {
    return `${prefix}${uuidv4().replace(/-/g, '').substring(0, 32)}`;
  }

  async createSubaccount(friendlyName: string): Promise<MockSubaccount> {
    // Simulate API delay
    await this.delay(500);

    return {
      sid: this.generateSid('AC'),
      authToken: this.generateSid(''),
      friendlyName,
      status: 'active',
      dateCreated: new Date(),
    };
  }

  async searchAvailableNumbers(country: string, areaCode?: string): Promise<MockPhoneNumber[]> {
    await this.delay(300);

    const numbers: MockPhoneNumber[] = [];
    const count = 5;

    for (let i = 0; i < count; i++) {
      const code = areaCode || Math.floor(Math.random() * 900 + 100).toString();
      numbers.push({
        sid: this.generateSid('PN'),
        phoneNumber: `+1${code}${Math.floor(Math.random() * 9000000 + 1000000)}`,
        friendlyName: `Mock Number ${i + 1}`,
        capabilities: {
          voice: true,
          sms: true,
          mms: true,
        },
        country,
        areaCode: code,
      });
    }

    return numbers;
  }

  async purchasePhoneNumber(
    phoneNumber: string,
    subaccountSid: string,
    voiceUrl?: string,
    smsUrl?: string,
  ): Promise<MockPhoneNumber> {
    await this.delay(500);

    return {
      sid: this.generateSid('PN'),
      phoneNumber,
      friendlyName: `Purchased ${phoneNumber}`,
      capabilities: {
        voice: true,
        sms: true,
        mms: true,
      },
      country: 'US',
      areaCode: phoneNumber.substring(2, 5),
    };
  }

  async sendSMS(from: string, to: string, body: string): Promise<MockMessage> {
    await this.delay(200);

    return {
      sid: this.generateSid('SM'),
      from,
      to,
      body,
      status: 'sent',
      direction: 'outbound-api',
      dateCreated: new Date(),
    };
  }

  async sendWhatsApp(from: string, to: string, body: string): Promise<MockMessage> {
    await this.delay(200);

    return {
      sid: this.generateSid('SM'),
      from: `whatsapp:${from}`,
      to: `whatsapp:${to}`,
      body,
      status: 'sent',
      direction: 'outbound-api',
      dateCreated: new Date(),
    };
  }

  async createVoiceResponse(twiml: string): Promise<string> {
    return twiml;
  }

  async getMessageStatus(messageSid: string): Promise<{ status: string }> {
    await this.delay(100);

    const statuses = ['delivered', 'sent', 'read'];
    return {
      status: statuses[Math.floor(Math.random() * statuses.length)],
    };
  }

  // Create Flex workspace mock
  async createFlexWorkspace(businessName: string): Promise<{ workspaceSid: string }> {
    await this.delay(500);

    return {
      workspaceSid: this.generateSid('WS'),
    };
  }

  // Create messaging service mock
  async createMessagingService(name: string): Promise<{ sid: string }> {
    await this.delay(300);

    return {
      sid: this.generateSid('MG'),
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
