import {
  Controller,
  Get,
  Post,
  Delete,
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
import { TwilioService } from './twilio.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../generated/prisma';

@ApiTags('twilio')
@Controller('twilio')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TwilioController {
  constructor(private readonly twilioService: TwilioService) {}

  @Post('setup')
  @ApiOperation({ summary: 'Set up Twilio for a business (subaccount + messaging service)' })
  @ApiResponse({ status: 201, description: 'Twilio setup complete' })
  async setupBusiness(@CurrentUser() user: User) {
    if (!user.currentBusinessId) {
      throw new Error('No business selected');
    }
    return this.twilioService.setupBusiness(user.currentBusinessId);
  }

  @Get('subaccount')
  @ApiOperation({ summary: 'Get Twilio subaccount for current business' })
  @ApiResponse({ status: 200, description: 'Subaccount details' })
  async getSubaccount(@CurrentUser() user: User) {
    if (!user.currentBusinessId) {
      throw new Error('No business selected');
    }
    return this.twilioService.subaccount.getSubaccount(user.currentBusinessId);
  }

  @Get('phone-numbers')
  @ApiOperation({ summary: 'Get phone numbers for current business' })
  @ApiResponse({ status: 200, description: 'List of phone numbers' })
  async getPhoneNumbers(@CurrentUser() user: User) {
    if (!user.currentBusinessId) {
      throw new Error('No business selected');
    }
    return this.twilioService.phone.getBusinessPhoneNumbers(user.currentBusinessId);
  }

  @Get('phone-numbers/available')
  @ApiOperation({ summary: 'Search available phone numbers to purchase' })
  @ApiResponse({ status: 200, description: 'Available phone numbers' })
  async searchAvailableNumbers(
    @CurrentUser() user: User,
    @Query('country') country?: string,
    @Query('areaCode') areaCode?: string,
  ) {
    if (!user.currentBusinessId) {
      throw new Error('No business selected');
    }
    return this.twilioService.phone.searchAvailableNumbers(
      user.currentBusinessId,
      country || 'US',
      areaCode,
    );
  }

  @Post('phone-numbers/purchase')
  @ApiOperation({ summary: 'Purchase a phone number' })
  @ApiResponse({ status: 201, description: 'Phone number purchased' })
  async purchasePhoneNumber(
    @CurrentUser() user: User,
    @Body() body: { phoneNumber: string; friendlyName?: string },
  ) {
    if (!user.currentBusinessId) {
      throw new Error('No business selected');
    }
    return this.twilioService.phone.purchaseNumber(
      user.currentBusinessId,
      body.phoneNumber,
      { friendlyName: body.friendlyName },
    );
  }

  @Post('phone-numbers/:id/primary')
  @ApiOperation({ summary: 'Set a phone number as primary' })
  @ApiResponse({ status: 200, description: 'Primary number updated' })
  async setPrimaryNumber(@CurrentUser() user: User, @Param('id') phoneId: string) {
    if (!user.currentBusinessId) {
      throw new Error('No business selected');
    }
    return this.twilioService.phone.setPrimaryNumber(user.currentBusinessId, phoneId);
  }

  @Delete('phone-numbers/:id')
  @ApiOperation({ summary: 'Release a phone number' })
  @ApiResponse({ status: 200, description: 'Phone number released' })
  async releasePhoneNumber(@CurrentUser() user: User, @Param('id') phoneId: string) {
    if (!user.currentBusinessId) {
      throw new Error('No business selected');
    }
    await this.twilioService.phone.releaseNumber(user.currentBusinessId, phoneId);
    return { message: 'Phone number released' };
  }

  @Post('send-sms')
  @ApiOperation({ summary: 'Send an SMS message' })
  @ApiResponse({ status: 200, description: 'Message sent' })
  async sendSMS(
    @CurrentUser() user: User,
    @Body() body: { to: string; body: string; from?: string },
  ) {
    if (!user.currentBusinessId) {
      throw new Error('No business selected');
    }
    return this.twilioService.sendSMS(
      user.currentBusinessId,
      body.to,
      body.body,
      body.from,
    );
  }

  @Post('send-whatsapp')
  @ApiOperation({ summary: 'Send a WhatsApp message' })
  @ApiResponse({ status: 200, description: 'Message sent' })
  async sendWhatsApp(
    @CurrentUser() user: User,
    @Body() body: { to: string; body: string; from?: string },
  ) {
    if (!user.currentBusinessId) {
      throw new Error('No business selected');
    }
    return this.twilioService.sendWhatsApp(
      user.currentBusinessId,
      body.to,
      body.body,
      body.from,
    );
  }
}
