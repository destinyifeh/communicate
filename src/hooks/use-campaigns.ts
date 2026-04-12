import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { campaignService, type CampaignQueryParams } from '@/services';
import { queryKeys } from '@/lib/query-client';
import type {
  CreateCampaignData,
  UpdateCampaignData,
  SendTestMessageData,
} from '@/types';

/**
 * Hook for fetching campaigns with pagination
 */
export function useCampaigns(params?: CampaignQueryParams) {
  return useQuery({
    queryKey: queryKeys.campaigns.list(params || {}),
    queryFn: () => campaignService.getCampaigns(params),
  });
}

/**
 * Hook for infinite scroll campaigns
 */
export function useInfiniteCampaigns(params?: Omit<CampaignQueryParams, 'page'>) {
  return useInfiniteQuery({
    queryKey: queryKeys.campaigns.list({ ...params, infinite: true }),
    queryFn: ({ pageParam = 1 }) =>
      campaignService.getCampaigns({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasMore ? lastPage.meta.page + 1 : undefined,
  });
}

/**
 * Hook for fetching a single campaign
 */
export function useCampaign(id: string) {
  return useQuery({
    queryKey: queryKeys.campaigns.detail(id),
    queryFn: () => campaignService.getCampaign(id),
    enabled: !!id,
  });
}

/**
 * Hook for campaign statistics
 */
export function useCampaignStats(businessId?: string) {
  return useQuery({
    queryKey: queryKeys.campaigns.stats(),
    queryFn: () => campaignService.getStats(businessId),
  });
}

/**
 * Hook for campaign analytics
 */
export function useCampaignAnalytics(
  id: string,
  startDate?: string,
  endDate?: string
) {
  return useQuery({
    queryKey: queryKeys.campaigns.analytics(id),
    queryFn: () => campaignService.getAnalytics(id, startDate, endDate),
    enabled: !!id,
  });
}

/**
 * Hook for campaign mutations
 */
export function useCampaignMutations() {
  const queryClient = useQueryClient();

  const createCampaign = useMutation({
    mutationFn: (data: CreateCampaignData) => campaignService.createCampaign(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.stats() });
    },
  });

  const updateCampaign = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCampaignData }) =>
      campaignService.updateCampaign(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.lists() });
    },
  });

  const deleteCampaign = useMutation({
    mutationFn: (id: string) => campaignService.deleteCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.stats() });
    },
  });

  const sendCampaign = useMutation({
    mutationFn: (id: string) => campaignService.sendCampaign(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.stats() });
    },
  });

  const scheduleCampaign = useMutation({
    mutationFn: ({ id, scheduledAt }: { id: string; scheduledAt: string }) =>
      campaignService.scheduleCampaign(id, scheduledAt),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.lists() });
    },
  });

  const pauseCampaign = useMutation({
    mutationFn: (id: string) => campaignService.pauseCampaign(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.lists() });
    },
  });

  const resumeCampaign = useMutation({
    mutationFn: (id: string) => campaignService.resumeCampaign(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.lists() });
    },
  });

  const cancelCampaign = useMutation({
    mutationFn: (id: string) => campaignService.cancelCampaign(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.lists() });
    },
  });

  const duplicateCampaign = useMutation({
    mutationFn: (id: string) => campaignService.duplicateCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.lists() });
    },
  });

  const sendTestMessage = useMutation({
    mutationFn: ({ id, data }: { id: string; data: SendTestMessageData }) =>
      campaignService.sendTestMessage(id, data),
  });

  const getRecipientsCount = useMutation({
    mutationFn: (data: { targetTags?: string[]; excludeTags?: string[] }) =>
      campaignService.getRecipientsCount(data),
  });

  return {
    createCampaign,
    updateCampaign,
    deleteCampaign,
    sendCampaign,
    scheduleCampaign,
    pauseCampaign,
    resumeCampaign,
    cancelCampaign,
    duplicateCampaign,
    sendTestMessage,
    getRecipientsCount,
  };
}
