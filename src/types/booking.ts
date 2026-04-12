// Booking-related types

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';

export interface Booking {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  status: BookingStatus;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerNotes?: string;
  serviceType?: string;
  price?: number;
  location?: string;
  meetingUrl?: string;
  reminderSent24h: boolean;
  reminderSent1h: boolean;
  cancelledAt?: string;
  cancellationReason?: string;
  source: string;
  metadata?: Record<string, any>;
  contactId?: string;
  businessId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingData {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  durationMinutes?: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerNotes?: string;
  serviceType?: string;
  price?: number;
  location?: string;
  meetingUrl?: string;
  contactId?: string;
}

export interface UpdateBookingData {
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  status?: BookingStatus;
  customerNotes?: string;
  location?: string;
  meetingUrl?: string;
}

export interface CancelBookingData {
  reason?: string;
}

export interface BookingFilters {
  status?: BookingStatus;
  startDate?: string;
  endDate?: string;
  serviceType?: string;
  search?: string;
}

export interface BookingSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface AvailabilityQuery {
  date: string;
  serviceType?: string;
  duration?: number;
}
