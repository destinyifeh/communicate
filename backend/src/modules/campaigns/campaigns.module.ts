import { Module } from '@nestjs/common';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';
import { TwilioModule } from '../twilio/twilio.module';
import { EmailModule } from '../email/email.module';

@Module({
  // PrismaModule is global, so PrismaService is already available
  imports: [TwilioModule, EmailModule],
  controllers: [CampaignsController],
  providers: [CampaignsService],
  exports: [CampaignsService],
})
export class CampaignsModule {}
