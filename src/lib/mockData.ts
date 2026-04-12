// Mock data for the application

export interface Lead {
  id: string;
  name: string;
  phone: string;
  platform: 'whatsapp' | 'instagram' | 'facebook' | 'tiktok';
  status: 'new' | 'interested' | 'paid';
  date: string;
  messages: { sender: 'bot' | 'user'; text: string; time: string }[];
}

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  apiKey: string;
  status: 'active' | 'suspended';
  plan: 'Starter' | 'Growth' | 'Pro';
  leadLimit: number;
  leadsUsed: number;
  revenue: number;
  joinedDate: string;
  platforms: {
    whatsapp: boolean;
    instagram: boolean;
    facebook: boolean;
    tiktok: boolean;
  };
  notificationNumber: string;
  automations: {
    goalId: string;
    goalName: string;
    channel: string;
    status: 'active' | 'paused';
  }[];
  planExpiryDate: string;
}

export interface Activity {
  id: string;
  type: 'lead' | 'sale' | 'message' | 'bot';
  platform: 'whatsapp' | 'instagram' | 'facebook' | 'tiktok';
  message: string;
  time: string;
}

export interface WebhookLog {
  id: string;
  timestamp: string;
  source: string;
  endpoint: string;
  status: 'success' | 'error';
  payload: string;
  response: string;
}

// Generate mock leads
export const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Adebayo Johnson',
    phone: '+234 801 234 5678',
    platform: 'whatsapp',
    status: 'paid',
    date: '2024-12-10',
    messages: [
      { sender: 'user', text: 'Hi, I saw your ad about the product', time: '10:30 AM' },
      { sender: 'bot', text: 'Hello! Welcome to our store. How can I help you today?', time: '10:30 AM' },
      { sender: 'user', text: 'How much is the premium package?', time: '10:31 AM' },
      { sender: 'bot', text: 'Our premium package is ₦25,000. It includes...', time: '10:31 AM' },
      { sender: 'user', text: 'Great! I want to buy', time: '10:35 AM' },
    ],
  },
  {
    id: '2',
    name: 'Chioma Okafor',
    phone: '+234 802 345 6789',
    platform: 'instagram',
    status: 'interested',
    date: '2024-12-09',
    messages: [
      { sender: 'user', text: 'Is this still available?', time: '2:15 PM' },
      { sender: 'bot', text: 'Yes! It is available. Would you like more details?', time: '2:15 PM' },
      { sender: 'user', text: 'Yes please', time: '2:20 PM' },
    ],
  },
  {
    id: '3',
    name: 'Emeka Nwosu',
    phone: '+234 803 456 7890',
    platform: 'facebook',
    status: 'new',
    date: '2024-12-11',
    messages: [
      { sender: 'user', text: 'Hello', time: '9:00 AM' },
      { sender: 'bot', text: 'Hi there! Welcome. How can I assist you?', time: '9:00 AM' },
    ],
  },
  {
    id: '4',
    name: 'Fatima Ibrahim',
    phone: '+234 804 567 8901',
    platform: 'whatsapp',
    status: 'paid',
    date: '2024-12-08',
    messages: [
      { sender: 'user', text: 'I want to order', time: '4:00 PM' },
      { sender: 'bot', text: 'Great! What would you like to order?', time: '4:00 PM' },
    ],
  },
  {
    id: '5',
    name: 'Gbenga Adeleke',
    phone: '+234 805 678 9012',
    platform: 'tiktok',
    status: 'interested',
    date: '2024-12-07',
    messages: [
      { sender: 'user', text: 'Saw your TikTok video', time: '11:00 AM' },
      { sender: 'bot', text: 'Thank you! Which product caught your attention?', time: '11:00 AM' },
    ],
  },
  {
    id: '6',
    name: 'Halima Yusuf',
    phone: '+234 806 789 0123',
    platform: 'instagram',
    status: 'new',
    date: '2024-12-11',
    messages: [
      { sender: 'user', text: 'Price?', time: '3:30 PM' },
    ],
  },
  {
    id: '7',
    name: 'Ikenna Obiora',
    phone: '+234 807 890 1234',
    platform: 'whatsapp',
    status: 'paid',
    date: '2024-12-06',
    messages: [
      { sender: 'user', text: 'Ready to pay', time: '1:00 PM' },
      { sender: 'bot', text: 'Perfect! Here are the payment details...', time: '1:00 PM' },
    ],
  },
  {
    id: '8',
    name: 'Juliet Eze',
    phone: '+234 808 901 2345',
    platform: 'facebook',
    status: 'interested',
    date: '2024-12-10',
    messages: [
      { sender: 'user', text: 'Do you deliver to Abuja?', time: '5:00 PM' },
      { sender: 'bot', text: 'Yes, we deliver nationwide!', time: '5:00 PM' },
    ],
  },
];

