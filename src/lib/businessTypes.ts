// Business Types and Automation Configurations
// Supports: Sales/Orders, Appointments/Bookings, Enquiries/Support, Lead Capture, Email

export type BusinessCategoryType = 'sales_orders' | 'appointments_bookings' | 'enquiries_support' | 'lead_capture' | 'email_marketing';

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
  {
    id: 'email_marketing',
    name: 'Email Automation',
    description: 'Send automated emails for follow-ups, notifications, and marketing',
    icon: '📧',
    color: 'from-red-500 to-rose-500',
  },
];

// =====================================
// BUSINESS KIND (TYPE OF BUSINESS)
// =====================================
export type BusinessKindType = 'vendor' | 'service_provider' | 'appointment_based' | 'lead_driven';

export interface BusinessKind {
  id: BusinessKindType;
  name: string;
  description: string;
  icon: string;
  color: string;
  enabledAutomations: BusinessCategoryType[];
}

export const businessKinds: BusinessKind[] = [
  {
    id: 'vendor',
    name: 'Vendor / Online Seller',
    description: 'Sells physical or digital products',
    icon: '🛒',
    color: 'from-orange-500 to-amber-500',
    enabledAutomations: ['sales_orders', 'lead_capture', 'email_marketing'],
  },
  {
    id: 'service_provider',
    name: 'Service Provider',
    description: 'Offers services (freelancers, agencies, consultants)',
    icon: '🧑‍💼',
    color: 'from-purple-500 to-indigo-500',
    enabledAutomations: ['lead_capture', 'enquiries_support', 'email_marketing'],
  },
  {
    id: 'appointment_based',
    name: 'Appointment-Based Business',
    description: 'Clinics, salons, coaches, tutors',
    icon: '📅',
    color: 'from-blue-500 to-cyan-500',
    enabledAutomations: ['appointments_bookings', 'enquiries_support', 'email_marketing'],
  },
  {
    id: 'lead_driven',
    name: 'Lead-Driven Business',
    description: 'Realtors, marketers, schools, SaaS founders',
    icon: '📥',
    color: 'from-green-500 to-emerald-500',
    enabledAutomations: ['lead_capture', 'email_marketing'],
  },
];

// Channel types including email
export type ChannelType = 'instagram' | 'facebook' | 'whatsapp' | 'tiktok' | 'email';

// Business kind to channel automation mapping
export const businessKindChannelMap: Record<BusinessKindType, Record<ChannelType, BusinessCategoryType[]>> = {
  vendor: {
    instagram: ['sales_orders', 'lead_capture'],
    facebook: ['sales_orders'],
    whatsapp: ['sales_orders', 'lead_capture'],
    tiktok: ['lead_capture'],
    email: ['email_marketing', 'lead_capture'],
  },
  service_provider: {
    instagram: ['lead_capture'],
    facebook: ['lead_capture'],
    whatsapp: ['lead_capture', 'enquiries_support'],
    tiktok: ['lead_capture'],
    email: ['email_marketing', 'enquiries_support'],
  },
  appointment_based: {
    instagram: ['appointments_bookings', 'enquiries_support'],
    facebook: ['appointments_bookings', 'enquiries_support'],
    whatsapp: ['appointments_bookings', 'enquiries_support'],
    tiktok: ['lead_capture'],
    email: ['email_marketing', 'appointments_bookings'],
  },
  lead_driven: {
    instagram: ['lead_capture'],
    facebook: ['lead_capture'],
    whatsapp: ['lead_capture'],
    tiktok: ['lead_capture'],
    email: ['email_marketing', 'lead_capture'],
  },
};

// Get automations for a specific business kind and channel
export const getAutomationsForBusinessKind = (
  businessKind: BusinessKindType, 
  channel: ChannelType
): BusinessCategoryType[] => {
  return businessKindChannelMap[businessKind]?.[channel] || [];
};

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
// EMAIL MARKETING AUTOMATION
// =====================================
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'welcome' | 'followup' | 'reminder' | 'promotional' | 'transactional';
}

export interface EmailMarketingConfig {
  senderName: string;
  senderEmail: string;
  replyToEmail: string;
  welcomeEmailEnabled: boolean;
  welcomeEmailDelay: number; // minutes
  welcomeEmailTemplate?: EmailTemplate;
  followUpSequence: {
    template: EmailTemplate;
    delayDays: number;
  }[];
  triggerEvents: ('lead_capture' | 'order_placed' | 'appointment_booked' | 'ticket_created')[];
  trackOpens: boolean;
  trackClicks: boolean;
  unsubscribeEnabled: boolean;
}

