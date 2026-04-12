import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { TwilioService } from '../twilio/twilio.service';
import { EmailService } from '../email/email.service';
import {
  ConversationChannel,
  ConversationStatus,
  MessageDirection,
  MessageSender,
  MessageStatus,
  Conversation,
  Message,
} from '@prisma/client';

export interface SendMessageOptions {
  // For email channel
  subject?: string;
  html?: string;
  cc?: string[];
  bcc?: string[];
}

@Injectable()
export class MessagingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly twilioService: TwilioService,
    private readonly emailService: EmailService,
  ) {}

  async getConversations(
    businessId: string,
    options?: {
      channel?: ConversationChannel;
      status?: ConversationStatus;
      limit?: number;
    },
  ): Promise<Conversation[]> {
    return this.prisma.conversation.findMany({
      where: {
        businessId,
        ...(options?.channel && { channel: options.channel }),
        ...(options?.status && { status: options.status }),
      },
      include: {
        contact: true,
      },
      orderBy: {
        lastMessageAt: 'desc',
      },
      take: options?.limit,
    });
  }

  async getConversation(businessId: string, id: string): Promise<Conversation & { contact: any; messages: Message[]; assignedAgent: any }> {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id, businessId },
      include: {
        contact: true,
        messages: {
          orderBy: { createdAt: 'asc' },
        },
        assignedAgent: true,
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Mark as read
    if (conversation.unreadCount > 0) {
      await this.prisma.conversation.update({
        where: { id },
        data: { unreadCount: 0 },
      });
    }

    return conversation;
  }

  async getMessages(
    conversationId: string,
    options?: { limit?: number; offset?: number },
  ): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      take: options?.limit || 50,
      skip: options?.offset || 0,
    });
  }

  async sendMessage(
    businessId: string,
    conversationId: string,
    body: string,
    senderId: string,
    senderType: 'agent' | 'bot' = 'agent',
    options?: SendMessageOptions,
  ): Promise<Message> {
    const conversation = await this.getConversation(businessId, conversationId);

    let message: Message;

    // Route to appropriate channel
    if (conversation.channel === ConversationChannel.EMAIL) {
      // Use EmailService for email channel
      const emailResult = await this.emailService.sendEmail(businessId, {
        to: conversation.contact.email!,
        subject: options?.subject || conversation.subject || 'Re: Your inquiry',
        text: body,
        html: options?.html,
        cc: options?.cc,
        bcc: options?.bcc,
        conversationId,
        contactId: conversation.contactId,
      });

      // Get the created message
      message = await this.prisma.message.findUnique({
        where: { id: emailResult.messageId },
      }) as Message;
    } else {
      // Use Twilio for SMS/WhatsApp/Voice
      let twilioResult;
      if (conversation.channel === ConversationChannel.WHATSAPP) {
        twilioResult = await this.twilioService.sendWhatsApp(
          businessId,
          conversation.contact.phone,
          body,
        );
      } else if (conversation.channel === ConversationChannel.SMS) {
        twilioResult = await this.twilioService.sendSMS(
          businessId,
          conversation.contact.phone,
          body,
        );
      } else if (conversation.channel === ConversationChannel.VOICE) {
        // Voice channel - would typically be a call, not a message
        throw new BadRequestException('Cannot send text message on voice channel');
      } else {
        throw new BadRequestException(`Unsupported channel: ${conversation.channel}`);
      }

      // Create message record
      message = await this.prisma.message.create({
        data: {
          body,
          direction: MessageDirection.OUTBOUND,
          sender: senderType === 'bot' ? MessageSender.BOT : MessageSender.AGENT,
          status: MessageStatus.SENT,
          twilioMessageSid: twilioResult.sid,
          conversationId,
          agentId: senderType === 'agent' ? senderId : undefined,
        },
      });
    }

    // Update conversation
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessagePreview: body.substring(0, 100),
        lastMessageAt: new Date(),
        ...(senderType === 'agent' && { status: ConversationStatus.AGENT_ACTIVE }),
      },
    });

    return message;
  }

  async takeoverConversation(
    businessId: string,
    conversationId: string,
    agentId: string,
  ): Promise<Conversation> {
    const conversation = await this.getConversation(businessId, conversationId);

    return this.prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        status: ConversationStatus.AGENT_ACTIVE,
        assignedAgentId: agentId,
        assignedAt: new Date(),
      },
    });
  }

  async releaseToBot(businessId: string, conversationId: string): Promise<Conversation> {
    const conversation = await this.getConversation(businessId, conversationId);

    return this.prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        status: ConversationStatus.BOT_HANDLED,
        assignedAgentId: null,
      },
    });
  }

  async closeConversation(businessId: string, conversationId: string): Promise<Conversation> {
    const conversation = await this.getConversation(businessId, conversationId);

    return this.prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        status: ConversationStatus.CLOSED,
      },
    });
  }

  async toggleStar(businessId: string, conversationId: string): Promise<Conversation> {
    const conversation = await this.getConversation(businessId, conversationId);

    return this.prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        starred: !conversation.starred,
      },
    });
  }
}
