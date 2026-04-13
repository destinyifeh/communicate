import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TwilioController } from './twilio.controller';
import { TwilioWebhookController } from './twilio-webhook.controller';
import { VoiceController } from './voice.controller';
import { TwilioService } from './twilio.service';
import { SubaccountService } from './services/subaccount.service';
import { PhoneProvisioningService } from './services/phone-provisioning.service';
import { MockTwilioService } from './services/mock-twilio.service';
import { VoiceService } from './services/voice.service';

@Module({
  imports: [ConfigModule],
  // PrismaModule is global, so PrismaService is already available
  controllers: [TwilioController, TwilioWebhookController, VoiceController],
  providers: [
    TwilioService,
    SubaccountService,
    PhoneProvisioningService,
    MockTwilioService,
    VoiceService,
  ],
  exports: [TwilioService, VoiceService],
})
export class TwilioModule {}
