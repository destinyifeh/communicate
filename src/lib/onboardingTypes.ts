// Onboarding types and mock data for ManyChat integration

export type PlanType = 'starter' | 'professional' | 'enterprise';

export interface PlanDetails {
  name: string;
  price: string;
  maxChannels: number;
  maxAutomations: number | 'unlimited';
  features: string[];
  description: string;
}

export const planDetails: Record<PlanType, PlanDetails> = {
  starter: {
    name: 'Starter',
    price: '₦49,000',
    maxChannels: 1,
    maxAutomations: 3,
    features: ['Comment → DM automation', 'Lead capture', 'Basic analytics', 'Dashboard view'],
    description: '1 channel (IG, FB, WhatsApp, or TikTok)',
  },
  professional: {
    name: 'Professional',
    price: '₦99,000',
    maxChannels: 2,
    maxAutomations: 10,
    features: ['Broadcast messages', 'Message templates', 'Full analytics', 'Priority support'],
    description: '2 channels (WhatsApp + IG, FB, or TikTok)',
  },
  enterprise: {
    name: 'Enterprise',
    price: '₦199,000',
    maxChannels: 4,
    maxAutomations: 'unlimited',
    features: ['AI-powered replies', 'Custom reporting', 'Dedicated account manager', 'Advanced analytics'],
    description: 'All 4 channels (IG, FB, WhatsApp, TikTok)',
  },
};

export type ChannelType = 'instagram' | 'facebook' | 'whatsapp' | 'tiktok';

export interface ChannelConnection {
  type: ChannelType;
  connected: boolean;
  workspaceId?: string;
  accessToken?: string;
  connectedAt?: string;
  accountName?: string;
}

export interface BusinessDetails {
  name: string;
  email: string;
  whatsappNumber: string;
  phoneNumber?: string;
  country: string;
}

export interface OnboardingData {
  email: string;
  password: string;
  emailVerified: boolean;
  businessDetails: BusinessDetails | null;
  selectedPlan: PlanType;
  paymentCompleted: boolean;
  channels: ChannelConnection[];
}

export const initialOnboardingData: OnboardingData = {
  email: '',
  password: '',
  emailVerified: false,
  businessDetails: null,
  selectedPlan: 'starter',
  paymentCompleted: false,
  channels: [
    { type: 'instagram', connected: false },
    { type: 'facebook', connected: false },
    { type: 'whatsapp', connected: false },
    { type: 'tiktok', connected: false },
  ],
};

// Mock ManyChat OAuth response
export interface ManyChatOAuthResponse {
  success: boolean;
  workspaceId: string;
  accessToken: string;
  accountName: string;
}

// Countries list
export const countries = [
  'Nigeria',
  'Ghana',
  'Kenya',
  'South Africa',
  'United States',
  'United Kingdom',
  'Canada',
  'Other',
];

// Mock function to simulate ManyChat OAuth
export const mockManyChatOAuth = async (channel: ChannelType): Promise<ManyChatOAuthResponse> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return {
    success: true,
    workspaceId: `ws_${channel}_${Math.random().toString(36).substring(7)}`,
    accessToken: `at_${channel}_${Math.random().toString(36).substring(7)}`,
    accountName: `@demo_${channel}_account`,
  };
};

// Mock function to simulate TikTok OAuth
export const mockTikTokOAuth = async (): Promise<ManyChatOAuthResponse> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return {
    success: true,
    workspaceId: `tt_ws_${Math.random().toString(36).substring(7)}`,
    accessToken: `tt_at_${Math.random().toString(36).substring(7)}`,
    accountName: `@demo_tiktok_account`,
  };
};
