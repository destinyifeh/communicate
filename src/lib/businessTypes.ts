// Business Types and Automation Configurations
// Supports: Sales/Orders, Appointments/Bookings, Enquiries/Support, Lead Capture

export type BusinessCategoryType = 'sales_orders' | 'appointments_bookings' | 'enquiries_support' | 'lead_capture';

export interface BusinessCategory {
  id: BusinessCategoryType;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const businessCategories: BusinessCategory[] = [
  {
    id: 'sales_orders',
    name: 'Sales / Orders',
    description: 'Automate product inquiries, orders, and payment collection',
    icon: '🛒',
    color: 'from-orange-500 to-amber-500',
  },
  {
    id: 'appointments_bookings',
    name: 'Appointments / Bookings',
    description: 'Manage appointment scheduling, availability, and reminders',
    icon: '📅',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'enquiries_support',
    name: 'Enquiries / Support',
    description: 'Handle customer questions, support tickets, and FAQs',
    icon: '💬',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'lead_capture',
    name: 'Lead Capture',
    description: 'Capture leads from comments, DMs, and social interactions',
    icon: '📥',
    color: 'from-green-500 to-emerald-500',
  },
];

// =====================================
// SALES / ORDERS AUTOMATION
// =====================================
export interface ProductItem {
  id: string;
  name: string;
  price: number;
  description: string;
  inStock: boolean;
}

export interface SalesOrderConfig {
  catalogType: 'simple' | 'detailed';
  products: ProductItem[];
  triggerKeywords: string[];
  welcomeMessage: string;
  orderConfirmationMessage: string;
  paymentRequired: boolean;
  paymentMethods: ('bank_transfer' | 'card' | 'ussd' | 'crypto')[];
  deliveryOptions: ('pickup' | 'delivery')[];
  deliveryMessage?: string;
  collectCustomerInfo: ('name' | 'phone' | 'email' | 'address')[];
}

export const defaultSalesConfig: SalesOrderConfig = {
  catalogType: 'simple',
  products: [],
  triggerKeywords: ['buy', 'order', 'price', 'how much'],
  welcomeMessage: 'Hi! 👋 Welcome to our store. What would you like to order today?',
  orderConfirmationMessage: '✅ Order confirmed! We\'ll process it shortly.',
  paymentRequired: true,
  paymentMethods: ['bank_transfer'],
  deliveryOptions: ['delivery'],
  collectCustomerInfo: ['name', 'phone', 'address'],
};

// =====================================
// APPOINTMENTS / BOOKINGS AUTOMATION
// =====================================
export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
export type AppointmentDuration = '15' | '30' | '45' | '60' | '90' | '120';

export interface TimeSlot {
  startTime: string; // HH:MM format
  endTime: string;
}

export interface AvailabilitySchedule {
  day: DayOfWeek;
  enabled: boolean;
  slots: TimeSlot[];
}

export interface AppointmentConfig {
  appointmentName: string;
  duration: AppointmentDuration;
  paymentRequired: boolean;
  paymentAmount?: number;
  availability: AvailabilitySchedule[];
  maxPerSlot: number;
  bufferTime: number; // minutes between appointments
  triggerKeywords: string[];
  welcomeMessage: string;
  dateRequestMessage: string;
  timeRequestMessage: string;
  dateUnavailableMessage: string;
  confirmationMessage: string;
  sendReminder: boolean;
  reminderTiming: ('24h' | '1h' | '30m')[];
  reminderMessage: string;
  collectCustomerInfo: ('name' | 'phone' | 'email' | 'notes')[];
  notifyAdmin: boolean;
}

export const defaultAppointmentConfig: AppointmentConfig = {
  appointmentName: 'Consultation',
  duration: '30',
  paymentRequired: false,
  availability: [
    { day: 'Mon', enabled: true, slots: [{ startTime: '09:00', endTime: '17:00' }] },
    { day: 'Tue', enabled: true, slots: [{ startTime: '09:00', endTime: '17:00' }] },
    { day: 'Wed', enabled: true, slots: [{ startTime: '09:00', endTime: '17:00' }] },
    { day: 'Thu', enabled: true, slots: [{ startTime: '09:00', endTime: '17:00' }] },
    { day: 'Fri', enabled: true, slots: [{ startTime: '09:00', endTime: '17:00' }] },
    { day: 'Sat', enabled: false, slots: [] },
    { day: 'Sun', enabled: false, slots: [] },
  ],
  maxPerSlot: 1,
  bufferTime: 15,
  triggerKeywords: ['book', 'appointment', 'schedule', 'reserve'],
  welcomeMessage: 'Hi 👋 Thanks for reaching out to book an appointment. Please reply with your preferred DATE.',
  dateRequestMessage: 'Great! Please select your preferred date:',
  timeRequestMessage: 'What time works best for you?',
  dateUnavailableMessage: 'Sorry 😕 that date is fully booked. Please choose another date.',
  confirmationMessage: '✅ Your appointment is confirmed! We look forward to seeing you.',
  sendReminder: true,
  reminderTiming: ['24h'],
  reminderMessage: '⏰ Reminder: You have an appointment today at {{time}}.',
  collectCustomerInfo: ['name', 'phone'],
  notifyAdmin: true,
};

// =====================================
// ENQUIRIES / SUPPORT AUTOMATION
// =====================================
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
}

