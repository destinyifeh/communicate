import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { bookingService, type BookingQueryParams } from '@/services';
import { queryKeys } from '@/lib/query-client';
import type {
  CreateBookingData,
  UpdateBookingData,
  CancelBookingData,
  AvailabilityQuery,
} from '@/types';

/**
 * Hook for fetching bookings with pagination
 */
export function useBookings(params?: BookingQueryParams) {
  return useQuery({
    queryKey: queryKeys.bookings.list(params || {}),
    queryFn: () => bookingService.getBookings(params),
  });
}

/**
 * Hook for infinite scroll bookings
 */
export function useInfiniteBookings(params?: Omit<BookingQueryParams, 'page'>) {
  return useInfiniteQuery({
    queryKey: queryKeys.bookings.list({ ...params, infinite: true }),
    queryFn: ({ pageParam = 1 }) =>
      bookingService.getBookings({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasMore ? lastPage.meta.page + 1 : undefined,
  });
}

/**
 * Hook for fetching a single booking
 */
export function useBooking(id: string) {
  return useQuery({
    queryKey: queryKeys.bookings.detail(id),
    queryFn: () => bookingService.getBooking(id),
    enabled: !!id,
  });
}

/**
 * Hook for fetching availability slots
 */
export function useAvailability(query: AvailabilityQuery) {
  return useQuery({
    queryKey: queryKeys.bookings.availability(query),
    queryFn: () => bookingService.getAvailability(query),
    enabled: !!query.date,
  });
}

/**
 * Hook for upcoming bookings
 */
export function useUpcomingBookings(limit?: number) {
  return useQuery({
    queryKey: queryKeys.bookings.upcoming(),
    queryFn: () => bookingService.getUpcoming(limit),
  });
}

/**
 * Hook for booking statistics
 */
export function useBookingStats(businessId?: string, startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: queryKeys.bookings.stats(),
    queryFn: () => bookingService.getStats(businessId, startDate, endDate),
  });
}

/**
 * Hook for booking mutations
 */
export function useBookingMutations() {
  const queryClient = useQueryClient();

  const createBooking = useMutation({
    mutationFn: (data: CreateBookingData) => bookingService.createBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.upcoming() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.stats() });
    },
  });

  const updateBooking = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBookingData }) =>
      bookingService.updateBooking(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.lists() });
    },
  });

  const deleteBooking = useMutation({
    mutationFn: (id: string) => bookingService.deleteBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.stats() });
    },
  });

  const cancelBooking = useMutation({
    mutationFn: ({ id, data }: { id: string; data?: CancelBookingData }) =>
      bookingService.cancelBooking(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.stats() });
    },
  });

  const confirmBooking = useMutation({
    mutationFn: (id: string) => bookingService.confirmBooking(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.stats() });
    },
  });

  const completeBooking = useMutation({
    mutationFn: (id: string) => bookingService.completeBooking(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.stats() });
    },
  });

  const markNoShow = useMutation({
    mutationFn: (id: string) => bookingService.markNoShow(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.stats() });
    },
  });

  const rescheduleBooking = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { startTime: string; endTime: string };
    }) => bookingService.rescheduleBooking(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.upcoming() });
    },
  });

  const sendReminder = useMutation({
    mutationFn: (id: string) => bookingService.sendReminder(id),
  });

  return {
    createBooking,
    updateBooking,
    deleteBooking,
    cancelBooking,
    confirmBooking,
    completeBooking,
    markNoShow,
    rescheduleBooking,
    sendReminder,
  };
}
