import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma';
import { IntentDetectorService, Intent, IntentResult } from './intent-detector.service';
import {
  Conversation,
  ConversationStatus,
  Inquiry,
  InquiryStatus,
  InquiryPriority,
  InquiryCategory,
} from '../../../generated/prisma';

export interface RoutingResult {
  action: 'auto_respond' | 'escalate' | 'route_to_booking' | 'route_to_support';
  response?: string;
  escalationReason?: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class RouterService {
  private readonly logger = new Logger(RouterService.name);

  constructor(
    private readonly intentDetector: IntentDetectorService,
    private readonly prisma: PrismaService,
  ) {}

  async routeMessage(
    conversationId: string,
    message: string,
    businessId: string,
  ): Promise<RoutingResult> {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Detect intent
    const intentResult = await this.intentDetector.detectIntent(message, businessId);

    this.logger.log(
      `Intent detected: ${intentResult.intent} (confidence: ${intentResult.confidence})`,
    );

    // Update conversation with intent
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        detectedIntent: intentResult.intent,
        intentMetadata: intentResult.entities,
      },
    });

    // Route based on intent
    return this.routeByIntent(conversation, intentResult, businessId);
  }

  private async routeByIntent(
    conversation: Conversation,
    intentResult: IntentResult,
    businessId: string,
  ): Promise<RoutingResult> {
    const { intent, confidence, suggestedResponse } = intentResult;

    // Always escalate if confidence is too low
    if (confidence < 0.5) {
      return this.escalate(conversation, 'Low confidence in intent detection');
    }

    switch (intent) {
      case Intent.AGENT:
        return this.escalate(conversation, 'Customer requested human agent');

      case Intent.GREETING:
        return {
          action: 'auto_respond',
          response: suggestedResponse,
        };

      case Intent.BOOKING:
        return {
          action: 'route_to_booking',
          response: suggestedResponse,
          metadata: intentResult.entities,
        };

      case Intent.SUPPORT:
        // Create inquiry ticket
        await this.createInquiry(conversation, businessId, InquiryCategory.SUPPORT);
        return {
          action: 'route_to_support',
          response: suggestedResponse,
        };

      case Intent.PRICING:
      case Intent.INQUIRY:
        // Auto-respond if we have a good response
        if (suggestedResponse && confidence >= 0.8) {
          return {
            action: 'auto_respond',
            response: suggestedResponse,
          };
        }
        // Otherwise escalate for human review
        await this.createInquiry(conversation, businessId, InquiryCategory.GENERAL);
        return this.escalate(conversation, 'Complex inquiry requires human review');

      default:
        return {
          action: 'auto_respond',
          response: suggestedResponse || "Thanks for your message! How can I help?",
        };
    }
  }

  private async escalate(
    conversation: Conversation,
    reason: string,
  ): Promise<RoutingResult> {
    await this.prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        status: ConversationStatus.ESCALATED,
        escalatedAt: new Date(),
        escalationReason: reason,
      },
    });

    return {
      action: 'escalate',
      escalationReason: reason,
      response: "I'm connecting you with a team member who can better assist you. Please hold.",
    };
  }

  private async createInquiry(
    conversation: Conversation,
    businessId: string,
    category: InquiryCategory,
  ): Promise<Inquiry> {
    return this.prisma.inquiry.create({
      data: {
        subject: `Inquiry from ${conversation.channel}`,
        category,
        status: InquiryStatus.OPEN,
        priority: InquiryPriority.MEDIUM,
        conversationId: conversation.id,
        contactId: conversation.contactId,
        businessId,
      },
    });
  }

  async markAsAgentHandled(conversationId: string): Promise<Conversation> {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        status: ConversationStatus.AGENT_ACTIVE,
        assignedAt: new Date(),
      },
    });
  }

  async markAsBotHandled(conversationId: string): Promise<Conversation> {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        status: ConversationStatus.BOT_HANDLED,
        assignedAgentId: null,
      },
    });
  }

  async closeConversation(conversationId: string): Promise<Conversation> {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        status: ConversationStatus.CLOSED,
      },
    });
  }
}
