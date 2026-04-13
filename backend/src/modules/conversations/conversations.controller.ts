import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ConversationsService } from './conversations.service';
import {
  SendMessageDto,
  StartConversationDto,
  EscalateConversationDto,
  AssignAgentDto,
  ConversationQueryDto,
} from './dto';
import { PaginationDto } from '../../common/dto';
import { Conversation, Message } from '@prisma/client';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentBusiness } from '../../common/decorators/current-business.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('conversations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all conversations with pagination' })
  @ApiResponse({ status: 200, description: 'Conversations retrieved successfully' })
  findAll(
    @CurrentBusiness() businessId: string,
    @Query() query: ConversationQueryDto,
  ) {
    return this.conversationsService.findAll(businessId, query, query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get conversation statistics' })
  @ApiResponse({ status: 200, description: 'Stats retrieved successfully' })
  getStats(@CurrentBusiness() businessId: string) {
    return this.conversationsService.getStats(businessId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a conversation by ID' })
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  @ApiResponse({ status: 200, description: 'Conversation retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  findOne(
    @CurrentBusiness() businessId: string,
    @Param('id') id: string,
  ) {
    return this.conversationsService.findOne(businessId, id);
  }

  @Get(':id/messages')
  @ApiOperation({ summary: 'Get messages for a conversation' })
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  @ApiResponse({ status: 200, description: 'Messages retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  getMessages(
    @CurrentBusiness() businessId: string,
    @Param('id') id: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.conversationsService.getMessages(businessId, id, pagination);
  }

  @Post(':id/messages')
  @ApiOperation({ summary: 'Send a message in a conversation' })
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  @ApiResponse({ status: 201, description: 'Message sent successfully' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  sendMessage(
    @CurrentBusiness() businessId: string,
    @Param('id') id: string,
    @Body() dto: SendMessageDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.conversationsService.sendMessage(businessId, id, dto, userId);
  }

  @Post()
  @ApiOperation({ summary: 'Start a new conversation' })
  @ApiResponse({ status: 201, description: 'Conversation started successfully' })
  @ApiResponse({ status: 400, description: 'Active conversation already exists' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  startConversation(
    @CurrentBusiness() businessId: string,
    @Body() dto: StartConversationDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.conversationsService.startConversation(businessId, dto, userId);
  }

  @Post(':id/close')
  @ApiOperation({ summary: 'Close a conversation' })
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  @ApiResponse({ status: 200, description: 'Conversation closed successfully' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  close(
    @CurrentBusiness() businessId: string,
    @Param('id') id: string,
  ) {
    return this.conversationsService.close(businessId, id);
  }

  @Post(':id/reopen')
  @ApiOperation({ summary: 'Reopen a closed conversation' })
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  @ApiResponse({ status: 200, description: 'Conversation reopened successfully' })
  @ApiResponse({ status: 400, description: 'Conversation is not closed' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  reopen(
    @CurrentBusiness() businessId: string,
    @Param('id') id: string,
  ) {
    return this.conversationsService.reopen(businessId, id);
  }

  @Post(':id/escalate')
  @ApiOperation({ summary: 'Escalate a conversation' })
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  @ApiResponse({ status: 200, description: 'Conversation escalated successfully' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  escalate(
    @CurrentBusiness() businessId: string,
    @Param('id') id: string,
    @Body() dto: EscalateConversationDto,
  ) {
    return this.conversationsService.escalate(businessId, id, dto);
  }

  @Post(':id/assign')
  @ApiOperation({ summary: 'Assign an agent to a conversation' })
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  @ApiResponse({ status: 200, description: 'Agent assigned successfully' })
  @ApiResponse({ status: 404, description: 'Conversation or agent not found' })
  assignAgent(
    @CurrentBusiness() businessId: string,
    @Param('id') id: string,
    @Body() dto: AssignAgentDto,
  ) {
    return this.conversationsService.assignAgent(businessId, id, dto);
  }

  @Post(':id/unassign')
  @ApiOperation({ summary: 'Unassign agent from a conversation' })
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  @ApiResponse({ status: 200, description: 'Agent unassigned successfully' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  unassignAgent(
    @CurrentBusiness() businessId: string,
    @Param('id') id: string,
  ) {
    return this.conversationsService.unassignAgent(businessId, id);
  }

  @Post(':id/star')
  @ApiOperation({ summary: 'Toggle star on a conversation' })
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  @ApiResponse({ status: 200, description: 'Star toggled successfully' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  toggleStar(
    @CurrentBusiness() businessId: string,
    @Param('id') id: string,
  ) {
    return this.conversationsService.toggleStar(businessId, id);
  }

  @Post(':id/read')
  @ApiOperation({ summary: 'Mark conversation as read' })
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  @ApiResponse({ status: 200, description: 'Marked as read successfully' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  markAsRead(
    @CurrentBusiness() businessId: string,
    @Param('id') id: string,
  ) {
    return this.conversationsService.markAsRead(businessId, id);
  }
}
