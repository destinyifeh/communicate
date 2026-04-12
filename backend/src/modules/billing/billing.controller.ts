import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User, SubscriptionPlan } from '@prisma/client';

@ApiTags('billing')
@Controller('billing')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('subscription')
  async getSubscription(@CurrentUser() user: User) {
    if (!user.currentBusinessId) throw new Error('No business selected');
    return this.billingService.getSubscription(user.currentBusinessId);
  }

  @Get('usage')
  async getUsage(@CurrentUser() user: User) {
    if (!user.currentBusinessId) throw new Error('No business selected');
    return this.billingService.getUsage(user.currentBusinessId);
  }

  @Get('plans')
  async getPlans() {
    return this.billingService.getPlans();
  }

  @Post('change-plan')
  async changePlan(@Body() body: { plan: SubscriptionPlan }, @CurrentUser() user: User) {
    if (!user.currentBusinessId) throw new Error('No business selected');
    return this.billingService.changePlan(user.currentBusinessId, body.plan);
  }

  @Post('cancel')
  async cancel(@CurrentUser() user: User) {
    if (!user.currentBusinessId) throw new Error('No business selected');
    return this.billingService.cancelSubscription(user.currentBusinessId);
  }

  @Post('reactivate')
  async reactivate(@CurrentUser() user: User) {
    if (!user.currentBusinessId) throw new Error('No business selected');
    return this.billingService.reactivateSubscription(user.currentBusinessId);
  }
}
