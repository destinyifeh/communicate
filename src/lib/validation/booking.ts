import { z } from 'zod';
import { phoneSchema, emailSchema, optionalString } from './common';

export const createBookingSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: optionalString,
  startTime: z.string().datetime('Invalid start time'),
  endTime: z.string().datetime('Invalid end time'),
  durationMinutes: z.coerce.number().int().positive().default(30),
  customerName: optionalString,
  customerEmail: emailSchema.optional().or(z.literal('')),
  customerPhone: phoneSchema.optional().or(z.literal('')),
  customerNotes: optionalString,
  serviceType: optionalString,
  price: z.coerce.number().nonnegative().optional(),
  location: optionalString,
  meetingUrl: z.string().url().optional().or(z.literal('')),
  contactId: z.string().uuid().optional(),
}).refine(
  (data) => new Date(data.startTime) < new Date(data.endTime),
  { message: 'Start time must be before end time', path: ['endTime'] }
);

export const updateBookingSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: optionalString,
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW']).optional(),
  customerNotes: optionalString,
  location: optionalString,
  meetingUrl: z.string().url().optional().or(z.literal('')),
});

export const cancelBookingSchema = z.object({
  reason: optionalString,
});

export const bookingFiltersSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  serviceType: z.string().optional(),
  search: z.string().max(100).optional(),
});

export const availabilityQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  serviceType: z.string().optional(),
  duration: z.coerce.number().int().positive().optional(),
});

// Booking settings schema
export const bookingSettingsSchema = z.object({
  defaultDuration: z.coerce.number().int().positive().min(15).max(480),
  bufferTime: z.coerce.number().int().nonnegative().max(120),
  maxAdvanceBookingDays: z.coerce.number().int().positive().max(365),
  minNoticeHours: z.coerce.number().int().nonnegative().max(168),
  allowWeekends: z.boolean(),
  autoConfirm: z.boolean(),
  requirePhoneNumber: z.boolean(),
  requireEmail: z.boolean(),
});

// Type exports
export type CreateBookingFormData = z.infer<typeof createBookingSchema>;
export type UpdateBookingFormData = z.infer<typeof updateBookingSchema>;
export type CancelBookingFormData = z.infer<typeof cancelBookingSchema>;
export type BookingFiltersFormData = z.infer<typeof bookingFiltersSchema>;
export type AvailabilityQueryFormData = z.infer<typeof availabilityQuerySchema>;
export type BookingSettingsFormData = z.infer<typeof bookingSettingsSchema>;
