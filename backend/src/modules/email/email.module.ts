import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { EmailWebhookController } from './email-webhook.controller';

@Module({
  imports: [ConfigModule],
  controllers: [EmailController, EmailWebhookController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
