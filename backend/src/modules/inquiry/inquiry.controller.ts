import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { InquiryService } from './inquiry.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User, InquiryStatus, InquiryPriority } from '@prisma/client';

@ApiTags('inquiry')
@Controller('inquiries')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all inquiries' })
  @ApiResponse({ status: 200, description: 'List of inquiries' })
  async findAll(
    @CurrentUser() user: User,
    @Query('status') status?: InquiryStatus,
    @Query('priority') priority?: InquiryPriority,
    @Query('escalated') escalated?: boolean,
  ) {
    if (!user.currentBusinessId) {
      throw new Error('No business selected');
    }
    return this.inquiryService.findAll(user.currentBusinessId, {
      status,
      priority,
      escalated,
    });
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get inquiry statistics' })
  @ApiResponse({ status: 200, description: 'Inquiry stats' })
  async getStats(@CurrentUser() user: User) {
    if (!user.currentBusinessId) {
      throw new Error('No business selected');
    }
    return this.inquiryService.getStats(user.currentBusinessId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific inquiry' })
  @ApiResponse({ status: 200, description: 'Inquiry details' })
  async findOne(@Param('id') id: string, @CurrentUser() user: User) {
    if (!user.currentBusinessId) {
      throw new Error('No business selected');
    }
    return this.inquiryService.findOne(user.currentBusinessId, id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update inquiry status' })
  @ApiResponse({ status: 200, description: 'Status updated' })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: InquiryStatus; resolution?: string },
    @CurrentUser() user: User,
  ) {
    if (!user.currentBusinessId) {
      throw new Error('No business selected');
    }
    return this.inquiryService.updateStatus(
      user.currentBusinessId,
      id,
      body.status,
      body.resolution,
    );
  }

  @Patch(':id/assign')
  @ApiOperation({ summary: 'Assign inquiry to agent' })
  @ApiResponse({ status: 200, description: 'Agent assigned' })
  async assignAgent(
    @Param('id') id: string,
    @Body() body: { agentId: string },
    @CurrentUser() user: User,
  ) {
    if (!user.currentBusinessId) {
      throw new Error('No business selected');
    }
    return this.inquiryService.assignAgent(
      user.currentBusinessId,
      id,
      body.agentId,
    );
  }
}
