import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { Subscription, SubscriptionPlan, SubscriptionStatus } from '../../generated/prisma';

const PLAN_DETAILS = {
  [SubscriptionPlan.STARTER]: {
    price: 29,
    maxPhoneNumbers: 1,
    maxMessages: 100,
    name: 'Starter',
  },
  [SubscriptionPlan.GROWTH]: {
    price: 79,
    maxPhoneNumbers: 2,
    maxMessages: 500,
    name: 'Growth',
  },
  [SubscriptionPlan.PRO]: {
    price: 149,
    maxPhoneNumbers: 5,
    maxMessages: 2000,
    name: 'Pro',
  },
};

@Injectable()
export class BillingService {
  constructor(private readonly prisma: PrismaService) {}

  async getSubscription(businessId: string): Promise<Subscription> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { businessId },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    return subscription;
  }

  async changePlan(businessId: string, newPlan: SubscriptionPlan): Promise<Subscription> {
    await this.getSubscription(businessId);

    const planDetails = PLAN_DETAILS[newPlan];

    return this.prisma.subscription.update({
      where: { businessId },
      data: {
        plan: newPlan,
        monthlyPrice: planDetails.price,
        maxPhoneNumbers: planDetails.maxPhoneNumbers,
        maxMessagesPerMonth: planDetails.maxMessages,
      },
    });
  }

  async cancelSubscription(businessId: string): Promise<Subscription> {
    await this.getSubscription(businessId);

    return this.prisma.subscription.update({
      where: { businessId },
      data: {
        status: SubscriptionStatus.CANCELLED,
        canceledAt: new Date(),
      },
    });
  }

  async reactivateSubscription(businessId: string): Promise<Subscription> {
    const subscription = await this.getSubscription(businessId);

    if (subscription.status !== SubscriptionStatus.CANCELLED) {
      throw new BadRequestException('Subscription is not cancelled');
    }

    return this.prisma.subscription.update({
      where: { businessId },
      data: {
        status: SubscriptionStatus.ACTIVE,
        canceledAt: null,
      },
    });
  }

  async getUsage(businessId: string): Promise<{
    messagesUsed: number;
    messagesLimit: number;
    messagesRemaining: number;
    callMinutesUsed: number;
    phoneNumbersUsed: number;
    phoneNumbersLimit: number;
  }> {
    const subscription = await this.getSubscription(businessId);

    const phoneNumbersUsed = await this.prisma.businessPhoneNumber.count({
      where: { businessId },
    });

    return {
      messagesUsed: subscription.messagesUsedThisMonth,
      messagesLimit: subscription.maxMessagesPerMonth,
      messagesRemaining: subscription.maxMessagesPerMonth - subscription.messagesUsedThisMonth,
      callMinutesUsed: subscription.callMinutesUsedThisMonth,
      phoneNumbersUsed,
      phoneNumbersLimit: subscription.maxPhoneNumbers,
    };
  }

  async incrementMessageUsage(businessId: string, count: number = 1): Promise<void> {
    await this.prisma.subscription.update({
      where: { businessId },
      data: {
        messagesUsedThisMonth: { increment: count },
      },
    });
  }

  async incrementCallMinutes(businessId: string, minutes: number): Promise<void> {
    await this.prisma.subscription.update({
      where: { businessId },
      data: {
        callMinutesUsedThisMonth: { increment: minutes },
      },
    });
  }

  getPlans() {
    return Object.entries(PLAN_DETAILS).map(([key, value]) => ({
      id: key,
      ...value,
    }));
  }
}
