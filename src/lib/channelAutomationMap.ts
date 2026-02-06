// Channel to Automation Type Mapping
// Based on the platform capabilities and common use cases

import { ChannelType, BusinessCategoryType } from './businessTypes';

// Maps each channel to the automation types it supports
export const channelAutomationMap: Record<ChannelType, BusinessCategoryType[]> = {
  instagram: ['sales_orders', 'lead_capture'],
  facebook: ['sales_orders', 'lead_capture', 'enquiries_support'],
  whatsapp: ['sales_orders', 'appointments_bookings', 'lead_capture', 'enquiries_support'],
  tiktok: ['lead_capture'],
  email: ['email_marketing', 'lead_capture'],
};

// Get available automation types for a specific channel
export const getAvailableAutomations = (channel: ChannelType): BusinessCategoryType[] => {
  return channelAutomationMap[channel] || [];
};

// Check if a specific automation type is available for a channel
export const isAutomationAvailable = (
  channel: ChannelType, 
  automationType: BusinessCategoryType
): boolean => {
  return channelAutomationMap[channel]?.includes(automationType) || false;
};

// Get channels that support a specific automation type
export const getChannelsForAutomation = (automationType: BusinessCategoryType): ChannelType[] => {
  return (Object.keys(channelAutomationMap) as ChannelType[]).filter(
    channel => channelAutomationMap[channel].includes(automationType)
  );
};

// Channel descriptions for automation context
export const channelAutomationDescriptions: Record<ChannelType, {
  automations: { type: BusinessCategoryType; trigger: string; action: string }[];
}> = {
  instagram: {
    automations: [
      { 
        type: 'sales_orders', 
        trigger: 'Comment "price/order/buy"', 
        action: 'DM product info → Collect order/payment' 
      },
      { 
        type: 'lead_capture', 
        trigger: 'Comment/DM "interested/info"', 
        action: 'Thank you DM → Notify admin → Add to CRM' 
      },
    ],
  },
  facebook: {
    automations: [
      { 
        type: 'sales_orders', 
        trigger: 'Message with sales keywords', 
        action: 'DM product info → Collect order' 
      },
      { 
        type: 'lead_capture', 
        trigger: 'Incoming message', 
        action: 'Collect info → Add to CRM' 
      },
      { 
        type: 'enquiries_support', 
        trigger: 'Message with support keywords', 
        action: 'FAQ response → Escalate if needed' 
      },
    ],
  },
  whatsapp: {
    automations: [
      { 
        type: 'sales_orders', 
        trigger: 'Message "price/order/buy"', 
        action: 'Reply → Collect info → Payment link' 
      },
      { 
        type: 'appointments_bookings', 
        trigger: 'Message "book/appointment"', 
        action: 'Ask date/time → Confirm → Reminder' 
      },
      { 
        type: 'lead_capture', 
        trigger: 'Message "interested/info"', 
        action: 'Collect info → Notify admin → CRM' 
      },
      { 
        type: 'enquiries_support', 
        trigger: 'Support keywords', 
        action: 'FAQ bot → Ticket creation' 
      },
    ],
  },
  tiktok: {
    automations: [
      { 
        type: 'lead_capture', 
        trigger: 'Lead form / comments', 
        action: 'Auto-reply → Notify admin → Add to CRM' 
      },
    ],
  },
  email: {
    automations: [
      { 
        type: 'email_marketing', 
        trigger: 'New lead / Order / Appointment', 
        action: 'Automated emails → Follow-up sequence' 
      },
      { 
        type: 'lead_capture', 
        trigger: 'Form submission', 
        action: 'Welcome email → Nurture sequence' 
      },
    ],
  },
};