// Generate mock activities
export const mockActivities: Activity[] = [
  { id: '1', type: 'lead', platform: 'whatsapp', message: 'New lead captured from WhatsApp', time: '2 min ago' },
  { id: '2', type: 'sale', platform: 'instagram', message: 'Sale confirmed: ₦25,000', time: '15 min ago' },
  { id: '3', type: 'message', platform: 'whatsapp', message: 'Bot replied to customer inquiry', time: '23 min ago' },
  { id: '4', type: 'lead', platform: 'tiktok', message: 'New lead from TikTok ad', time: '45 min ago' },
  { id: '5', type: 'bot', platform: 'facebook', message: 'Bot activated for Facebook page', time: '1 hour ago' },
  { id: '6', type: 'sale', platform: 'whatsapp', message: 'Sale confirmed: ₦15,000', time: '2 hours ago' },
  { id: '7', type: 'message', platform: 'instagram', message: 'Customer requested callback', time: '3 hours ago' },
];

// Chart data for last 30 days
export const generateChartData = () => {
  const data = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      leads: Math.floor(Math.random() * 30) + 10,
      sales: Math.floor(Math.random() * 15) + 5,
    });
  }
  
  return data;
};

// Mock clients for admin
export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Jordan Smith',
    company: 'Demo Company',
    email: 'jordan@demo.com',
    phone: '+234 801 111 1111',
    apiKey: 'ak_live_Xk9j2mNp4Q7rT1wZ8vB3cD6fH0gI',
    status: 'active',
    plan: 'Growth',
    leadLimit: 1000,
    leadsUsed: 456,
    revenue: 2450000,
    joinedDate: '2024-06-15',
    platforms: { whatsapp: true, instagram: true, facebook: false, tiktok: false },
    notificationNumber: '+234 801 111 1111',
    automations: [
      { goalId: 'lead_capture', goalName: 'Get Leads from Comments', channel: 'instagram', status: 'active' },
      { goalId: 'whatsapp_redirect', goalName: 'Redirect to WhatsApp', channel: 'instagram', status: 'active' },
    ],
    planExpiryDate: '2025-02-15',
  },
  {
    id: '2',
    name: 'Sarah Okonkwo',
    company: 'TechStart Inc',
    email: 'sarah@techstart.ng',
    phone: '+234 802 222 2222',
    apiKey: 'ak_live_Lm8k3nOq5R9sU2xA1yC4eF7hJ0lK',
    status: 'active',
    plan: 'Pro',
    leadLimit: 5000,
    leadsUsed: 1234,
    revenue: 5800000,
    joinedDate: '2024-03-20',
    platforms: { whatsapp: true, instagram: true, facebook: true, tiktok: true },
    notificationNumber: '+234 802 222 2222',
    automations: [
      { goalId: 'lead_capture', goalName: 'Get Leads from Comments', channel: 'instagram', status: 'active' },
      { goalId: 'auto_reply', goalName: 'Reply to DMs', channel: 'facebook', status: 'active' },
      { goalId: 'faq_bot', goalName: 'Answer FAQs', channel: 'whatsapp', status: 'active' },
      { goalId: 'whatsapp_redirect', goalName: 'Redirect to WhatsApp', channel: 'tiktok', status: 'paused' },
    ],
    planExpiryDate: '2025-03-20',
  },
  {
    id: '3',
    name: 'Michael Adekunle',
    company: 'Growth Co',
    email: 'michael@growth.co',
    phone: '+234 803 333 3333',
    apiKey: 'ak_live_Pn0l4oRr6S1tV3yB2zA5dG8iL1mN',
    status: 'active',
    plan: 'Starter',
    leadLimit: 500,
    leadsUsed: 389,
    revenue: 890000,
    joinedDate: '2024-09-01',
    platforms: { whatsapp: true, instagram: false, facebook: false, tiktok: false },
    notificationNumber: '+234 803 333 3333',
    automations: [
      { goalId: 'faq_bot', goalName: 'Answer FAQs', channel: 'whatsapp', status: 'active' },
    ],
    planExpiryDate: '2025-01-01',
  },
  {
    id: '4',
    name: 'Amara Chukwu',
    company: 'RetailMax',
    email: 'amara@retailmax.ng',
    phone: '+234 804 444 4444',
    apiKey: 'ak_live_Qo1m5pSs7T2uW4zC3aB6eH9jM2oP',
    status: 'suspended',
    plan: 'Growth',
    leadLimit: 1000,
    leadsUsed: 1000,
    revenue: 1200000,
    joinedDate: '2024-07-10',
    platforms: { whatsapp: true, instagram: true, facebook: false, tiktok: false },
    notificationNumber: '+234 804 444 4444',
    automations: [
      { goalId: 'lead_capture', goalName: 'Get Leads from Comments', channel: 'instagram', status: 'paused' },
    ],
    planExpiryDate: '2025-02-10',
  },
  {
    id: '5',
    name: 'David Obi',
    company: 'Fashion Hub',
    email: 'david@fashionhub.ng',
    phone: '+234 805 555 5555',
    apiKey: 'ak_live_Rp2n6qTt8U3vX5aC4bD7fI0kN3pQ',
    status: 'active',
    plan: 'Pro',
    leadLimit: 5000,
    leadsUsed: 2890,
    revenue: 7500000,
    joinedDate: '2024-01-05',
    platforms: { whatsapp: true, instagram: true, facebook: true, tiktok: true },
    notificationNumber: '+234 805 555 5555',
    automations: [
      { goalId: 'lead_capture', goalName: 'Get Leads from Comments', channel: 'instagram', status: 'active' },
      { goalId: 'lead_capture', goalName: 'Get Leads from Comments', channel: 'tiktok', status: 'active' },
      { goalId: 'auto_reply', goalName: 'Reply to DMs', channel: 'instagram', status: 'active' },
      { goalId: 'faq_bot', goalName: 'Answer FAQs', channel: 'whatsapp', status: 'active' },
      { goalId: 'whatsapp_redirect', goalName: 'Redirect to WhatsApp', channel: 'facebook', status: 'active' },
    ],
    planExpiryDate: '2025-04-05',
  },
];

