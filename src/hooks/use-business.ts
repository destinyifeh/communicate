import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { businessService } from '@/services';
import { queryKeys } from '@/lib/query-client';
import type {
  CreateBusinessData,
  UpdateBusinessData,
  BusinessFeature,
  QueryParams,
} from '@/types';

/**
 * Hook for fetching all businesses (admin)
 */
export function useBusinesses(params?: QueryParams) {
  return useQuery({
    queryKey: queryKeys.business.list(params || {}),
    queryFn: () => businessService.getBusinesses(params),
  });
}

/**
 * Hook for fetching a single business
 */
export function useBusiness(id: string) {
  return useQuery({
    queryKey: queryKeys.business.detail(id),
    queryFn: () => businessService.getBusiness(id),
    enabled: !!id,
  });
}

/**
 * Hook for fetching current user's business
 */
export function useCurrentBusiness() {
  return useQuery({
    queryKey: queryKeys.business.current(),
    queryFn: () => businessService.getCurrentBusiness(),
  });
}

/**
 * Hook for business features
 */
export function useBusinessFeatures(businessId: string) {
  return useQuery({
    queryKey: queryKeys.business.features(businessId),
    queryFn: () => businessService.getFeatures(businessId),
    enabled: !!businessId,
  });
}

/**
 * Hook for business subscription
 */
export function useBusinessSubscription(businessId: string) {
  return useQuery({
    queryKey: queryKeys.business.subscription(businessId),
    queryFn: () => businessService.getSubscription(businessId),
    enabled: !!businessId,
  });
}

/**
 * Hook for business statistics
 */
export function useBusinessStats(businessId: string) {
  return useQuery({
    queryKey: queryKeys.business.stats(businessId),
    queryFn: () => businessService.getStats(businessId),
    enabled: !!businessId,
  });
}

/**
 * Hook for business mutations
 */
export function useBusinessMutations() {
  const queryClient = useQueryClient();

  const createBusiness = useMutation({
    mutationFn: (data: CreateBusinessData) => businessService.createBusiness(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.business.lists() });
    },
  });

  const updateBusiness = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBusinessData }) =>
      businessService.updateBusiness(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.business.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.business.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.business.current() });
    },
  });

  const deleteBusiness = useMutation({
    mutationFn: (id: string) => businessService.deleteBusiness(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.business.lists() });
    },
  });

  const updateFeature = useMutation({
    mutationFn: ({
      businessId,
      featureId,
      data,
    }: {
      businessId: string;
      featureId: string;
      data: Partial<BusinessFeature>;
    }) => businessService.updateFeature(businessId, featureId, data),
    onSuccess: (_, { businessId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.business.features(businessId),
      });
    },
  });

  const updateSubscription = useMutation({
    mutationFn: ({ businessId, plan }: { businessId: string; plan: string }) =>
      businessService.updateSubscription(businessId, plan),
    onSuccess: (_, { businessId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.business.subscription(businessId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.business.detail(businessId),
      });
    },
  });

  return {
    createBusiness,
    updateBusiness,
    deleteBusiness,
    updateFeature,
    updateSubscription,
  };
}
