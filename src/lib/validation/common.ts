import { z } from 'zod';

// Common validation schemas and utilities

export const phoneSchema = z
  .string()
  .min(10, 'Phone number must be at least 10 digits')
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format');

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const slugSchema = z
  .string()
  .min(3, 'Slug must be at least 3 characters')
  .max(50, 'Slug must be at most 50 characters')
  .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens');

export const urlSchema = z
  .string()
  .url('Invalid URL format')
  .optional()
  .or(z.literal(''));

export const hexColorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format')
  .optional();

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const dateRangeSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.startDate) <= new Date(data.endDate);
    }
    return true;
  },
  { message: 'Start date must be before end date' }
);

export const searchSchema = z.object({
  search: z.string().max(100).optional(),
});

// Utility to create optional string that can be empty
export const optionalString = z
  .string()
  .optional()
  .transform((val) => val || undefined);

// Utility to create required trimmed string
export const requiredString = (fieldName: string) =>
  z.string().min(1, `${fieldName} is required`).transform((val) => val.trim());