// Webhook logs - Twilio-based webhooks
export const mockWebhookLogs: WebhookLog[] = [
  {
    id: '1',
    timestamp: '2026-04-11T14:32:15Z',
    source: 'Twilio SMS',
    endpoint: '/api/webhooks/twilio/sms',
    status: 'success',
    payload: '{"From": "+1234567890", "To": "+1987654321", "Body": "I want to book an appointment", "MessageSid": "SM123abc"}',
    response: '{"status": "received", "conversation_id": "conv_abc123", "ai_responded": true}',
  },
  {
    id: '2',
    timestamp: '2026-04-11T14:30:45Z',
    source: 'Twilio Voice',
    endpoint: '/api/webhooks/twilio/voice',
    status: 'success',
    payload: '{"CallSid": "CA123xyz", "From": "+1234567891", "To": "+1987654321", "CallStatus": "ringing"}',
    response: '{"status": "call_initiated", "ivr_flow": "main_menu"}',
  },
  {
    id: '3',
    timestamp: '2026-04-11T14:28:30Z',
    source: 'Twilio WhatsApp',
    endpoint: '/api/webhooks/twilio/whatsapp',
    status: 'error',
    payload: '{"From": "whatsapp:+1234567892", "Body": null, "MediaUrl0": null}',
    response: '{"error": "Invalid message format - empty body"}',
  },
  {
    id: '4',
    timestamp: '2026-04-11T14:25:00Z',
    source: 'Twilio SMS',
    endpoint: '/api/webhooks/twilio/sms/status',
    status: 'success',
    payload: '{"MessageSid": "SM456def", "MessageStatus": "delivered", "To": "+1234567893"}',
    response: '{"status": "status_updated", "delivery_confirmed": true}',
  },
  {
    id: '5',
    timestamp: '2026-04-11T14:20:15Z',
    source: 'Twilio Voice',
    endpoint: '/api/webhooks/twilio/voice/status',
    status: 'success',
    payload: '{"CallSid": "CA789ghi", "CallStatus": "completed", "CallDuration": "245", "From": "+1234567894"}',
    response: '{"status": "call_completed", "recording_url": "https://api.twilio.com/recordings/RE123"}',
  },
  {
    id: '6',
    timestamp: '2026-04-11T14:15:00Z',
    source: 'SendGrid',
    endpoint: '/api/webhooks/sendgrid/events',
    status: 'success',
    payload: '{"event": "open", "email": "customer@example.com", "campaign_id": "camp_123", "timestamp": 1712847300}',
    response: '{"status": "event_logged", "open_tracked": true}',
  },
  {
    id: '7',
    timestamp: '2026-04-11T14:10:30Z',
    source: 'Twilio WhatsApp',
    endpoint: '/api/webhooks/twilio/whatsapp',
    status: 'success',
    payload: '{"From": "whatsapp:+1234567895", "Body": "What are your business hours?", "ProfileName": "John Doe"}',
    response: '{"status": "received", "ai_responded": true, "response_type": "faq_auto_reply"}',
  },
];

