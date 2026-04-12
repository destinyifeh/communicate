import { Module } from '@nestjs/common';
import { TwilioController } from './twilio.controller';
import { TwilioWebhookController } from './twilio-webhook.controller';
import { TwilioService } from './twilio.service';
import { SubaccountService } from './services/subaccount.service';
import { PhoneProvisioningService } from './services/phone-provisioning.service';
import { MockTwilioService } from './services/mock-twilio.service';

@Module({
  // PrismaModule is global, so PrismaService is already available
  controllers: [TwilioController, TwilioWebhookController],
  providers: [
    TwilioService,
    SubaccountService,
    PhoneProvisioningService,
    MockTwilioService,
  ],
  exports: [TwilioService],
})
export class TwilioModule {}
