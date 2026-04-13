import { Module } from '@nestjs/common';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import { PrismaModule } from '../../prisma';
import { TwilioModule } from '../twilio/twilio.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [PrismaModule, TwilioModule, EmailModule],
  controllers: [ConversationsController],
  providers: [ConversationsService],
  exports: [ConversationsService],
})
export class ConversationsModule {}
