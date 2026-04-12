import { Module } from '@nestjs/common';
import { MessagingController } from './messaging.controller';
import { MessagingService } from './messaging.service';
import { TwilioModule } from '../twilio/twilio.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [TwilioModule, EmailModule],
  controllers: [MessagingController],
  providers: [MessagingService],
  exports: [MessagingService],
})
export class MessagingModule {}