export const defaultEmailMarketingConfig: EmailMarketingConfig = {
  senderName: 'Your Business',
  senderEmail: 'hello@yourbusiness.com',
  replyToEmail: 'support@yourbusiness.com',
  welcomeEmailEnabled: true,
  welcomeEmailDelay: 0,
  followUpSequence: [],
  triggerEvents: ['lead_capture'],
  trackOpens: true,
  trackClicks: true,
  unsubscribeEnabled: true,
};

// =====================================
// COMBINED AUTOMATION TYPE
// =====================================
export type AutomationConfig = 
  | { type: 'sales_orders'; config: SalesOrderConfig }
  | { type: 'appointments_bookings'; config: AppointmentConfig }
  | { type: 'enquiries_support'; config: EnquirySupportConfig }
  | { type: 'lead_capture'; config: LeadCaptureConfig }
  | { type: 'email_marketing'; config: EmailMarketingConfig };

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
    case 'email_marketing':
      return { type: 'email_marketing', config: { ...defaultEmailMarketingConfig } };
  }
};

// =====================================
// PLAN TYPES (Twilio SaaS: Starter $29, Growth $79, Pro $149)
// =====================================
export type PlanType = 'starter' | 'growth' | 'pro';

// Feature types for Twilio SaaS
export type FeatureType = 'booking' | 'support' | 'inquiries' | 'marketing';

export interface PlanDetails {
  name: string;
  price: string;
  priceValue: number;
  maxPhoneNumbers: number;
  maxMessages: number;
  features: string[];
  description: string;
  includedFeatures: FeatureType[];
  // Legacy fields for backwards compatibility with existing components
  maxChannels: number;
  maxAutomations: number | 'unlimited';
  maxContacts: number;
  supportedCategories: BusinessCategoryType[];
}

export const planDetails: Record<PlanType, PlanDetails> = {
  starter: {
    name: 'Starter',
    price: '$29',
    priceValue: 29,
    maxPhoneNumbers: 1,
    maxMessages: 100,
    features: [
      '1 Phone Number',
      'Appointment Booking via SMS/WhatsApp',
      'AI-powered Inquiry Responses',
      'FAQ Auto-responder',
      'Unified Inbox',
      '100 Messages/month',
      'Email Support',
    ],
    description: 'Booking + Inquiries',
    includedFeatures: ['booking', 'inquiries'],
    // Legacy fields
    maxChannels: 2,
    maxAutomations: 5,
    maxContacts: 500,
    supportedCategories: ['appointments_bookings', 'enquiries_support', 'lead_capture'],
  },
  growth: {
    name: 'Growth',
    price: '$79',
    priceValue: 79,
    maxPhoneNumbers: 2,
    maxMessages: 500,
    features: [
      '2 Phone Numbers',
      'Everything in Starter',
      'Voice Call Center (IVR)',
      'Live Agent Support via Flex',
      'Agent Takeover from Bot',
      '500 Messages/month',
      'Priority Support',
    ],
    description: 'Booking + Inquiries + Support',
    includedFeatures: ['booking', 'inquiries', 'support'],
    // Legacy fields
    maxChannels: 4,
    maxAutomations: 15,
    maxContacts: 2500,
    supportedCategories: ['appointments_bookings', 'enquiries_support', 'lead_capture', 'sales_orders'],
  },
  pro: {
    name: 'Pro',
    price: '$149',
    priceValue: 149,
    maxPhoneNumbers: 5,
    maxMessages: 2000,
    features: [
      '5 Phone Numbers',
      'Everything in Growth',
      'Mass Marketing Campaigns',
      'Bulk SMS/WhatsApp Sending',
      'CSV Contact Import',
      '2,000 Messages/month',
      'Advanced Analytics',
      'Dedicated Account Manager',
    ],
    description: 'All Features Included',
    includedFeatures: ['booking', 'inquiries', 'support', 'marketing'],
    // Legacy fields
    maxChannels: 6,
    maxAutomations: 'unlimited',
    maxContacts: 10000,
    supportedCategories: ['appointments_bookings', 'enquiries_support', 'lead_capture', 'sales_orders', 'email_marketing'],
  },
};

// Get minimum plan for selected features
export const getMinimumPlanForFeatures = (features: FeatureType[]): PlanType => {
  if (features.includes('marketing')) return 'pro';
  if (features.includes('support')) return 'growth';
  return 'starter';
};

// =====================================
// CHANNEL CONNECTION
// =====================================
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
    workspaceId: `ws_tiktok_${Math.random().toString(36).substring(7)}`,
    accessToken: `at_tiktok_${Math.random().toString(36).substring(7)}`,
    accountName: `@demo_tiktok_creator`,
  };
};

export const mockEmailConnect = async (): Promise<ManyChatOAuthResponse> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  return {
    success: true,
    workspaceId: `ws_email_${Math.random().toString(36).substring(7)}`,
    accessToken: `at_email_${Math.random().toString(36).substring(7)}`,
    accountName: `hello@yourbusiness.com`,
  };
};
