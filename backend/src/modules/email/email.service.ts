import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { PrismaService } from '../../prisma';
import { SendEmailDto, InboundEmailDto } from './dto';
import {
  ConversationChannel,
  ConversationStatus,
  MessageDirection,
  MessageSender,
  MessageStatus,
} from '@prisma/client';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (!apiKey) {
      this.logger.warn('RESEND_API_KEY not configured - email functionality will be limited');
    }
    this.resend = new Resend(apiKey);
  }

  /**
   * Send an email via Resend and create a message record
   */
  async sendEmail(businessId: string, dto: SendEmailDto) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const fromAddress = business.emailFromAddress || this.configService.get<string>('EMAIL_FROM_DEFAULT');
    const fromName = business.emailFromName || business.name;

    if (!fromAddress) {
      throw new BadRequestException('No email from address configured');
    }

    // Find or create contact
    let contact = dto.contactId
      ? await this.prisma.contact.findUnique({ where: { id: dto.contactId } })
      : await this.prisma.contact.findFirst({
          where: { email: dto.to, businessId },
        });

    if (!contact) {
      contact = await this.prisma.contact.create({
        data: {
          email: dto.to,
          phone: '', // Required field - email-only contacts
          source: 'email',
          businessId,
        },
      });
    }

    // Check opt-out
    if (contact.optedOutEmail) {
      throw new BadRequestException('Contact has opted out of email communications');
    }

    // Find or create conversation
    let conversation = dto.conversationId
      ? await this.prisma.conversation.findUnique({ where: { id: dto.conversationId } })
      : await this.prisma.conversation.findFirst({
          where: {
            contactId: contact.id,
            channel: ConversationChannel.EMAIL,
            status: { not: ConversationStatus.CLOSED },
          },
          orderBy: { createdAt: 'desc' },
        });

    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: {
          channel: ConversationChannel.EMAIL,
          status: ConversationStatus.AGENT_ACTIVE,
          subject: dto.subject,
          contactId: contact.id,
          businessId,
        },
      });
    }

    // Send via Resend
    const { data: emailResult, error } = await this.resend.emails.send({
      from: `${fromName} <${fromAddress}>`,
      to: dto.to,
      subject: dto.subject,
      text: dto.text || 'No content',
      html: dto.html,
      cc: dto.cc,
      bcc: dto.bcc,
      replyTo: dto.replyTo || fromAddress,
    } as any); // Use any to handle varying Resend API versions

    if (error) {
      this.logger.error('Failed to send email via Resend', error);
      throw new BadRequestException(`Failed to send email: ${error.message}`);
    }

    // Create message record
    const message = await this.prisma.message.create({
      data: {
        body: dto.text || dto.html || '',
        direction: MessageDirection.OUTBOUND,
        sender: MessageSender.AGENT,
        status: MessageStatus.SENT,
        emailMessageId: emailResult?.id,
        emailSubject: dto.subject,
        emailFrom: `${fromName} <${fromAddress}>`,
        emailTo: dto.to,
        emailCc: dto.cc?.join(', '),
        emailBcc: dto.bcc?.join(', '),
        emailHtml: dto.html,
        conversationId: conversation.id,
      },
    });

    // Update conversation
    await this.prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        lastMessagePreview: dto.subject,
        lastMessageAt: new Date(),
      },
    });

    // Update contact last contacted
    await this.prisma.contact.update({
      where: { id: contact.id },
      data: { lastContactedAt: new Date() },
    });

    this.logger.log(`Email sent successfully: ${emailResult?.id} to ${dto.to}`);

    return {
      messageId: message.id,
      emailId: emailResult?.id,
      conversationId: conversation.id,
      contactId: contact.id,
    };
  }

  /**
   * Process an inbound email webhook from Resend
   */
  async handleInboundEmail(businessId: string, payload: InboundEmailDto) {
    const { data } = payload;

    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    // Extract sender email
    const fromEmail = this.extractEmail(data.from);
    if (!fromEmail) {
      throw new BadRequestException('Invalid sender email');
    }

    // Find or create contact
    let contact = await this.prisma.contact.findFirst({
      where: { email: fromEmail, businessId },
    });

    if (!contact) {
      const fromName = this.extractName(data.from);
      contact = await this.prisma.contact.create({
        data: {
          email: fromEmail,
          firstName: fromName?.split(' ')[0],
          lastName: fromName?.split(' ').slice(1).join(' '),
          phone: '', // Required field
          source: 'email',
          businessId,
        },
      });
      this.logger.log(`Created new contact from inbound email: ${contact.id}`);
    }

    // Find existing conversation or create new one
    // Try to find by subject (for threading) or most recent email conversation
    let conversation = await this.findConversationByEmailThread(contact.id, data.subject, businessId);

    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: {
          channel: ConversationChannel.EMAIL,
          status: ConversationStatus.BOT_HANDLED,
          subject: data.subject,
          detectedIntent: 'general',
          contactId: contact.id,
          businessId,
        },
      });
      this.logger.log(`Created new email conversation: ${conversation.id}`);
    }

    // Create message record
    const bodyText = data.text || this.stripHtml(data.html || '') || 'No content';
    const message = await this.prisma.message.create({
      data: {
        body: bodyText,
        direction: MessageDirection.INBOUND,
        sender: MessageSender.CUSTOMER,
        status: MessageStatus.DELIVERED,
        emailMessageId: data.id,
        emailSubject: data.subject,
        emailFrom: data.from,
        emailTo: data.to?.join(', '),
        emailHtml: data.html,
        mediaUrls: data.attachments?.map(a => a.filename) || [],
        metadata: data.attachments ? { attachments: data.attachments.map(a => ({ filename: a.filename, contentType: a.content_type })) } : {},
        conversationId: conversation.id,
      },
    });

    // Update conversation
    await this.prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        lastMessagePreview: bodyText.substring(0, 100),
        lastMessageAt: new Date(),
        unreadCount: { increment: 1 },
      },
    });

    this.logger.log(`Inbound email processed: ${message.id} from ${fromEmail}`);

    return {
      messageId: message.id,
      conversationId: conversation.id,
      contactId: contact.id,
      isNewConversation: !conversation,
    };
  }

  /**
   * Process an email status webhook (delivered, opened, etc.) from Resend
   */
  async handleEmailStatusWebhook(payload: { type: string; data: { email_id: string; [key: string]: unknown } }) {
    const { type, data } = payload;
    const emailId = data.email_id;

    const message = await this.prisma.message.findFirst({
      where: { emailMessageId: emailId },
    });

    if (!message) {
      this.logger.warn(`No message found for email webhook: ${emailId}`);
      return { success: false, reason: 'Message not found' };
    }

    let newStatus: MessageStatus | null = null;

    switch (type) {
      case 'email.delivered':
        newStatus = MessageStatus.DELIVERED;
        break;
      case 'email.opened':
        newStatus = MessageStatus.READ;
        break;
      case 'email.bounced':
      case 'email.complained':
        newStatus = MessageStatus.FAILED;
        break;
    }

    if (newStatus) {
      await this.prisma.message.update({
        where: { id: message.id },
        data: { status: newStatus },
      });
      this.logger.log(`Updated message ${message.id} status to ${newStatus}`);
    }

    return { success: true, messageId: message.id, status: newStatus };
  }

  /**
   * Find an existing conversation that matches this email thread
   */
  private async findConversationByEmailThread(
    contactId: string,
    subject: string,
    businessId: string,
  ) {
    // Remove common reply prefixes for thread matching
    const normalizedSubject = subject
      ?.replace(/^(Re:|Fwd:|FW:|RE:|Fw:)\s*/gi, '')
      .trim();

    // Try to find an open conversation with matching subject
    return this.prisma.conversation.findFirst({
      where: {
        contactId,
        businessId,
        channel: ConversationChannel.EMAIL,
        status: { not: ConversationStatus.CLOSED },
        subject: {
          contains: normalizedSubject,
          mode: 'insensitive',
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });
  }

  /**
   * Extract email address from "Name <email@example.com>" format
   */
  private extractEmail(fromString: string): string | null {
    // Handle formats like "Name <email@example.com>" or just "email@example.com"
    const match = fromString.match(/<([^>]+)>/) || fromString.match(/([^\s<>]+@[^\s<>]+)/);
    return match ? match[1] : null;
  }

  /**
   * Extract name from "Name <email@example.com>" format
   */
  private extractName(fromString: string): string | null {
    // Extract name from "Name <email@example.com>" format
    const match = fromString.match(/^([^<]+)</);
    return match ? match[1].trim() : null;
  }

  /**
   * Remove HTML tags from a string
   */
  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').trim();
  }
}