// Client traffic data for admin bar chart
export const clientTrafficData = mockClients
  .filter(c => c.status === 'active')
  .map(client => ({
    name: client.company,
    messages: client.leadsUsed, // Now represents messages sent
    revenue: client.revenue / 1000, // in thousands
  }))
  .sort((a, b) => b.messages - a.messages);

// =====================================
// ADMIN AGGREGATE DATA FOR NEW FEATURES
// =====================================

// Aggregate Booking/Calendar Data
export interface AdminBookingStats {
  clientId: string;
  clientName: string;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  noShowRate: number;
  avgBookingsPerDay: number;
}

export const adminBookingStats: AdminBookingStats[] = [
  {
    clientId: '1',
    clientName: 'Demo Company',
    totalBookings: 145,
    pendingBookings: 12,
    confirmedBookings: 28,
    completedBookings: 98,
    cancelledBookings: 7,
    noShowRate: 4.8,
    avgBookingsPerDay: 4.8,
  },
  {
    clientId: '2',
    clientName: 'TechStart Inc',
    totalBookings: 312,
    pendingBookings: 24,
    confirmedBookings: 45,
    completedBookings: 230,
    cancelledBookings: 13,
    noShowRate: 3.2,
    avgBookingsPerDay: 10.4,
  },
  {
    clientId: '3',
    clientName: 'Growth Co',
    totalBookings: 89,
    pendingBookings: 8,
    confirmedBookings: 15,
    completedBookings: 62,
    cancelledBookings: 4,
    noShowRate: 5.1,
    avgBookingsPerDay: 3.0,
  },
  {
    clientId: '5',
    clientName: 'Fashion Hub',
    totalBookings: 456,
    pendingBookings: 35,
    confirmedBookings: 68,
    completedBookings: 340,
    cancelledBookings: 13,
    noShowRate: 2.9,
    avgBookingsPerDay: 15.2,
  },
];

// Aggregate Call Center Data
export interface AdminCallStats {
  clientId: string;
  clientName: string;
  totalCalls: number;
  inboundCalls: number;
  outboundCalls: number;
  missedCalls: number;
  avgCallDuration: number; // in seconds
  avgWaitTime: number; // in seconds
  resolutionRate: number;
}

export const adminCallStats: AdminCallStats[] = [
  {
    clientId: '1',
    clientName: 'Demo Company',
    totalCalls: 234,
    inboundCalls: 156,
    outboundCalls: 78,
    missedCalls: 12,
    avgCallDuration: 245,
    avgWaitTime: 18,
    resolutionRate: 87,
  },
  {
    clientId: '2',
    clientName: 'TechStart Inc',
    totalCalls: 567,
    inboundCalls: 398,
    outboundCalls: 169,
    missedCalls: 23,
    avgCallDuration: 312,
    avgWaitTime: 15,
    resolutionRate: 92,
  },
  {
    clientId: '3',
    clientName: 'Growth Co',
    totalCalls: 123,
    inboundCalls: 89,
    outboundCalls: 34,
    missedCalls: 8,
    avgCallDuration: 198,
    avgWaitTime: 22,
    resolutionRate: 84,
  },
  {
    clientId: '5',
    clientName: 'Fashion Hub',
    totalCalls: 789,
    inboundCalls: 512,
    outboundCalls: 277,
    missedCalls: 31,
    avgCallDuration: 267,
    avgWaitTime: 12,
    resolutionRate: 95,
  },
];

// Aggregate Marketing Campaign Data
export interface AdminCampaignStats {
  clientId: string;
  clientName: string;
  totalCampaigns: number;
  activeCampaigns: number;
  totalRecipients: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
  avgOpenRate: number;
  avgClickRate: number;
}

