import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import {
  Conversation,
  Message,
  ConversationStatus,
  ConversationChannel,
  MessageSender,
  MessageDirection,
  MessageStatus,
  Prisma,
} from '@prisma/client';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto';
import {
  SendMessageDto,
  StartConversationDto,
  EscalateConversationDto,
  AssignAgentDto,
  ConversationQueryDto,
} from './dto';

@Injectable()
export class ConversationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    businessId: string,
    pagination: PaginationDto,
    filters?: ConversationQueryDto,
  ): Promise<PaginatedResponseDto<Conversation>> {
    const where: Prisma.ConversationWhereInput = {
      businessId,
    };

    if (filters?.channel) {
      where.channel = filters.channel;
    }
    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.starred !== undefined) {
      where.starred = filters.starred;
    }
    if (filters?.assignedAgentId) {
      where.assignedAgentId = filters.assignedAgentId;
    }
    if (filters?.search) {
      where.OR = [
        { subject: { contains: filters.search, mode: 'insensitive' } },
        { lastMessagePreview: { contains: filters.search, mode: 'insensitive' } },
        { contact: { firstName: { contains: filters.search, mode: 'insensitive' } } },
        { contact: { lastName: { contains: filters.search, mode: 'insensitive' } } },
        { contact: { phone: { contains: filters.search } } },
      ];
    }

    // Determine sort - use safe defaults
    let orderBy: Prisma.ConversationOrderByWithRelationInput = { lastMessageAt: 'desc' };
    if (pagination.sortBy === 'createdAt') {
      orderBy = { createdAt: pagination.sortOrder || 'desc' };
    } else if (pagination.sortBy === 'lastMessageAt') {
      orderBy = { lastMessageAt: pagination.sortOrder || 'desc' };
    } else if (pagination.sortBy === 'status') {
      orderBy = { status: pagination.sortOrder || 'desc' };
    }

    const [data, total] = await Promise.all([
      this.prisma.conversation.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy,
        include: {
          contact: true,
          messages: {
            take: 1,
            orderBy: { createdAt: 'desc' },
          },
        },
      }),
      this.prisma.conversation.count({ where }),
    ]);

    return PaginatedResponseDto.create(data, total, pagination);
  }

  async findOne(businessId: string, id: string): Promise<Conversation> {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id, businessId },
      include: {
        contact: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
        assignedAgent: true,
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
  }

  async getMessages(
    businessId: string,
    conversationId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResponseDto<Message>> {
    // Verify conversation exists and belongs to business
    await this.findOne(businessId, conversationId);

    const where: Prisma.MessageWhereInput = {
      conversationId,
    };

    const [data, total] = await Promise.all([
      this.prisma.message.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.message.count({ where }),
    ]);

    return PaginatedResponseDto.create(data, total, pagination);
  }

  async sendMessage(
    businessId: string,
    conversationId: string,
    dto: SendMessageDto,
    agentId?: string,
  ): Promise<Message> {
    const conversation = await this.findOne(businessId, conversationId);

    const message = await this.prisma.message.create({
      data: {
        body: dto.body,
        direction: MessageDirection.OUTBOUND,
        sender: agentId ? MessageSender.AGENT : MessageSender.BOT,
        status: MessageStatus.PENDING,
        mediaUrls: dto.mediaUrls || [],
        conversationId,
        agentId,
      },
    });

    // Update conversation last message
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessagePreview: dto.body.substring(0, 100),
        lastMessageAt: new Date(),
      },
    });

    // TODO: Integrate with Twilio to actually send the message
    // This will be handled by the messaging service

    return message;
  }

  async startConversation(
    businessId: string,
    dto: StartConversationDto,
    agentId?: string,
  ): Promise<Conversation> {
    // Verify contact belongs to business
    const contact = await this.prisma.contact.findFirst({
      where: { id: dto.contactId, businessId },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    // Check if active conversation already exists
    const existing = await this.prisma.conversation.findFirst({
      where: {
        contactId: dto.contactId,
        businessId,
        channel: dto.channel,
        status: {
          notIn: [ConversationStatus.CLOSED],
        },
      },
    });

    if (existing) {
      throw new BadRequestException('Active conversation already exists with this contact');
    }

    // Create conversation with initial message
    const conversation = await this.prisma.conversation.create({
      data: {
        channel: dto.channel,
        status: agentId ? ConversationStatus.AGENT_ACTIVE : ConversationStatus.BOT_HANDLED,
        lastMessagePreview: dto.message.substring(0, 100),
        lastMessageAt: new Date(),
        contactId: dto.contactId,
        businessId,
        assignedAgentId: agentId,
        messages: {
          create: {
            body: dto.message,
            direction: MessageDirection.OUTBOUND,
            sender: agentId ? MessageSender.AGENT : MessageSender.BOT,
            status: MessageStatus.PENDING,
            agentId,
          },
        },
      },
      include: {
        contact: true,
        messages: true,
      },
    });

    return conversation;
  }

  async close(businessId: string, id: string): Promise<Conversation> {
    await this.findOne(businessId, id);

    return this.prisma.conversation.update({
      where: { id },
      data: {
        status: ConversationStatus.CLOSED,
      },
    });
  }

  async reopen(businessId: string, id: string): Promise<Conversation> {
    const conversation = await this.findOne(businessId, id);

    if (conversation.status !== ConversationStatus.CLOSED) {
      throw new BadRequestException('Conversation is not closed');
    }

    return this.prisma.conversation.update({
      where: { id },
      data: {
        status: conversation.assignedAgentId
          ? ConversationStatus.AGENT_ACTIVE
          : ConversationStatus.BOT_HANDLED,
      },
    });
  }

  async escalate(
    businessId: string,
    id: string,
    dto: EscalateConversationDto,
  ): Promise<Conversation> {
    await this.findOne(businessId, id);

    return this.prisma.conversation.update({
      where: { id },
      data: {
        status: ConversationStatus.ESCALATED,
        escalatedAt: new Date(),
        escalationReason: dto.reason,
        assignedAgentId: dto.agentId,
        assignedAt: dto.agentId ? new Date() : undefined,
      },
    });
  }

  async assignAgent(
    businessId: string,
    id: string,
    dto: AssignAgentDto,
  ): Promise<Conversation> {
    await this.findOne(businessId, id);

    // Verify agent exists
    const agent = await this.prisma.user.findUnique({
      where: { id: dto.agentId },
    });

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    return this.prisma.conversation.update({
      where: { id },
      data: {
        status: ConversationStatus.AGENT_ACTIVE,
        assignedAgentId: dto.agentId,
        assignedAt: new Date(),
      },
    });
  }

  async unassignAgent(businessId: string, id: string): Promise<Conversation> {
    await this.findOne(businessId, id);

    return this.prisma.conversation.update({
      where: { id },
      data: {
        status: ConversationStatus.BOT_HANDLED,
        assignedAgentId: null,
        assignedAt: null,
      },
    });
  }

  async toggleStar(businessId: string, id: string): Promise<Conversation> {
    const conversation = await this.findOne(businessId, id);

    return this.prisma.conversation.update({
      where: { id },
      data: { starred: !conversation.starred },
    });
  }

  async markAsRead(businessId: string, id: string): Promise<Conversation> {
    await this.findOne(businessId, id);

    return this.prisma.conversation.update({
      where: { id },
      data: { unreadCount: 0 },
    });
  }

  async getStats(businessId: string): Promise<{
    total: number;
    botHandled: number;
    escalated: number;
    agentActive: number;
    closed: number;
    unread: number;
  }> {
    const [total, botHandled, escalated, agentActive, closed, unread] =
      await Promise.all([
        this.prisma.conversation.count({ where: { businessId } }),
        this.prisma.conversation.count({
          where: { businessId, status: ConversationStatus.BOT_HANDLED },
        }),
        this.prisma.conversation.count({
          where: { businessId, status: ConversationStatus.ESCALATED },
        }),
        this.prisma.conversation.count({
          where: { businessId, status: ConversationStatus.AGENT_ACTIVE },
        }),
        this.prisma.conversation.count({
          where: { businessId, status: ConversationStatus.CLOSED },
        }),
        this.prisma.conversation.count({
          where: { businessId, unreadCount: { gt: 0 } },
        }),
      ]);

    return { total, botHandled, escalated, agentActive, closed, unread };
  }
}
