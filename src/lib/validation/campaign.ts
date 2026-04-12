import { z } from 'zod';
import { phoneSchema, optionalString } from './common';

export const createCampaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required').max(100),
  description: optionalString,
  type: z.enum(['SMS', 'WHATSAPP', 'EMAIL']),
  messageTemplate: z.string().min(1, 'Message template is required').max(1600),
  mediaUrls: z.array(z.string().url()).optional(),
  targetTags: z.array(z.string()).optional(),
  excludeTags: z.array(z.string()).optional(),
  recipientPhones: z.array(phoneSchema).optional(),
  recipientEmails: z.array(z.string().email()).optional(),
  scheduledAt: z.string().datetime().optional(),
}).refine(
  (data) => {
    // Must have either targetTags or recipientPhones/recipientEmails
    const hasTargetTags = data.targetTags && data.targetTags.length > 0;
    const hasRecipients = (data.recipientPhones && data.recipientPhones.length > 0) ||
                         (data.recipientEmails && data.recipientEmails.length > 0);
    return hasTargetTags || hasRecipients;
  },
  { message: 'Must specify either target tags or recipients' }
);

export const updateCampaignSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: optionalString,
  messageTemplate: z.string().min(1).max(1600).optional(),
  mediaUrls: z.array(z.string().url()).optional(),
  targetTags: z.array(z.string()).optional(),
  excludeTags: z.array(z.string()).optional(),
  scheduledAt: z.string().datetime().optional().nullable(),
});

export const campaignFiltersSchema = z.object({
  type: z.enum(['SMS', 'WHATSAPP', 'EMAIL']).optional(),
  status: z.enum(['DRAFT', 'SCHEDULED', 'SENDING', 'COMPLETED', 'PAUSED', 'FAILED']).optional(),
  search: z.string().max(100).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export const sendTestMessageSchema = z.object({
  phone: phoneSchema,
});

// Message template validation (for variable substitution)
export const messageTemplateSchema = z.object({
  template: z.string().min(1).max(1600),
}).refine(
  (data) => {
    // Validate that all template variables are properly closed
    const openBraces = (data.template.match(/\{\{/g) || []).length;
    const closeBraces = (data.template.match(/\}\}/g) || []).length;
    return openBraces === closeBraces;
  },
  { message: 'Template has unclosed variable braces' }
);

// Type exports
export type CreateCampaignFormData = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignFormData = z.infer<typeof updateCampaignSchema>;
export type CampaignFiltersFormData = z.infer<typeof campaignFiltersSchema>;
export type SendTestMessageFormData = z.infer<typeof sendTestMessageSchema>;
