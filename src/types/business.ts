// Business-related types

export type SubscriptionPlan = 'STARTER' | 'GROWTH' | 'PRO';
export type SubscriptionStatus = 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'PAST_DUE' | 'TRIALING';
export type FeatureType = 'BOOKING' | 'SUPPORT' | 'INQUIRIES' | 'MARKETING';

export interface BusinessHours {
  [day: string]: {
    open: string;
    close: string;
    enabled: boolean;
  };
}

export interface FAQResponse {
  question: string;
  answer: string;
  keywords: string[];
}

export interface Business {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  brandColor?: string;
  industry?: string;
  timezone?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  businessHours?: BusinessHours;
  faqResponses?: FAQResponse[];
  isActive: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessFeature {
  id: string;
  featureType: FeatureType;
  enabled: boolean;
  config?: Record<string, any>;
  businessId: string;
}

export interface Subscription {
  id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  maxPhoneNumbers: number;
  maxMessagesPerMonth: number;
  messagesUsedThisMonth: number;
  monthlyPrice: number;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  businessId: string;
}

export interface CreateBusinessData {
  name: string;
  email?: string;
  phone?: string;
  industry?: string;
  timezone?: string;
}

export interface UpdateBusinessData {
  name?: string;
  description?: string;
  logoUrl?: string;
  brandColor?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  businessHours?: BusinessHours;
  faqResponses?: FAQResponse[];
}
