import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';
import { CampaignProcessor } from './campaigns.processor';
import { TwilioModule } from '../twilio/twilio.module';
import { EmailModule } from '../email/email.module';
import { CAMPAIGN_QUEUE } from './campaigns.constants';

@Module({
  imports: [
    TwilioModule,
    EmailModule,
    BullModule.registerQueue({
      name: CAMPAIGN_QUEUE,
    }),
  ],
  controllers: [CampaignsController],
  providers: [CampaignsService, CampaignProcessor],
  exports: [CampaignsService],
})
export class CampaignsModule {}
