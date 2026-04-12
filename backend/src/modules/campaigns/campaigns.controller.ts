import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CampaignsService, CreateCampaignDto } from './campaigns.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User, CampaignStatus } from '@prisma/client';

@ApiTags('campaigns')
@Controller('campaigns')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  async create(@Body() dto: CreateCampaignDto, @CurrentUser() user: User) {
    if (!user.currentBusinessId) throw new Error('No business selected');
    return this.campaignsService.create(user.currentBusinessId, dto, user.id);
  }

  @Get()
  async findAll(@CurrentUser() user: User, @Query('status') status?: CampaignStatus) {
    if (!user.currentBusinessId) throw new Error('No business selected');
    return this.campaignsService.findAll(user.currentBusinessId, status);
  }

  @Get('stats')
  async getStats(@CurrentUser() user: User) {
    if (!user.currentBusinessId) throw new Error('No business selected');
    return this.campaignsService.getStats(user.currentBusinessId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: User) {
    if (!user.currentBusinessId) throw new Error('No business selected');
    return this.campaignsService.findOne(user.currentBusinessId, id);
  }

  @Post(':id/send')
  async send(@Param('id') id: string, @CurrentUser() user: User) {
    if (!user.currentBusinessId) throw new Error('No business selected');
    return this.campaignsService.send(user.currentBusinessId, id);
  }

  @Post(':id/pause')
  async pause(@Param('id') id: string, @CurrentUser() user: User) {
    if (!user.currentBusinessId) throw new Error('No business selected');
    return this.campaignsService.pause(user.currentBusinessId, id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @CurrentUser() user: User) {
    if (!user.currentBusinessId) throw new Error('No business selected');
    await this.campaignsService.delete(user.currentBusinessId, id);
    return { message: 'Campaign deleted' };
  }
}
