import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { Conversation, ConversationStatus } from '../../generated/prisma';

@Injectable()
export class SupportService {
  constructor(private readonly prisma: PrismaService) {}

  async getEscalatedConversations(businessId: string): Promise<Conversation[]> {
    return this.prisma.conversation.findMany({
      where: { businessId, status: ConversationStatus.ESCALATED },
      include: {
        contact: true,
        messages: true,
      },
      orderBy: { escalatedAt: 'desc' },
    });
  }

  async assignAgent(conversationId: string, agentId: string): Promise<Conversation> {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        assignedAgentId: agentId,
        status: ConversationStatus.AGENT_ACTIVE,
        assignedAt: new Date(),
      },
    });
  }

  async getAgentStats(businessId: string, agentId: string) {
    const activeCount = await this.prisma.conversation.count({
      where: {
        businessId,
        assignedAgentId: agentId,
        status: ConversationStatus.AGENT_ACTIVE,
      },
    });

    // Get today's date range
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const closedToday = await this.prisma.conversation.count({
      where: {
        businessId,
        assignedAgentId: agentId,
        status: ConversationStatus.CLOSED,
        updatedAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    return {
      activeConversations: activeCount,
      closedToday,
    };
  }
}
