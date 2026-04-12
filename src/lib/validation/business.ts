import { z } from 'zod';
import { phoneSchema, emailSchema, slugSchema, urlSchema, hexColorSchema, optionalString } from './common';

const businessHoursSchema = z.record(
  z.object({
    open: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'),
    close: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'),
    enabled: z.boolean(),
  })
);

const faqResponseSchema = z.object({
  question: z.string().min(1).max(500),
  answer: z.string().min(1).max(2000),
  keywords: z.array(z.string()).optional(),
});

export const createBusinessSchema = z.object({
  name: z.string().min(2, 'Business name must be at least 2 characters').max(100),
  email: emailSchema.optional(),
  phone: phoneSchema.optional().or(z.literal('')),
  industry: optionalString,
  timezone: z.string().optional(),
});

export const updateBusinessSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  slug: slugSchema.optional(),
  description: z.string().max(500).optional(),
  logoUrl: urlSchema,
  brandColor: hexColorSchema,
  website: urlSchema,
  email: emailSchema.optional().or(z.literal('')),
  phone: phoneSchema.optional().or(z.literal('')),
  address: optionalString,
  city: optionalString,
  state: optionalString,
  country: optionalString,
  postalCode: optionalString,
  industry: optionalString,
  timezone: z.string().optional(),
  businessHours: businessHoursSchema.optional(),
  faqResponses: z.array(faqResponseSchema).optional(),
});

export const brandingSchema = z.object({
  businessName: z.string().min(2).max(100),
  logoUrl: urlSchema,
  brandColor: hexColorSchema,
  tagline: z.string().max(200).optional(),
});

export const faqSettingsSchema = z.object({
  faqResponses: z.array(faqResponseSchema),
  autoResponseEnabled: z.boolean(),
  fallbackMessage: z.string().max(500).optional(),
});

// Type exports
export type CreateBusinessFormData = z.infer<typeof createBusinessSchema>;
export type UpdateBusinessFormData = z.infer<typeof updateBusinessSchema>;
export type BrandingFormData = z.infer<typeof brandingSchema>;
export type FAQSettingsFormData = z.infer<typeof faqSettingsSchema>;
