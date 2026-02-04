// Onboarding types and mock data for ManyChat integration
// NOTE: Main plan and business types are in businessTypes.ts
// This file is kept for legacy compatibility

export type PlanType = 'starter' | 'professional' | 'enterprise';

export interface PlanDetails {
  name: string;
  price: string;
  maxChannels: number;
  maxAutomations: number | 'unlimited';
  maxContacts: number;
  features: string[];
  description: string;
}

// Updated plans: Starter (1 channel), Professional (2 channels), Enterprise (all 4)
export const planDetails: Record<PlanType, PlanDetails> = {
  starter: {
    name: 'Starter',
    price: '₦25,000',
    maxChannels: 1,
    maxAutomations: 2,
    maxContacts: 500,
    features: [
      '1 Social Channel',
      'Lead Capture Automation',
      'Basic FAQ Bot',
      'Dashboard Analytics',
      'Email Support',
    ],
    description: '1 channel of your choice',
  },
  professional: {
    name: 'Professional',
    price: '₦50,000',
    maxChannels: 2,
    maxAutomations: 8,
    maxContacts: 2500,
    features: [
      '2 Social Channels',
      'All Automation Types',
      'Appointment Booking',
      'Transactional Email',
      'Priority Support',
    ],
    description: '2 channels of your choice',
  },
  enterprise: {
    name: 'Enterprise',
    price: '₦120,000',
    maxChannels: 4,
    maxAutomations: 'unlimited',
    maxContacts: 10000,
    features: [
      'All 4 Social Channels',
      'Unlimited Automations',
      'AI-Powered Responses',
      'Dedicated Account Manager',
      'Custom Integrations',
    ],
    description: 'All channels (IG, FB, WhatsApp, TikTok)',
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

// Automation Goal Types
export type AutomationGoalType = 'lead_capture' | 'auto_reply' | 'whatsapp_redirect' | 'faq_bot';

// FAQ Item for the FAQ bot automation
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface AutomationGoal {
  id: AutomationGoalType;
  name: string;
  description: string;
  icon: string;
  followUpQuestion: string;
  followUpPlaceholder: string;
  followUpType: 'text' | 'textarea' | 'phone' | 'faq';
}

export const automationGoals: AutomationGoal[] = [
  {
    id: 'lead_capture',
    name: 'Get leads from comments',
    description: 'Automatically DM users who comment on your posts with a keyword',
    icon: '📥',
    followUpQuestion: 'What keyword should trigger the lead capture?',
    followUpPlaceholder: 'e.g., "INFO", "PRICE", "BUY"',
    followUpType: 'text',
  },
  {
    id: 'auto_reply',
    name: 'Reply to DMs automatically',
    description: 'Send instant welcome messages to new DM conversations',
    icon: '💬',
    followUpQuestion: 'What welcome message should we send?',
    followUpPlaceholder: 'e.g., "Hi! 👋 Thanks for reaching out. How can I help you today?"',
    followUpType: 'textarea',
  },
  {
    id: 'whatsapp_redirect',
    name: 'Redirect customers to WhatsApp',
    description: 'Send your WhatsApp link when customers want to chat',
    icon: '📱',
    followUpQuestion: 'What is your WhatsApp business number?',
    followUpPlaceholder: '+234 xxx xxx xxxx',
    followUpType: 'phone',
  },
  {
    id: 'faq_bot',
    name: 'Answer FAQs automatically',
    description: 'Set up automatic responses to common questions',
    icon: '🤖',
    followUpQuestion: 'Set up your FAQ responses',
    followUpPlaceholder: '',
    followUpType: 'faq',
  },
];

export interface ConfiguredAutomation {
  goalId: AutomationGoalType;
  goalName: string;
  config: string;
  faqItems?: FAQItem[];
  channel: ChannelType;
  status: 'active' | 'paused';
  createdAt: string;
}

export interface OnboardingData {
  email: string;
  password: string;
  emailVerified: boolean;
  businessDetails: BusinessDetails | null;
  selectedPlan: PlanType;
  paymentCompleted: boolean;
  channels: ChannelConnection[];
  automations: ConfiguredAutomation[];
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
  automations: [],
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

// Helper to generate unique ID
export const generateId = () => Math.random().toString(36).substring(2, 9);
