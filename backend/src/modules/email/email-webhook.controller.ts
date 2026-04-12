import {
  Controller,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  Logger,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import { InboundEmailDto, EmailWebhookEventDto } from './dto';

@Controller('email/webhook')
export class EmailWebhookController {
  private readonly logger = new Logger(EmailWebhookController.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Handle inbound emails from Resend
   * POST /api/email/webhook/inbound?businessId=xxx
   */
  @Post('inbound')
  @HttpCode(HttpStatus.OK)
  async handleInboundEmail(
    @Query('businessId') businessId: string,
    @Body() payload: InboundEmailDto,
    @Headers('svix-id') svixId?: string,
    @Headers('svix-timestamp') svixTimestamp?: string,
    @Headers('svix-signature') svixSignature?: string,
  ) {
    this.logger.log(`Received inbound email webhook for business: ${businessId}`);

    if (!businessId) {
      throw new BadRequestException('businessId query parameter is required');
    }

    // TODO: Verify webhook signature in production
    // Resend uses Svix for webhook delivery
    // See: https://resend.com/docs/dashboard/webhooks/verify-webhooks

    try {
      const result = await this.emailService.handleInboundEmail(businessId, payload);

      this.logger.log(`Inbound email processed successfully: ${result.messageId}`);

      return {
        success: true,
        messageId: result.messageId,
        conversationId: result.conversationId,
      };
    } catch (error) {
      this.logger.error('Failed to process inbound email', error);
      throw error;
    }
  }

  /**
   * Handle email status webhooks from Resend
   * POST /api/email/webhook/status
   * Events: email.sent, email.delivered, email.bounced, email.complained, email.opened, email.clicked
   */
  @Post('status')
  @HttpCode(HttpStatus.OK)
  async handleStatusWebhook(
    @Body() payload: EmailWebhookEventDto,
    @Headers('svix-id') svixId?: string,
    @Headers('svix-timestamp') svixTimestamp?: string,
    @Headers('svix-signature') svixSignature?: string,
  ) {
    this.logger.log(`Received email status webhook: ${payload.type}`);

    // TODO: Verify webhook signature in production

    try {
      const result = await this.emailService.handleEmailStatusWebhook({
        type: payload.type,
        data: payload.data,
      });

      return result;
    } catch (error) {
      this.logger.error('Failed to process status webhook', error);
      throw error;
    }
  }
}
