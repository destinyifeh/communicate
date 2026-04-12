// API client for communicating with the backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for session management
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.message || data.error || 'Request failed' };
    }

    return { data };
  } catch (error: any) {
    return { error: error.message || 'Network error' };
  }
}

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    request<{ user: any; accessToken: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  signup: (data: {
    email: string;
    password: string;
    name: string;
    role?: string;
    businessName?: string;
    businessSlug?: string;
  }) =>
    request<{ user: any; accessToken: string }>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () =>
    request('/api/auth/logout', {
      method: 'POST',
    }),

  getSession: () =>
    request<{ user: any }>('/api/auth/session', {
      method: 'GET',
    }),

  getProfile: () =>
    request<any>('/api/auth/me', {
      method: 'GET',
    }),

  updateProfile: (data: {
    businessName?: string;
    businessSlug?: string;
    businessLogo?: string;
    brandColor?: string;
  }) =>
    request<{ user: any }>('/api/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

// Messaging API
export const messagingApi = {
  sendSMS: (to: string, body: string, businessId: string) =>
    request('/api/messaging/sms', {
      method: 'POST',
      body: JSON.stringify({ to, body, businessId }),
    }),

  sendWhatsApp: (to: string, body: string, businessId: string) =>
    request('/api/messaging/whatsapp', {
      method: 'POST',
      body: JSON.stringify({ to, body, businessId }),
    }),
};

// Business API
export const businessApi = {
  getBusinesses: () =>
    request<any[]>('/api/business', { method: 'GET' }),

  getBusiness: (id: string) =>
    request<any>(`/api/business/${id}`, { method: 'GET' }),

  updateBusiness: (id: string, data: any) =>
    request<any>(`/api/business/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

// Contacts API
export const contactsApi = {
  getContacts: (businessId: string) =>
    request<any[]>(`/api/contacts?businessId=${businessId}`, { method: 'GET' }),

  createContact: (data: any) =>
    request<any>('/api/contacts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateContact: (id: string, data: any) =>
    request<any>(`/api/contacts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteContact: (id: string) =>
    request(`/api/contacts/${id}`, { method: 'DELETE' }),
};

// Bookings API
export const bookingsApi = {
  getBookings: (businessId: string) =>
    request<any[]>(`/api/bookings?businessId=${businessId}`, { method: 'GET' }),

  createBooking: (data: any) =>
    request<any>('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateBooking: (id: string, data: any) =>
    request<any>(`/api/bookings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  cancelBooking: (id: string, reason?: string) =>
    request(`/api/bookings/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
};

// Campaigns API
export const campaignsApi = {
  getCampaigns: (businessId: string) =>
    request<any[]>(`/api/campaigns?businessId=${businessId}`, { method: 'GET' }),

  createCampaign: (data: any) =>
    request<any>('/api/campaigns', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateCampaign: (id: string, data: any) =>
    request<any>(`/api/campaigns/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  sendCampaign: (id: string) =>
    request(`/api/campaigns/${id}/send`, { method: 'POST' }),
};

// Conversations API
export const conversationsApi = {
  getConversations: (businessId: string) =>
    request<any[]>(`/api/conversations?businessId=${businessId}`, { method: 'GET' }),

  getConversation: (id: string) =>
    request<any>(`/api/conversations/${id}`, { method: 'GET' }),

  getMessages: (conversationId: string) =>
    request<any[]>(`/api/conversations/${conversationId}/messages`, { method: 'GET' }),

  sendMessage: (conversationId: string, body: string) =>
    request<any>(`/api/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ body }),
    }),
};

export default {
  auth: authApi,
  messaging: messagingApi,
  business: businessApi,
  contacts: contactsApi,
  bookings: bookingsApi,
  campaigns: campaignsApi,
  conversations: conversationsApi,
};
