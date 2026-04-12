import { z } from 'zod';
import { emailSchema, passwordSchema, slugSchema, optionalString } from './common';

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

// Step 1: Account details
export const signupStep1Schema = z.object({
  email: emailSchema,
  password: passwordSchema,
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  businessSlug: slugSchema,
  phone: z.string().optional(),
});

// Step 2: Feature selection
export const signupStep2Schema = z.object({
  features: z.array(z.enum(['booking', 'inquiries', 'support', 'marketing']))
    .min(1, 'Please select at least one feature'),
});

// Step 3: Plan selection
export const signupStep3Schema = z.object({
  plan: z.enum(['starter', 'growth', 'pro']),
});

// Step 4: Email verification
export const signupStep4Schema = z.object({
  verificationCode: z.string().length(6, 'Verification code must be 6 digits').regex(/^\d+$/, 'Code must contain only numbers'),
});

// Full signup schema (for API call)
export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(2, 'Name must be at least 2 characters'),
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  businessSlug: slugSchema,
  features: z.array(z.string()).min(1, 'Please select at least one feature'),
  phone: z.string().optional(),
});

// Legacy schema with confirm password
export const signupWithConfirmSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  businessName: z.string().min(2, 'Business name must be at least 2 characters').optional(),
  businessSlug: slugSchema.optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: 'New password must be different from current password',
  path: ['newPassword'],
});

export const profileUpdateSchema = z.object({
  businessName: optionalString,
  businessSlug: slugSchema.optional(),
  businessLogo: z.string().url().optional().or(z.literal('')),
  brandColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type SignupStep1FormData = z.infer<typeof signupStep1Schema>;
export type SignupStep2FormData = z.infer<typeof signupStep2Schema>;
export type SignupStep3FormData = z.infer<typeof signupStep3Schema>;
export type SignupStep4FormData = z.infer<typeof signupStep4Schema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
