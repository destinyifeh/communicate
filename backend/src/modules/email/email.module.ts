import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { EmailWebhookController } from './email-webhook.controller';
import { PrismaModule } from '../../prisma';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [EmailController, EmailWebhookController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
