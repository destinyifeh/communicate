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
  plan: string;
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
    company: 'Acme Corp',
    email: 'jordan@acme.com',
    phone: '+234 801 111 1111',
    apiKey: 'ak_live_Xk9j2mNp4Q7rT1wZ8vB3cD6fH0gI',
    status: 'active',
    plan: 'Professional',
    leadLimit: 1000,
    leadsUsed: 456,
    revenue: 2450000,
    joinedDate: '2024-06-15',
    platforms: { whatsapp: true, instagram: true, facebook: false, tiktok: false },
    notificationNumber: '+234 801 111 1111',
  },
  {
    id: '2',
    name: 'Sarah Okonkwo',
    company: 'TechStart Inc',
    email: 'sarah@techstart.ng',
    phone: '+234 802 222 2222',
    apiKey: 'ak_live_Lm8k3nOq5R9sU2xA1yC4eF7hJ0lK',
    status: 'active',
    plan: 'Enterprise',
    leadLimit: 5000,
    leadsUsed: 1234,
    revenue: 5800000,
    joinedDate: '2024-03-20',
    platforms: { whatsapp: true, instagram: true, facebook: true, tiktok: true },
    notificationNumber: '+234 802 222 2222',
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
  },
  {
    id: '4',
    name: 'Amara Chukwu',
    company: 'RetailMax',
    email: 'amara@retailmax.ng',
    phone: '+234 804 444 4444',
    apiKey: 'ak_live_Qo1m5pSs7T2uW4zC3aB6eH9jM2oP',
    status: 'suspended',
    plan: 'Professional',
    leadLimit: 1000,
    leadsUsed: 1000,
    revenue: 1200000,
    joinedDate: '2024-07-10',
    platforms: { whatsapp: true, instagram: true, facebook: false, tiktok: false },
    notificationNumber: '+234 804 444 4444',
  },
  {
    id: '5',
    name: 'David Obi',
    company: 'Fashion Hub',
    email: 'david@fashionhub.ng',
    phone: '+234 805 555 5555',
    apiKey: 'ak_live_Rp2n6qTt8U3vX5aC4bD7fI0kN3pQ',
    status: 'active',
    plan: 'Enterprise',
    leadLimit: 5000,
    leadsUsed: 2890,
    revenue: 7500000,
    joinedDate: '2024-01-05',
    platforms: { whatsapp: true, instagram: true, facebook: true, tiktok: true },
    notificationNumber: '+234 805 555 5555',
  },
];

// Webhook logs
export const mockWebhookLogs: WebhookLog[] = [
  {
    id: '1',
    timestamp: '2024-12-11T14:32:15Z',
    source: 'ManyChat',
    endpoint: '/api/webhooks/manychat',
    status: 'success',
    payload: '{"user_id": "12345", "message": "Hello", "platform": "instagram"}',
    response: '{"status": "received", "lead_id": "abc123"}',
  },
  {
    id: '2',
    timestamp: '2024-12-11T14:30:45Z',
    source: 'WAmation',
    endpoint: '/api/webhooks/wamation',
    status: 'success',
    payload: '{"phone": "+234801234567", "message": "Price?", "type": "text"}',
    response: '{"status": "processed", "bot_response": true}',
  },
  {
    id: '3',
    timestamp: '2024-12-11T14:28:30Z',
    source: 'ManyChat',
    endpoint: '/api/webhooks/manychat',
    status: 'error',
    payload: '{"user_id": "67890", "message": null}',
    response: '{"error": "Invalid message format"}',
  },
  {
    id: '4',
    timestamp: '2024-12-11T14:25:00Z',
    source: 'TikTok',
    endpoint: '/api/webhooks/tiktok',
    status: 'success',
    payload: '{"lead_info": {"name": "Test User", "comment": "Interested!"}}',
    response: '{"status": "lead_created"}',
  },
  {
    id: '5',
    timestamp: '2024-12-11T14:20:15Z',
    source: 'WAmation',
    endpoint: '/api/webhooks/wamation',
    status: 'success',
    payload: '{"phone": "+234802345678", "type": "payment_confirmed", "amount": 25000}',
    response: '{"status": "sale_recorded"}',
  },
];

// Client traffic data for admin bar chart
export const clientTrafficData = mockClients
  .filter(c => c.status === 'active')
  .map(client => ({
    name: client.company,
    leads: client.leadsUsed,
    revenue: client.revenue / 1000, // in thousands
  }))
  .sort((a, b) => b.leads - a.leads);
