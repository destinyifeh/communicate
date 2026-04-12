import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SupportService } from './support.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '@prisma/client';

@ApiTags('support')
@Controller('support')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Get('escalated')
  async getEscalated(@CurrentUser() user: User) {
    if (!user.currentBusinessId) throw new Error('No business selected');
    return this.supportService.getEscalatedConversations(user.currentBusinessId);
  }

  @Post('conversations/:id/assign')
  async assignAgent(
    @Param('id') id: string,
    @Body() body: { agentId: string },
  ) {
    return this.supportService.assignAgent(id, body.agentId);
  }

  @Get('stats')
  async getStats(@CurrentUser() user: User) {
    if (!user.currentBusinessId) throw new Error('No business selected');
    return this.supportService.getAgentStats(user.currentBusinessId, user.id);
  }
}