export interface SupportTicketField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'phone' | 'email';
  required: boolean;
  options?: string[];
}

export interface EnquirySupportConfig {
  supportType: 'faq' | 'ticket' | 'hybrid';
  faqs: FAQItem[];
  ticketCategories: string[];
  ticketFields: SupportTicketField[];
  triggerKeywords: string[];
  welcomeMessage: string;
  faqNotFoundMessage: string;
  ticketCreatedMessage: string;
  escalationMessage: string;
  autoEscalateUnresolved: boolean;
  escalationTimeout: number; // minutes
  collectCustomerInfo: ('name' | 'phone' | 'email')[];
  notifyAdmin: boolean;
  workingHoursOnly: boolean;
  workingHours?: {
    start: string;
    end: string;
    days: DayOfWeek[];
  };
  outsideHoursMessage?: string;
}

export const defaultEnquiryConfig: EnquirySupportConfig = {
  supportType: 'hybrid',
  faqs: [],
  ticketCategories: ['General Inquiry', 'Technical Issue', 'Billing', 'Feedback'],
  ticketFields: [
    { id: '1', label: 'Subject', type: 'text', required: true },
    { id: '2', label: 'Description', type: 'textarea', required: true },
  ],
  triggerKeywords: ['help', 'support', 'question', 'issue', 'problem'],
  welcomeMessage: 'Hi! 👋 How can we help you today? You can ask a question or describe your issue.',
  faqNotFoundMessage: 'I couldn\'t find an answer to that. Let me connect you with our support team.',
  ticketCreatedMessage: '✅ Your support ticket has been created. We\'ll get back to you shortly.',
  escalationMessage: 'A team member will respond to you shortly.',
  autoEscalateUnresolved: true,
  escalationTimeout: 5,
  collectCustomerInfo: ['name', 'email'],
  notifyAdmin: true,
  workingHoursOnly: false,
};

// =====================================
// LEAD CAPTURE AUTOMATION
// =====================================
export interface LeadMagnet {
  id: string;
  name: string;
  type: 'pdf' | 'video' | 'discount' | 'ebook' | 'webinar' | 'other';
  deliveryMessage: string;
  fileUrl?: string;
}

export interface LeadCaptureConfig {
  captureMethod: 'comment' | 'dm' | 'both';
  triggerKeywords: string[];
  commentTriggerType: 'keyword' | 'any';
  welcomeMessage: string;
  leadMagnet?: LeadMagnet;
  followUpMessages: {
    message: string;
    delayMinutes: number;
  }[];
  collectInfo: ('name' | 'phone' | 'email' | 'company' | 'interest')[];
  qualifyingQuestions: {
    id: string;
    question: string;
    options?: string[];
  }[];
  thankYouMessage: string;
  redirectToWhatsApp: boolean;
  whatsAppNumber?: string;
  tagLeads: string[];
  notifyAdmin: boolean;
}

export const defaultLeadCaptureConfig: LeadCaptureConfig = {
  captureMethod: 'both',
  triggerKeywords: ['info', 'interested', 'price', 'more'],
  commentTriggerType: 'keyword',
  welcomeMessage: 'Hi! 👋 Thanks for your interest. Let me get your details so we can help you better.',
  followUpMessages: [
    { message: 'Just checking in! Did you have any questions?', delayMinutes: 60 },
  ],
  collectInfo: ['name', 'phone', 'email'],
  qualifyingQuestions: [],
  thankYouMessage: 'Thank you! We\'ll be in touch soon.',
  redirectToWhatsApp: false,
  tagLeads: ['new'],
  notifyAdmin: true,
};

// =====================================
// COMBINED AUTOMATION TYPE
// =====================================
export type AutomationConfig = 
  | { type: 'sales_orders'; config: SalesOrderConfig }
  | { type: 'appointments_bookings'; config: AppointmentConfig }
  | { type: 'enquiries_support'; config: EnquirySupportConfig }
  | { type: 'lead_capture'; config: LeadCaptureConfig };

