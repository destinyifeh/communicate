import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MessagingService, SendMessageOptions } from './messaging.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ConversationChannel, ConversationStatus, User } from '../../generated/prisma';

interface SendMessageBody {
  message: string;
  // Email-specific options
  subject?: string;
  html?: string;
  cc?: string[];
  bcc?: string[];
}

@ApiTags('messaging')
@Controller('messaging')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Get('conversations')
  async getConversations(
    @CurrentUser() user: User,
    @Query('channel') channel?: ConversationChannel,
    @Query('status') status?: ConversationStatus,
    @Query('limit') limit?: number,
  ) {
    if (!user.currentBusinessId) throw new Error('No business selected');
    return this.messagingService.getConversations(user.currentBusinessId, {
      channel,
      status,
      limit,
    });
  }

  @Get('conversations/:id')
  async getConversation(@Param('id') id: string, @CurrentUser() user: User) {
    if (!user.currentBusinessId) throw new Error('No business selected');
    return this.messagingService.getConversation(user.currentBusinessId, id);
  }

  @Get('conversations/:id/messages')
  async getMessages(
    @Param('id') id: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.messagingService.getMessages(id, { limit, offset });
  }

  @Post('conversations/:id/messages')
  async sendMessage(
    @Param('id') id: string,
    @Body() body: SendMessageBody,
    @CurrentUser() user: User,
  ) {
    if (!user.currentBusinessId) throw new Error('No business selected');

    const options: SendMessageOptions = {};
    if (body.subject) options.subject = body.subject;
    if (body.html) options.html = body.html;
    if (body.cc) options.cc = body.cc;
    if (body.bcc) options.bcc = body.bcc;

    return this.messagingService.sendMessage(
      user.currentBusinessId,
      id,
      body.message,
      user.id,
      'agent',
      options,
    );
  }

  @Post('conversations/:id/takeover')
  async takeover(@Param('id') id: string, @CurrentUser() user: User) {
    if (!user.currentBusinessId) throw new Error('No business selected');
    return this.messagingService.takeoverConversation(
      user.currentBusinessId,
      id,
      user.id,
    );
  }

  @Post('conversations/:id/release')
  async release(@Param('id') id: string, @CurrentUser() user: User) {
    if (!user.currentBusinessId) throw new Error('No business selected');
    return this.messagingService.releaseToBot(user.currentBusinessId, id);
  }

  @Post('conversations/:id/close')
  async close(@Param('id') id: string, @CurrentUser() user: User) {
    if (!user.currentBusinessId) throw new Error('No business selected');
    return this.messagingService.closeConversation(user.currentBusinessId, id);
  }

  @Patch('conversations/:id/star')
  async toggleStar(@Param('id') id: string, @CurrentUser() user: User) {
    if (!user.currentBusinessId) throw new Error('No business selected');
    return this.messagingService.toggleStar(user.currentBusinessId, id);
  }
}
