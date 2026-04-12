import {
  Controller,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';
import { PrismaService } from '../../prisma';
import {
  ConversationChannel,
  ConversationStatus,
  MessageDirection,
  MessageSender,
  MessageStatus,
} from '@prisma/client';

// Twilio webhook payload types
interface TwilioSmsWebhook {
  MessageSid: string;
  AccountSid: string;
  From: string;
  To: string;
  Body: string;
  NumMedia?: string;
  MediaUrl0?: string;
}

interface TwilioVoiceWebhook {
  CallSid: string;
  AccountSid: string;
  From: string;
  To: string;
  CallStatus: string;
  Direction: string;
}

@ApiTags('twilio-webhooks')
@Controller('twilio/webhook')
export class TwilioWebhookController {
  private readonly logger = new Logger(TwilioWebhookController.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Single entry point for all incoming SMS/WhatsApp messages
   * POST /api/twilio/webhook/sms?businessId=xxx
   */
  @Post('sms')
  @HttpCode(HttpStatus.OK)
  @ApiExcludeEndpoint()
  async handleIncomingSms(
    @Body() payload: TwilioSmsWebhook,
    @Query('businessId') businessId: string,
  ): Promise<string> {
    this.logger.log(`Incoming SMS for business ${businessId}: ${payload.From}`);

    try {
      // Determine if it's WhatsApp
      const isWhatsApp = payload.From.startsWith('whatsapp:');
      const channel = isWhatsApp ? ConversationChannel.WHATSAPP : ConversationChannel.SMS;
      const fromNumber = isWhatsApp ? payload.From.replace('whatsapp:', '') : payload.From;

      // Find or create contact
      let contact = await this.prisma.contact.findFirst({
        where: { phone: fromNumber, businessId },
      });

      if (!contact) {
        contact = await this.prisma.contact.create({
          data: {
            phone: fromNumber,
            businessId,
            source: channel,
          },
        });
        this.logger.log(`Created new contact: ${fromNumber}`);
      }

      // Find or create conversation
      let conversation = await this.prisma.conversation.findFirst({
        where: {
          contactId: contact.id,
          businessId,
          channel,
          status: ConversationStatus.BOT_HANDLED,
        },
      });

      if (!conversation) {
        // Check for any open conversation
        conversation = await this.prisma.conversation.findFirst({
          where: {
            contactId: contact.id,
            businessId,
            channel,
          },
          orderBy: { createdAt: 'desc' },
        });
      }

      if (!conversation || conversation.status === ConversationStatus.CLOSED) {
        conversation = await this.prisma.conversation.create({
          data: {
            channel,
            status: ConversationStatus.BOT_HANDLED,
            contactId: contact.id,
            businessId,
          },
        });
        this.logger.log(`Created new conversation for contact: ${contact.id}`);
      }

      // Create message
      await this.prisma.message.create({
        data: {
          body: payload.Body,
          direction: MessageDirection.INBOUND,
          sender: MessageSender.CUSTOMER,
          status: MessageStatus.DELIVERED,
          twilioMessageSid: payload.MessageSid,
          twilioFrom: payload.From,
          twilioTo: payload.To,
          conversationId: conversation.id,
          mediaUrls:
            payload.NumMedia && parseInt(payload.NumMedia) > 0
              ? [payload.MediaUrl0].filter((url): url is string => !!url)
              : undefined,
        },
      });

      // Update conversation
      await this.prisma.conversation.update({
        where: { id: conversation.id },
        data: {
          lastMessagePreview: payload.Body.substring(0, 100),
          lastMessageAt: new Date(),
          unreadCount: { increment: 1 },
        },
      });

      // TODO: Pass to Inquiry Engine for intent detection and response
      // For now, return empty TwiML (no auto-response)
      return '<?xml version="1.0" encoding="UTF-8"?><Response></Response>';
    } catch (error) {
      this.logger.error(`Error handling SMS webhook: ${error}`);
      return '<?xml version="1.0" encoding="UTF-8"?><Response></Response>';
    }
  }

  /**
   * Single entry point for all incoming voice calls
   * POST /api/twilio/webhook/voice?businessId=xxx
   */
  @Post('voice')
  @HttpCode(HttpStatus.OK)
  @ApiExcludeEndpoint()
  async handleIncomingVoice(
    @Body() payload: TwilioVoiceWebhook,
    @Query('businessId') businessId: string,
  ): Promise<string> {
    this.logger.log(`Incoming call for business ${businessId}: ${payload.From}`);

    try {
      // Find business to get settings
      const business = await this.prisma.business.findUnique({
        where: { id: businessId },
        include: { features: true },
      });

      if (!business) {
        this.logger.error(`Business not found: ${businessId}`);
        return this.generateVoiceTwiml('Sorry, this number is not configured.');
      }

      // Check if support feature is enabled
      const hasSupport = business.features?.some(
        (f) => f.featureType === 'SUPPORT' && f.enabled,
      );

      if (!hasSupport) {
        return this.generateVoiceTwiml(
          'Thank you for calling. Please leave a message after the beep.',
          true, // Enable voicemail
        );
      }

      // Generate IVR response
      return this.generateIvrTwiml(businessId);
    } catch (error) {
      this.logger.error(`Error handling voice webhook: ${error}`);
      return this.generateVoiceTwiml('An error occurred. Please try again later.');
    }
  }

  /**
   * Voice status callback
   */
  @Post('voice/status')
  @HttpCode(HttpStatus.OK)
  @ApiExcludeEndpoint()
  async handleVoiceStatus(
    @Body() payload: TwilioVoiceWebhook,
    @Query('businessId') businessId: string,
  ): Promise<string> {
    this.logger.log(`Voice status for ${businessId}: ${payload.CallStatus}`);
    return 'OK';
  }

  /**
   * SMS delivery status callback
   */
  @Post('sms/status')
  @HttpCode(HttpStatus.OK)
  @ApiExcludeEndpoint()
  async handleSmsStatus(
    @Body() payload: { MessageSid: string; MessageStatus: string },
    @Query('businessId') businessId: string,
  ): Promise<string> {
    this.logger.log(`SMS status for ${businessId}: ${payload.MessageStatus}`);

    // Update message status in database
    const message = await this.prisma.message.findFirst({
      where: { twilioMessageSid: payload.MessageSid },
    });

    if (message) {
      await this.prisma.message.update({
        where: { id: message.id },
        data: { status: this.mapTwilioStatus(payload.MessageStatus) },
      });
    }

    return 'OK';
  }

  private generateVoiceTwiml(message: string, voicemail = false): string {
    if (voicemail) {
      return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">${message}</Say>
  <Record maxLength="120" transcribe="true" />
</Response>`;
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">${message}</Say>
</Response>`;
  }

  private generateIvrTwiml(businessId: string): string {
    const baseUrl = process.env.WEBHOOK_BASE_URL || 'http://localhost:3001/api';

    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather numDigits="1" action="${baseUrl}/twilio/webhook/voice/gather?businessId=${businessId}" method="POST">
    <Say voice="alice">
      Thank you for calling.
      Press 1 to receive our booking link via SMS.
      Press 2 to speak with an agent.
      Press 3 to leave a message.
    </Say>
  </Gather>
  <Say voice="alice">We didn't receive any input. Goodbye.</Say>
</Response>`;
  }

  @Post('voice/gather')
  @HttpCode(HttpStatus.OK)
  @ApiExcludeEndpoint()
  async handleVoiceGather(
    @Body() payload: TwilioVoiceWebhook & { Digits: string },
    @Query('businessId') businessId: string,
  ): Promise<string> {
    const digit = payload.Digits;
    this.logger.log(`IVR digit pressed: ${digit} for business ${businessId}`);

    switch (digit) {
      case '1':
        // Send booking link via SMS
        return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">We will send you a booking link via text message. Goodbye.</Say>
</Response>`;

      case '2':
        // Connect to agent (would integrate with Flex)
        return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Please hold while we connect you to an agent.</Say>
  <Enqueue waitUrl="/api/twilio/webhook/voice/hold">support</Enqueue>
</Response>`;

      case '3':
        // Leave voicemail
        return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Please leave your message after the beep.</Say>
  <Record maxLength="120" transcribe="true" />
</Response>`;

      default:
        return this.generateIvrTwiml(businessId);
    }
  }

  private mapTwilioStatus(status: string): MessageStatus {
    switch (status.toLowerCase()) {
      case 'delivered':
        return MessageStatus.DELIVERED;
      case 'read':
        return MessageStatus.READ;
      case 'failed':
      case 'undelivered':
        return MessageStatus.FAILED;
      default:
        return MessageStatus.SENT;
    }
  }
}
