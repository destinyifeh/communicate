import { apiClient, fetchPaginated } from './api-client';
import type { PaginatedResponse, QueryParams } from '@/types';
import type {
  Campaign,
  CampaignStatus,
  CreateCampaignData,
  UpdateCampaignData,
  CampaignFilters,
  CampaignStats,
  SendTestMessageData,
} from '@/types/campaign';

const CAMPAIGNS_ENDPOINT = '/api/campaigns';

/** Query params for fetching campaigns */
export interface CampaignQueryParams extends QueryParams, CampaignFilters {
  businessId?: string;
}

export const campaignService = {
  /**
   * Get campaigns with pagination and filters
   */
  getCampaigns: async (params?: CampaignQueryParams): Promise<PaginatedResponse<Campaign>> => {
    return fetchPaginated<Campaign>(CAMPAIGNS_ENDPOINT, params);
  },

  /**
   * Get campaign by ID
   */
  getCampaign: async (id: string): Promise<Campaign> => {
    return apiClient.get<Campaign>(`${CAMPAIGNS_ENDPOINT}/${id}`);
  },

  /**
   * Create a new campaign
   */
  createCampaign: async (data: CreateCampaignData): Promise<Campaign> => {
    return apiClient.post<Campaign>(CAMPAIGNS_ENDPOINT, data);
  },

  /**
   * Update campaign
   */
  updateCampaign: async (id: string, data: UpdateCampaignData): Promise<Campaign> => {
    return apiClient.patch<Campaign>(`${CAMPAIGNS_ENDPOINT}/${id}`, data);
  },

  /**
   * Delete campaign
   */
  deleteCampaign: async (id: string): Promise<{ success: boolean }> => {
    return apiClient.delete<{ success: boolean }>(`${CAMPAIGNS_ENDPOINT}/${id}`);
  },

  /**
   * Send campaign immediately
   */
  sendCampaign: async (id: string): Promise<Campaign> => {
    return apiClient.post<Campaign>(`${CAMPAIGNS_ENDPOINT}/${id}/send`);
  },

  /**
   * Schedule campaign
   */
  scheduleCampaign: async (id: string, scheduledAt: string): Promise<Campaign> => {
    return apiClient.post<Campaign>(`${CAMPAIGNS_ENDPOINT}/${id}/schedule`, { scheduledAt });
  },

  /**
   * Pause campaign
   */
  pauseCampaign: async (id: string): Promise<Campaign> => {
    return apiClient.post<Campaign>(`${CAMPAIGNS_ENDPOINT}/${id}/pause`);
  },

  /**
   * Resume campaign
   */
  resumeCampaign: async (id: string): Promise<Campaign> => {
    return apiClient.post<Campaign>(`${CAMPAIGNS_ENDPOINT}/${id}/resume`);
  },

  /**
   * Cancel scheduled campaign
   */
  cancelCampaign: async (id: string): Promise<Campaign> => {
    return apiClient.post<Campaign>(`${CAMPAIGNS_ENDPOINT}/${id}/cancel`);
  },

  /**
   * Duplicate campaign
   */
  duplicateCampaign: async (id: string): Promise<Campaign> => {
    return apiClient.post<Campaign>(`${CAMPAIGNS_ENDPOINT}/${id}/duplicate`);
  },

  /**
   * Send test message
   */
  sendTestMessage: async (id: string, data: SendTestMessageData): Promise<{ success: boolean }> => {
    return apiClient.post<{ success: boolean }>(`${CAMPAIGNS_ENDPOINT}/${id}/test`, data);
  },

  /**
   * Get campaign statistics
   */
  getStats: async (businessId?: string): Promise<CampaignStats> => {
    return apiClient.get<CampaignStats>(
      `${CAMPAIGNS_ENDPOINT}/stats`,
      businessId ? { businessId } : {}
    );
  },

  /**
   * Get campaign recipients count (preview)
   */
  getRecipientsCount: async (data: {
    targetTags?: string[];
    excludeTags?: string[];
  }): Promise<{ count: number }> => {
    return apiClient.post<{ count: number }>(`${CAMPAIGNS_ENDPOINT}/recipients-count`, data);
  },

  /**
   * Get campaign analytics
   */
  getAnalytics: async (
    id: string,
    startDate?: string,
    endDate?: string
  ): Promise<{
    deliveryRate: number;
    readRate: number;
    responseRate: number;
    optOutRate: number;
    hourlyStats: Array<{ hour: string; sent: number; delivered: number }>;
  }> => {
    const params: Record<string, string> = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    return apiClient.get(`${CAMPAIGNS_ENDPOINT}/${id}/analytics`, params as any);
  },
};

export default campaignService;
