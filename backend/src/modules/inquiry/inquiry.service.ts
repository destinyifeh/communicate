import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { Inquiry, InquiryStatus, InquiryPriority } from '@prisma/client';

@Injectable()
export class InquiryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    businessId: string,
    options?: {
      status?: InquiryStatus;
      priority?: InquiryPriority;
      escalated?: boolean;
    },
  ): Promise<Inquiry[]> {
    return this.prisma.inquiry.findMany({
      where: {
        businessId,
        ...(options?.status && { status: options.status }),
        ...(options?.priority && { priority: options.priority }),
        ...(options?.escalated !== undefined && { escalated: options.escalated }),
      },
      include: {
        contact: true,
        assignedAgent: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(businessId: string, id: string): Promise<Inquiry> {
    const inquiry = await this.prisma.inquiry.findFirst({
      where: { id, businessId },
      include: {
        contact: true,
        conversation: true,
        assignedAgent: true,
      },
    });

    if (!inquiry) {
      throw new NotFoundException('Inquiry not found');
    }

    return inquiry;
  }

  async updateStatus(
    businessId: string,
    id: string,
    status: InquiryStatus,
    resolution?: string,
  ): Promise<Inquiry> {
    await this.findOne(businessId, id);

    return this.prisma.inquiry.update({
      where: { id },
      data: {
        status,
        ...(status === InquiryStatus.RESOLVED && {
          resolvedAt: new Date(),
          resolution,
        }),
      },
    });
  }

  async assignAgent(businessId: string, id: string, agentId: string): Promise<Inquiry> {
    await this.findOne(businessId, id);

    return this.prisma.inquiry.update({
      where: { id },
      data: {
        assignedAgentId: agentId,
        status: InquiryStatus.IN_PROGRESS,
      },
    });
  }

  async getStats(businessId: string): Promise<{
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
    escalated: number;
  }> {
    const [total, open, inProgress, resolved, escalated] = await Promise.all([
      this.prisma.inquiry.count({ where: { businessId } }),
      this.prisma.inquiry.count({ where: { businessId, status: InquiryStatus.OPEN } }),
      this.prisma.inquiry.count({ where: { businessId, status: InquiryStatus.IN_PROGRESS } }),
      this.prisma.inquiry.count({ where: { businessId, status: InquiryStatus.RESOLVED } }),
      this.prisma.inquiry.count({ where: { businessId, escalated: true } }),
    ]);

    return { total, open, inProgress, resolved, escalated };
  }
}