export const adminCampaignStats: AdminCampaignStats[] = [
  {
    clientId: '1',
    clientName: 'Demo Company',
    totalCampaigns: 12,
    activeCampaigns: 2,
    totalRecipients: 15600,
    totalDelivered: 14892,
    totalOpened: 5215,
    totalClicked: 1245,
    avgOpenRate: 35.0,
    avgClickRate: 8.4,
  },
  {
    clientId: '2',
    clientName: 'TechStart Inc',
    totalCampaigns: 28,
    activeCampaigns: 5,
    totalRecipients: 45200,
    totalDelivered: 43892,
    totalOpened: 18345,
    totalClicked: 4892,
    avgOpenRate: 41.8,
    avgClickRate: 11.1,
  },
  {
    clientId: '3',
    clientName: 'Growth Co',
    totalCampaigns: 6,
    activeCampaigns: 1,
    totalRecipients: 5800,
    totalDelivered: 5512,
    totalOpened: 1876,
    totalClicked: 423,
    avgOpenRate: 34.0,
    avgClickRate: 7.7,
  },
  {
    clientId: '5',
    clientName: 'Fashion Hub',
    totalCampaigns: 45,
    activeCampaigns: 8,
    totalRecipients: 89500,
    totalDelivered: 86845,
    totalOpened: 38912,
    totalClicked: 12456,
    avgOpenRate: 44.8,
    avgClickRate: 14.3,
  },
];

// Aggregate summary calculations
export const getAdminBookingSummary = () => {
  const totals = adminBookingStats.reduce(
    (acc, stat) => ({
      totalBookings: acc.totalBookings + stat.totalBookings,
      pendingBookings: acc.pendingBookings + stat.pendingBookings,
      confirmedBookings: acc.confirmedBookings + stat.confirmedBookings,
      completedBookings: acc.completedBookings + stat.completedBookings,
      cancelledBookings: acc.cancelledBookings + stat.cancelledBookings,
    }),
    { totalBookings: 0, pendingBookings: 0, confirmedBookings: 0, completedBookings: 0, cancelledBookings: 0 }
  );
  return {
    ...totals,
    avgNoShowRate: adminBookingStats.reduce((acc, s) => acc + s.noShowRate, 0) / adminBookingStats.length,
    totalClients: adminBookingStats.length,
  };
};

export const getAdminCallSummary = () => {
  const totals = adminCallStats.reduce(
    (acc, stat) => ({
      totalCalls: acc.totalCalls + stat.totalCalls,
      inboundCalls: acc.inboundCalls + stat.inboundCalls,
      outboundCalls: acc.outboundCalls + stat.outboundCalls,
      missedCalls: acc.missedCalls + stat.missedCalls,
    }),
    { totalCalls: 0, inboundCalls: 0, outboundCalls: 0, missedCalls: 0 }
  );
  return {
    ...totals,
    avgCallDuration: Math.round(adminCallStats.reduce((acc, s) => acc + s.avgCallDuration, 0) / adminCallStats.length),
    avgResolutionRate: (adminCallStats.reduce((acc, s) => acc + s.resolutionRate, 0) / adminCallStats.length).toFixed(1),
    totalClients: adminCallStats.length,
  };
};

export const getAdminCampaignSummary = () => {
  const totals = adminCampaignStats.reduce(
    (acc, stat) => ({
      totalCampaigns: acc.totalCampaigns + stat.totalCampaigns,
      activeCampaigns: acc.activeCampaigns + stat.activeCampaigns,
      totalRecipients: acc.totalRecipients + stat.totalRecipients,
      totalDelivered: acc.totalDelivered + stat.totalDelivered,
      totalOpened: acc.totalOpened + stat.totalOpened,
      totalClicked: acc.totalClicked + stat.totalClicked,
    }),
    { totalCampaigns: 0, activeCampaigns: 0, totalRecipients: 0, totalDelivered: 0, totalOpened: 0, totalClicked: 0 }
  );
  return {
    ...totals,
    avgOpenRate: ((totals.totalOpened / totals.totalDelivered) * 100).toFixed(1),
    avgClickRate: ((totals.totalClicked / totals.totalDelivered) * 100).toFixed(1),
    totalClients: adminCampaignStats.length,
  };
};

// =====================================
// CONTACTS DATA FOR CLIENT PORTAL
// =====================================

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string;
  company: string | null;
  tags: string[];
  notes: string | null;
  source: 'manual' | 'inbox' | 'call_center' | 'import';
  preferredChannel: 'sms' | 'whatsapp' | 'email' | 'voice' | null;
  createdAt: string;
  updatedAt: string;
  lastContactedAt: string | null;
  totalConversations: number;
  totalCalls: number;
}

