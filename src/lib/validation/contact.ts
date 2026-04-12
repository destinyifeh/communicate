import { z } from 'zod';
import { phoneSchema, emailSchema, optionalString } from './common';

export const createContactSchema = z.object({
  firstName: optionalString,
  lastName: optionalString,
  email: emailSchema.optional().or(z.literal('')),
  phone: phoneSchema,
  whatsappNumber: phoneSchema.optional().or(z.literal('')),
  company: optionalString,
  tags: z.array(z.string()).optional(),
  source: z.enum(['sms', 'whatsapp', 'email', 'booking', 'campaign', 'import', 'manual']).optional(),
  notes: optionalString,
});

export const updateContactSchema = z.object({
  firstName: optionalString,
  lastName: optionalString,
  email: emailSchema.optional().or(z.literal('')),
  phone: phoneSchema.optional(),
  whatsappNumber: phoneSchema.optional().or(z.literal('')),
  company: optionalString,
  tags: z.array(z.string()).optional(),
  notes: optionalString,
  optedOutSms: z.boolean().optional(),
  optedOutWhatsapp: z.boolean().optional(),
  optedOutEmail: z.boolean().optional(),
});

export const importContactsSchema = z.object({
  contacts: z.array(createContactSchema).min(1, 'At least one contact is required'),
  source: z.enum(['import']).default('import'),
  tags: z.array(z.string()).optional(),
});

export const contactFiltersSchema = z.object({
  search: z.string().max(100).optional(),
  tags: z.array(z.string()).optional(),
  source: z.enum(['sms', 'whatsapp', 'email', 'booking', 'campaign', 'import', 'manual']).optional(),
  optedOut: z.boolean().optional(),
});

// Type exports
export type CreateContactFormData = z.infer<typeof createContactSchema>;
export type UpdateContactFormData = z.infer<typeof updateContactSchema>;
export type ImportContactsFormData = z.infer<typeof importContactsSchema>;
export type ContactFiltersFormData = z.infer<typeof contactFiltersSchema>;
