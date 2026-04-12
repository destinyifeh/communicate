import {
  Controller,
  Get,
  Post,
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
import { BookingService, CreateBookingDto } from './booking.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User, BookingStatus } from '@prisma/client';

@ApiTags('booking')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'Booking created' })
  async create(@Body() dto: CreateBookingDto, @CurrentUser() user: User) {
    if (!user.currentBusinessId) {
      throw new Error('No business selected');
    }
    return this.bookingService.create(user.currentBusinessId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bookings' })
  @ApiResponse({ status: 200, description: 'List of bookings' })
  async findAll(
    @CurrentUser() user: User,
    @Query('status') status?: BookingStatus,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    if (!user.currentBusinessId) {
      throw new Error('No business selected');
    }
    return this.bookingService.findAll(user.currentBusinessId, {
      status,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming bookings' })
  @ApiResponse({ status: 200, description: 'Upcoming bookings' })
  async getUpcoming(@CurrentUser() user: User, @Query('limit') limit?: number) {
    if (!user.currentBusinessId) {
      throw new Error('No business selected');
    }
    return this.bookingService.getUpcoming(user.currentBusinessId, limit);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get booking statistics' })
  @ApiResponse({ status: 200, description: 'Booking stats' })
  async getStats(@CurrentUser() user: User) {
    if (!user.currentBusinessId) {
      throw new Error('No business selected');
    }
    return this.bookingService.getStats(user.currentBusinessId);
  }

  @Get('available-slots')
  @ApiOperation({ summary: 'Get available time slots for a date' })
  @ApiResponse({ status: 200, description: 'Available slots' })
  async getAvailableSlots(
    @CurrentUser() user: User,
    @Query('date') date: string,
    @Query('duration') duration?: number,
  ) {
    if (!user.currentBusinessId) {
      throw new Error('No business selected');
    }
    return this.bookingService.getAvailableSlots(
      user.currentBusinessId,
      new Date(date),
      duration,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific booking' })
  @ApiResponse({ status: 200, description: 'Booking details' })
  async findOne(@Param('id') id: string, @CurrentUser() user: User) {
    if (!user.currentBusinessId) {
      throw new Error('No business selected');
    }
    return this.bookingService.findOne(user.currentBusinessId, id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update booking status' })
  @ApiResponse({ status: 200, description: 'Status updated' })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: BookingStatus; reason?: string },
    @CurrentUser() user: User,
  ) {
    if (!user.currentBusinessId) {
      throw new Error('No business selected');
    }
    return this.bookingService.updateStatus(
      user.currentBusinessId,
      id,
      body.status,
      body.reason,
    );
  }

  @Patch(':id/confirm')
  @ApiOperation({ summary: 'Confirm a booking' })
  @ApiResponse({ status: 200, description: 'Booking confirmed' })
  async confirm(@Param('id') id: string, @CurrentUser() user: User) {
    if (!user.currentBusinessId) {
      throw new Error('No business selected');
    }
    return this.bookingService.updateStatus(
      user.currentBusinessId,
      id,
      'CONFIRMED',
    );
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel a booking' })
  @ApiResponse({ status: 200, description: 'Booking cancelled' })
  async cancel(
    @Param('id') id: string,
    @Body() body: { reason?: string },
    @CurrentUser() user: User,
  ) {
    if (!user.currentBusinessId) {
      throw new Error('No business selected');
    }
    return this.bookingService.updateStatus(
      user.currentBusinessId,
      id,
      'CANCELLED',
      body.reason,
    );
  }
}
