import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { Booking, BookingStatus } from '@prisma/client';

export interface CreateBookingDto {
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  customerName?: string;
  customerEmail?: string;
  customerPhone: string;
  customerNotes?: string;
  serviceType?: string;
  price?: number;
  location?: string;
  meetingUrl?: string;
  source?: string;
}

export interface AvailableSlot {
  startTime: Date;
  endTime: Date;
  available: boolean;
}

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  async create(businessId: string, dto: CreateBookingDto): Promise<Booking> {
    // Find or create contact
    let contact = await this.prisma.contact.findFirst({
      where: { phone: dto.customerPhone, businessId },
    });

    if (!contact) {
      contact = await this.prisma.contact.create({
        data: {
          phone: dto.customerPhone,
          firstName: dto.customerName?.split(' ')[0],
          lastName: dto.customerName?.split(' ').slice(1).join(' '),
          email: dto.customerEmail,
          businessId,
          source: 'booking',
        },
      });
    }

    // Check for conflicts
    const conflicts = await this.findConflicts(businessId, dto.startTime, dto.endTime);
    if (conflicts.length > 0) {
      throw new BadRequestException('Time slot is already booked');
    }

    return this.prisma.booking.create({
      data: {
        title: dto.title,
        description: dto.description,
        startTime: dto.startTime,
        endTime: dto.endTime,
        customerName: dto.customerName,
        customerEmail: dto.customerEmail,
        customerPhone: dto.customerPhone,
        customerNotes: dto.customerNotes,
        serviceType: dto.serviceType,
        price: dto.price,
        location: dto.location,
        meetingUrl: dto.meetingUrl,
        source: dto.source || 'sms',
        durationMinutes: Math.round((dto.endTime.getTime() - dto.startTime.getTime()) / 60000),
        status: BookingStatus.PENDING,
        businessId,
        contactId: contact.id,
      },
    });
  }

  async findAll(
    businessId: string,
    options?: {
      status?: BookingStatus;
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<Booking[]> {
    return this.prisma.booking.findMany({
      where: {
        businessId,
        ...(options?.status && { status: options.status }),
        ...(options?.startDate && { startTime: { gte: options.startDate } }),
        ...(options?.endDate && { endTime: { lte: options.endDate } }),
      },
      include: { contact: true },
      orderBy: { startTime: 'asc' },
    });
  }

  async findOne(businessId: string, id: string): Promise<Booking> {
    const booking = await this.prisma.booking.findFirst({
      where: { id, businessId },
      include: { contact: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async updateStatus(
    businessId: string,
    id: string,
    status: BookingStatus,
    reason?: string,
  ): Promise<Booking> {
    await this.findOne(businessId, id);

    return this.prisma.booking.update({
      where: { id },
      data: {
        status,
        ...(status === BookingStatus.CANCELLED && {
          cancelledAt: new Date(),
          cancellationReason: reason,
        }),
      },
    });
  }

  async getAvailableSlots(
    businessId: string,
    date: Date,
    durationMinutes: number = 30,
  ): Promise<AvailableSlot[]> {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    // Get day of week
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[date.getDay()];

    // Get business hours for this day
    const businessHours = business.businessHours as Record<string, { open: string; close: string; enabled: boolean }> | null;
    const hours = businessHours?.[dayName];
    if (!hours || !hours.enabled) {
      return []; // Closed on this day
    }

    // Generate time slots
    const slots: AvailableSlot[] = [];
    const [openHour, openMinute] = hours.open.split(':').map(Number);
    const [closeHour, closeMinute] = hours.close.split(':').map(Number);

    const startOfDay = new Date(date);
    startOfDay.setHours(openHour, openMinute, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(closeHour, closeMinute, 0, 0);

    // Get existing bookings for this day
    const existingBookings = await this.findAll(businessId, {
      startDate: startOfDay,
      endDate: endOfDay,
      status: BookingStatus.CONFIRMED,
    });

    // Generate slots
    let currentSlotStart = new Date(startOfDay);
    while (currentSlotStart.getTime() + durationMinutes * 60000 <= endOfDay.getTime()) {
      const slotEnd = new Date(currentSlotStart.getTime() + durationMinutes * 60000);

      // Check if slot conflicts with existing bookings
      const isAvailable = !existingBookings.some(
        (b) =>
          (currentSlotStart >= b.startTime && currentSlotStart < b.endTime) ||
          (slotEnd > b.startTime && slotEnd <= b.endTime) ||
          (currentSlotStart <= b.startTime && slotEnd >= b.endTime),
      );

      slots.push({
        startTime: new Date(currentSlotStart),
        endTime: slotEnd,
        available: isAvailable,
      });

      // Move to next slot (with 15 min buffer)
      currentSlotStart = new Date(currentSlotStart.getTime() + (durationMinutes + 15) * 60000);
    }

    return slots;
  }

  private async findConflicts(
    businessId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<Booking[]> {
    return this.prisma.booking.findMany({
      where: {
        businessId,
        status: {
          notIn: [BookingStatus.CANCELLED, BookingStatus.NO_SHOW],
        },
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } },
            ],
          },
          {
            AND: [
              { startTime: { gte: startTime } },
              { endTime: { lte: endTime } },
            ],
          },
        ],
      },
    });
  }

  async getUpcoming(businessId: string, limit: number = 10): Promise<Booking[]> {
    return this.prisma.booking.findMany({
      where: {
        businessId,
        startTime: { gte: new Date() },
        status: BookingStatus.CONFIRMED,
      },
      include: { contact: true },
      orderBy: { startTime: 'asc' },
      take: limit,
    });
  }

  async getStats(businessId: string): Promise<{
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  }> {
    const [total, pending, confirmed, completed, cancelled] = await Promise.all([
      this.prisma.booking.count({ where: { businessId } }),
      this.prisma.booking.count({ where: { businessId, status: BookingStatus.PENDING } }),
      this.prisma.booking.count({ where: { businessId, status: BookingStatus.CONFIRMED } }),
      this.prisma.booking.count({ where: { businessId, status: BookingStatus.COMPLETED } }),
      this.prisma.booking.count({ where: { businessId, status: BookingStatus.CANCELLED } }),
    ]);

    return { total, pending, confirmed, completed, cancelled };
  }
}
