import { apiClient, fetchPaginated } from './api-client';
import type { PaginatedResponse, QueryParams } from '@/types';
import type {
  Business,
  BusinessFeature,
  Subscription,
  CreateBusinessData,
  UpdateBusinessData,
} from '@/types/business';

const BUSINESS_ENDPOINT = '/api/business';

export const businessService = {
  /**
   * Get all businesses (admin only)
   */
  getBusinesses: async (params?: QueryParams): Promise<PaginatedResponse<Business>> => {
    return fetchPaginated<Business>(BUSINESS_ENDPOINT, params);
  },

  /**
   * Get business by ID
   */
  getBusiness: async (id: string): Promise<Business> => {
    return apiClient.get<Business>(`${BUSINESS_ENDPOINT}/${id}`);
  },

  /**
   * Get current user's business
   */
  getCurrentBusiness: async (): Promise<Business> => {
    return apiClient.get<Business>(`${BUSINESS_ENDPOINT}/current`);
  },

  /**
   * Create a new business
   */
  createBusiness: async (data: CreateBusinessData): Promise<Business> => {
    return apiClient.post<Business>(BUSINESS_ENDPOINT, data);
  },

  /**
   * Update business
   */
  updateBusiness: async (id: string, data: UpdateBusinessData): Promise<Business> => {
    return apiClient.patch<Business>(`${BUSINESS_ENDPOINT}/${id}`, data);
  },

  /**
   * Delete business (admin only)
   */
  deleteBusiness: async (id: string): Promise<{ success: boolean }> => {
    return apiClient.delete<{ success: boolean }>(`${BUSINESS_ENDPOINT}/${id}`);
  },

  /**
   * Get business features
   */
  getFeatures: async (businessId: string): Promise<BusinessFeature[]> => {
    return apiClient.get<BusinessFeature[]>(`${BUSINESS_ENDPOINT}/${businessId}/features`);
  },

  /**
   * Update business feature
   */
  updateFeature: async (
    businessId: string,
    featureId: string,
    data: Partial<BusinessFeature>
  ): Promise<BusinessFeature> => {
    return apiClient.patch<BusinessFeature>(
      `${BUSINESS_ENDPOINT}/${businessId}/features/${featureId}`,
      data
    );
  },

  /**
   * Get business subscription
   */
  getSubscription: async (businessId: string): Promise<Subscription> => {
    return apiClient.get<Subscription>(`${BUSINESS_ENDPOINT}/${businessId}/subscription`);
  },

  /**
   * Update subscription plan
   */
  updateSubscription: async (
    businessId: string,
    plan: string
  ): Promise<Subscription> => {
    return apiClient.patch<Subscription>(
      `${BUSINESS_ENDPOINT}/${businessId}/subscription`,
      { plan }
    );
  },

  /**
   * Get business statistics
   */
  getStats: async (businessId: string): Promise<{
    totalContacts: number;
    totalConversations: number;
    totalBookings: number;
    messagesThisMonth: number;
  }> => {
    return apiClient.get(`${BUSINESS_ENDPOINT}/${businessId}/stats`);
  },
};

export default businessService;