export interface ConfiguredBusinessAutomation {
  id: string;
  businessCategory: BusinessCategoryType;
  categoryName: string;
  channel: string;
  automation: AutomationConfig;
  status: 'active' | 'paused';
  createdAt: string;
  updatedAt: string;
}

// =====================================
// HELPER FUNCTIONS
// =====================================
export const generateId = () => Math.random().toString(36).substring(2, 9);

export const getDefaultConfig = (category: BusinessCategoryType): AutomationConfig => {
  switch (category) {
    case 'sales_orders':
      return { type: 'sales_orders', config: { ...defaultSalesConfig } };
    case 'appointments_bookings':
      return { type: 'appointments_bookings', config: { ...defaultAppointmentConfig } };
    case 'enquiries_support':
      return { type: 'enquiries_support', config: { ...defaultEnquiryConfig } };
    case 'lead_capture':
      return { type: 'lead_capture', config: { ...defaultLeadCaptureConfig } };
  }
};

// =====================================
// PLAN TYPES (Updated)
// =====================================
export type PlanType = 'starter' | 'professional' | 'enterprise';

export interface PlanDetails {
  name: string;
  price: string;
  priceValue: number;
  maxChannels: number;
  maxAutomations: number | 'unlimited';
  maxContacts: number;
  features: string[];
  description: string;
  supportedCategories: BusinessCategoryType[];
}

export const planDetails: Record<PlanType, PlanDetails> = {
  starter: {
    name: 'Starter',
    price: '₦25,000',
    priceValue: 25000,
    maxChannels: 2,
    maxAutomations: 3,
    maxContacts: 500,
    features: [
      '2 Social Channels (WhatsApp + 1 other)',
      'Lead Capture Automation',
      'Basic FAQ Bot',
      'Dashboard Analytics',
      '500 Contacts Limit',
    ],
    description: 'WhatsApp + 1 other from IG, FB, or TikTok',
    supportedCategories: ['lead_capture', 'enquiries_support'],
  },
  professional: {
    name: 'Professional',
    price: '₦50,000',
    priceValue: 50000,
    maxChannels: 3,
    maxAutomations: 10,
    maxContacts: 2500,
    features: [
      '3 Social Channels (WhatsApp + 2 others)',
      'All Automation Types',
      'Appointment Booking',
      'Transactional Email',
      '2,500 Contacts Limit',
      'Priority Support',
    ],
    description: 'WhatsApp + 2 others',
    supportedCategories: ['lead_capture', 'enquiries_support', 'appointments_bookings', 'sales_orders'],
  },
  enterprise: {
    name: 'Enterprise',
    price: '₦120,000',
    priceValue: 120000,
    maxChannels: 4,
    maxAutomations: 'unlimited',
    maxContacts: 10000,
    features: [
      'All 4 Social Channels',
      'Unlimited Automations',
      'AI-Powered Responses',
      'Advanced Analytics',
      '10,000+ Contacts',
      'Dedicated Account Manager',
      'Custom Integrations',
    ],
    description: 'All 4 channels (IG, FB, WhatsApp, TikTok)',
    supportedCategories: ['lead_capture', 'enquiries_support', 'appointments_bookings', 'sales_orders'],
  },
};

// =====================================
// CHANNEL TYPES
// =====================================
export type ChannelType = 'instagram' | 'facebook' | 'whatsapp' | 'tiktok';

export interface ChannelConnection {
  type: ChannelType;
  connected: boolean;
  workspaceId?: string;
  accessToken?: string;
  connectedAt?: string;
  accountName?: string;
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

// Mock OAuth functions
export interface ManyChatOAuthResponse {
  success: boolean;
  workspaceId: string;
  accessToken: string;
  accountName: string;
}

export const mockManyChatOAuth = async (channel: ChannelType): Promise<ManyChatOAuthResponse> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return {
    success: true,
    workspaceId: `ws_${channel}_${Math.random().toString(36).substring(7)}`,
    accessToken: `at_${channel}_${Math.random().toString(36).substring(7)}`,
    accountName: `@demo_${channel}_account`,
  };
};

export const mockTikTokOAuth = async (): Promise<ManyChatOAuthResponse> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return {
    success: true,
    workspaceId: `tt_ws_${Math.random().toString(36).substring(7)}`,
    accessToken: `tt_at_${Math.random().toString(36).substring(7)}`,
    accountName: `@demo_tiktok_account`,
  };
};
