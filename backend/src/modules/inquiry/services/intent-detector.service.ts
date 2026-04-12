import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma';

export enum Intent {
  BOOKING = 'booking',
  INQUIRY = 'inquiry',
  SUPPORT = 'support',
  PRICING = 'pricing',
  GREETING = 'greeting',
  AGENT = 'agent',
  UNKNOWN = 'unknown',
}

export interface IntentResult {
  intent: Intent;
  confidence: number;
  entities: Record<string, any>;
  suggestedResponse?: string;
}

interface FAQ {
  question: string;
  answer: string;
  keywords: string[];
}

@Injectable()
export class IntentDetectorService {
  private readonly logger = new Logger(IntentDetectorService.name);

  // Keyword patterns for intent detection
  private readonly intentPatterns: Record<Intent, string[]> = {
    [Intent.BOOKING]: [
      'book', 'appointment', 'schedule', 'reserve', 'slot', 'available',
      'when can', 'availability', 'calendar', 'time slot',
    ],
    [Intent.PRICING]: [
      'price', 'cost', 'how much', 'fee', 'rate', 'charge', 'payment',
      'discount', 'offer', 'deal',
    ],
    [Intent.SUPPORT]: [
      'help', 'support', 'issue', 'problem', 'not working', 'error',
      'complaint', 'refund', 'cancel',
    ],
    [Intent.AGENT]: [
      'agent', 'human', 'person', 'talk to someone', 'real person',
      'representative', 'speak to', 'transfer',
    ],
    [Intent.GREETING]: [
      'hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening',
      'howdy', "what's up",
    ],
    [Intent.INQUIRY]: [
      'info', 'information', 'details', 'tell me', 'what is', 'how does',
      'explain', 'question', 'ask',
    ],
    [Intent.UNKNOWN]: [],
  };

  constructor(private readonly prisma: PrismaService) {}

  async detectIntent(message: string, businessId: string): Promise<IntentResult> {
    const normalizedMessage = message.toLowerCase().trim();

    // Check for explicit agent request first (highest priority)
    if (this.matchesIntent(normalizedMessage, Intent.AGENT)) {
      return {
        intent: Intent.AGENT,
        confidence: 0.95,
        entities: {},
        suggestedResponse: "I'll connect you with a team member right away.",
      };
    }

    // Check for greeting
    if (this.matchesIntent(normalizedMessage, Intent.GREETING) && normalizedMessage.length < 20) {
      const business = await this.prisma.business.findUnique({
        where: { id: businessId },
      });

      return {
        intent: Intent.GREETING,
        confidence: 0.9,
        entities: {},
        suggestedResponse: `Hi! Welcome to ${business?.name || 'our business'}. How can we help you today?`,
      };
    }

    // Check business FAQs first
    const faqMatch = await this.checkFAQs(normalizedMessage, businessId);
    if (faqMatch) {
      return {
        intent: Intent.INQUIRY,
        confidence: 0.85,
        entities: { faqQuestion: faqMatch.question },
        suggestedResponse: faqMatch.answer,
      };
    }

    // Check other intents
    const intents = [Intent.BOOKING, Intent.PRICING, Intent.SUPPORT, Intent.INQUIRY];

    for (const intent of intents) {
      if (this.matchesIntent(normalizedMessage, intent)) {
        return {
          intent,
          confidence: 0.75,
          entities: this.extractEntities(normalizedMessage, intent),
          suggestedResponse: this.getDefaultResponse(intent),
        };
      }
    }

    // Default to inquiry with low confidence
    return {
      intent: Intent.INQUIRY,
      confidence: 0.5,
      entities: {},
      suggestedResponse: "Thanks for reaching out! How can I help you today?",
    };
  }

  private matchesIntent(message: string, intent: Intent): boolean {
    const patterns = this.intentPatterns[intent];
    return patterns.some((pattern) => message.includes(pattern));
  }

  private async checkFAQs(
    message: string,
    businessId: string,
  ): Promise<{ question: string; answer: string } | null> {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    const faqResponses = business?.faqResponses as FAQ[] | null;

    if (!faqResponses || faqResponses.length === 0) {
      return null;
    }

    for (const faq of faqResponses) {
      const keywords = faq.keywords || [];
      const matchesKeyword = keywords.some((kw: string) =>
        message.includes(kw.toLowerCase()),
      );
      const matchesQuestion = message.includes(faq.question.toLowerCase().substring(0, 20));

      if (matchesKeyword || matchesQuestion) {
        return { question: faq.question, answer: faq.answer };
      }
    }

    return null;
  }

  private extractEntities(message: string, intent: Intent): Record<string, any> {
    const entities: Record<string, any> = {};

    // Extract dates
    const datePatterns = [
      /tomorrow/i,
      /today/i,
      /next week/i,
      /monday|tuesday|wednesday|thursday|friday|saturday|sunday/i,
      /\d{1,2}\/\d{1,2}/,
    ];

    for (const pattern of datePatterns) {
      const match = message.match(pattern);
      if (match) {
        entities.date = match[0];
        break;
      }
    }

    // Extract times
    const timePattern = /\d{1,2}(?::\d{2})?\s*(?:am|pm)?/i;
    const timeMatch = message.match(timePattern);
    if (timeMatch) {
      entities.time = timeMatch[0];
    }

    // Extract phone numbers
    const phonePattern = /\+?\d{10,15}/;
    const phoneMatch = message.match(phonePattern);
    if (phoneMatch) {
      entities.phone = phoneMatch[0];
    }

    return entities;
  }

  private getDefaultResponse(intent: Intent): string {
    switch (intent) {
      case Intent.BOOKING:
        return "I'd be happy to help you book an appointment! When would you like to schedule?";
      case Intent.PRICING:
        return "I can help you with pricing information. What service or product are you interested in?";
      case Intent.SUPPORT:
        return "I'm sorry to hear you're having an issue. Can you tell me more about the problem?";
      default:
        return "Thanks for reaching out! How can I assist you?";
    }
  }
}
