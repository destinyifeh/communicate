import { apiClient, fetchPaginated } from './api-client';
import type { PaginatedResponse, QueryParams } from '@/types';
import type {
  Booking,
  BookingStatus,
  CreateBookingData,
  UpdateBookingData,
  CancelBookingData,
  BookingFilters,
  BookingSlot,
  AvailabilityQuery,
} from '@/types/booking';

const BOOKINGS_ENDPOINT = '/api/bookings';

/** Query params for fetching bookings */
export interface BookingQueryParams extends QueryParams, BookingFilters {
  businessId?: string;
}

export const bookingService = {
  /**
   * Get bookings with pagination and filters
   */
  getBookings: async (params?: BookingQueryParams): Promise<PaginatedResponse<Booking>> => {
    return fetchPaginated<Booking>(BOOKINGS_ENDPOINT, params);
  },

  /**
   * Get booking by ID
   */
  getBooking: async (id: string): Promise<Booking> => {
    return apiClient.get<Booking>(`${BOOKINGS_ENDPOINT}/${id}`);
  },

  /**
   * Create a new booking
   */
  createBooking: async (data: CreateBookingData): Promise<Booking> => {
    return apiClient.post<Booking>(BOOKINGS_ENDPOINT, data);
  },

  /**
   * Update booking
   */
  updateBooking: async (id: string, data: UpdateBookingData): Promise<Booking> => {
    return apiClient.patch<Booking>(`${BOOKINGS_ENDPOINT}/${id}`, data);
  },

  /**
   * Delete booking
   */
  deleteBooking: async (id: string): Promise<{ success: boolean }> => {
    return apiClient.delete<{ success: boolean }>(`${BOOKINGS_ENDPOINT}/${id}`);
  },

  /**
   * Cancel booking
   */
  cancelBooking: async (id: string, data?: CancelBookingData): Promise<Booking> => {
    return apiClient.post<Booking>(`${BOOKINGS_ENDPOINT}/${id}/cancel`, data);
  },

  /**
   * Confirm booking
   */
  confirmBooking: async (id: string): Promise<Booking> => {
    return apiClient.post<Booking>(`${BOOKINGS_ENDPOINT}/${id}/confirm`);
  },

  /**
   * Mark booking as completed
   */
  completeBooking: async (id: string): Promise<Booking> => {
    return apiClient.post<Booking>(`${BOOKINGS_ENDPOINT}/${id}/complete`);
  },

  /**
   * Mark booking as no-show
   */
  markNoShow: async (id: string): Promise<Booking> => {
    return apiClient.post<Booking>(`${BOOKINGS_ENDPOINT}/${id}/no-show`);
  },

  /**
   * Get available time slots
   */
  getAvailability: async (query: AvailabilityQuery): Promise<BookingSlot[]> => {
    return apiClient.get<BookingSlot[]>(`${BOOKINGS_ENDPOINT}/availability`, query as any);
  },

  /**
   * Reschedule booking
   */
  rescheduleBooking: async (
    id: string,
    data: { startTime: string; endTime: string }
  ): Promise<Booking> => {
    return apiClient.post<Booking>(`${BOOKINGS_ENDPOINT}/${id}/reschedule`, data);
  },

  /**
   * Send reminder for booking
   */
  sendReminder: async (id: string): Promise<{ success: boolean }> => {
    return apiClient.post<{ success: boolean }>(`${BOOKINGS_ENDPOINT}/${id}/remind`);
  },

  /**
   * Get booking statistics
   */
  getStats: async (
    businessId?: string,
    startDate?: string,
    endDate?: string
  ): Promise<{
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
    completed: number;
    noShow: number;
    revenue: number;
  }> => {
    const params: Record<string, string> = {};
    if (businessId) params.businessId = businessId;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    return apiClient.get(`${BOOKINGS_ENDPOINT}/stats`, params as any);
  },

  /**
   * Get upcoming bookings
   */
  getUpcoming: async (limit?: number): Promise<Booking[]> => {
    return apiClient.get<Booking[]>(`${BOOKINGS_ENDPOINT}/upcoming`, { limit } as any);
  },
};

export default bookingService;