export const mockContacts: Contact[] = [
  {
    id: 'c1',
    firstName: 'Amara',
    lastName: 'Okafor',
    email: 'amara.okafor@example.com',
    phone: '+1 555-0100',
    company: 'Okafor Enterprises',
    tags: ['VIP', 'Repeat Customer'],
    notes: 'Prefers WhatsApp communication. Usually orders skincare bundles.',
    source: 'inbox',
    preferredChannel: 'whatsapp',
    createdAt: '2026-03-15T10:00:00Z',
    updatedAt: '2026-04-11T10:32:00Z',
    lastContactedAt: '2026-04-11T10:32:00Z',
    totalConversations: 12,
    totalCalls: 2,
  },
  {
    id: 'c2',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@email.com',
    phone: '+1 555-0123',
    company: null,
    tags: ['New Lead'],
    notes: 'Interested in appointment booking',
    source: 'inbox',
    preferredChannel: 'sms',
    createdAt: '2026-04-10T09:45:00Z',
    updatedAt: '2026-04-11T09:52:00Z',
    lastContactedAt: '2026-04-11T09:52:00Z',
    totalConversations: 2,
    totalCalls: 0,
  },
  {
    id: 'c3',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.j@company.com',
    phone: '+1 555-0456',
    company: 'Johnson & Co',
    tags: ['Support', 'Escalated'],
    notes: 'Had refund issue - resolved. Follow up in 1 week.',
    source: 'inbox',
    preferredChannel: 'whatsapp',
    createdAt: '2026-02-20T14:00:00Z',
    updatedAt: '2026-04-11T08:25:00Z',
    lastContactedAt: '2026-04-11T08:25:00Z',
    totalConversations: 8,
    totalCalls: 3,
  },
  {
    id: 'c4',
    firstName: 'Mike',
    lastName: 'Brown',
    email: 'mike.brown@business.com',
    phone: '+1 555-0789',
    company: 'Brown Industries',
    tags: ['Business'],
    notes: 'Billing inquiry - prefers voice calls',
    source: 'call_center',
    preferredChannel: 'voice',
    createdAt: '2026-03-01T11:00:00Z',
    updatedAt: '2026-04-11T09:02:00Z',
    lastContactedAt: '2026-04-11T09:02:00Z',
    totalConversations: 3,
    totalCalls: 7,
  },
  {
    id: 'c5',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.d@gmail.com',
    phone: '+1 555-0234',
    company: null,
    tags: ['Customer', 'Purchased'],
    notes: 'Purchased premium package',
    source: 'inbox',
    preferredChannel: 'whatsapp',
    createdAt: '2026-04-11T07:30:00Z',
    updatedAt: '2026-04-11T07:40:00Z',
    lastContactedAt: '2026-04-11T07:40:00Z',
    totalConversations: 1,
    totalCalls: 0,
  },
  {
    id: 'c6',
    firstName: 'David',
    lastName: 'Chen',
    email: 'david.chen@example.com',
    phone: '+1 555-0567',
    company: 'Chen Tech',
    tags: ['Business', 'Email Preferred'],
    notes: 'Waiting for shipping update on order #12345',
    source: 'inbox',
    preferredChannel: 'email',
    createdAt: '2026-04-09T09:00:00Z',
    updatedAt: '2026-04-11T10:15:00Z',
    lastContactedAt: '2026-04-11T10:15:00Z',
    totalConversations: 4,
    totalCalls: 0,
  },
  {
    id: 'c7',
    firstName: 'Emma',
    lastName: 'Wilson',
    email: 'emma.wilson@company.com',
    phone: '+1 555-0678',
    company: 'TechCorp',
    tags: ['Partnership', 'High Priority'],
    notes: 'Marketing Director - interested in partnership',
    source: 'inbox',
    preferredChannel: 'email',
    createdAt: '2026-04-11T08:30:00Z',
    updatedAt: '2026-04-11T08:45:00Z',
    lastContactedAt: '2026-04-11T08:45:00Z',
    totalConversations: 1,
    totalCalls: 0,
  },
  {
    id: 'c8',
    firstName: 'Lisa',
    lastName: 'Anderson',
    email: null,
    phone: '+1 555-0345',
    company: null,
    tags: ['Appointment'],
    notes: 'Booked consultation for Friday 3pm',
    source: 'inbox',
    preferredChannel: 'sms',
    createdAt: '2026-04-11T05:20:00Z',
    updatedAt: '2026-04-11T05:25:00Z',
    lastContactedAt: '2026-04-11T05:25:00Z',
    totalConversations: 1,
    totalCalls: 0,
  },
];
