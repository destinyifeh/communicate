import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { conversationService, type ConversationQueryParams } from '@/services';
import { queryKeys } from '@/lib/query-client';
import type {
  SendMessageData,
  EscalateConversationData,
  AssignAgentData,
} from '@/types';

/**
 * Hook for fetching conversations with pagination
 */
export function useConversations(params?: ConversationQueryParams) {
  return useQuery({
    queryKey: queryKeys.conversations.list(params || {}),
    queryFn: () => conversationService.getConversations(params),
  });
}

/**
 * Hook for infinite scroll conversations
 */
export function useInfiniteConversations(params?: Omit<ConversationQueryParams, 'page'>) {
  return useInfiniteQuery({
    queryKey: queryKeys.conversations.list({ ...params, infinite: true }),
    queryFn: ({ pageParam = 1 }) =>
      conversationService.getConversations({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasMore ? lastPage.meta.page + 1 : undefined,
  });
}

/**
 * Hook for fetching a single conversation
 */
export function useConversation(id: string) {
  return useQuery({
    queryKey: queryKeys.conversations.detail(id),
    queryFn: () => conversationService.getConversation(id),
    enabled: !!id,
  });
}

/**
 * Hook for fetching messages in a conversation
 */
export function useMessages(conversationId: string, params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: queryKeys.conversations.messages(conversationId),
    queryFn: () => conversationService.getMessages(conversationId, params),
    enabled: !!conversationId,
    refetchInterval: 5000, // Poll for new messages every 5 seconds
  });
}

/**
 * Hook for infinite scroll messages
 */
export function useInfiniteMessages(conversationId: string) {
  return useInfiniteQuery({
    queryKey: [...queryKeys.conversations.messages(conversationId), 'infinite'],
    queryFn: ({ pageParam = 1 }) =>
      conversationService.getMessages(conversationId, { page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasMore ? lastPage.meta.page + 1 : undefined,
    enabled: !!conversationId,
  });
}

/**
 * Hook for conversation statistics
 */
export function useConversationStats(businessId?: string) {
  return useQuery({
    queryKey: queryKeys.conversations.stats(),
    queryFn: () => conversationService.getStats(businessId),
  });
}

/**
 * Hook for conversation mutations
 */
export function useConversationMutations() {
  const queryClient = useQueryClient();

  const sendMessage = useMutation({
    mutationFn: ({
      conversationId,
      data,
    }: {
      conversationId: string;
      data: SendMessageData;
    }) => conversationService.sendMessage(conversationId, data),
    onSuccess: (_, { conversationId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.conversations.messages(conversationId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.conversations.detail(conversationId),
      });
    },
  });

  const startConversation = useMutation({
    mutationFn: (data: { contactId: string; channel: string; message: string }) =>
      conversationService.startConversation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations.lists() });
    },
  });

  const closeConversation = useMutation({
    mutationFn: (id: string) => conversationService.closeConversation(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations.stats() });
    },
  });

  const reopenConversation = useMutation({
    mutationFn: (id: string) => conversationService.reopenConversation(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations.stats() });
    },
  });

  const escalateConversation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: EscalateConversationData }) =>
      conversationService.escalateConversation(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations.stats() });
    },
  });

  const assignAgent = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AssignAgentData }) =>
      conversationService.assignAgent(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations.lists() });
    },
  });

  const unassignAgent = useMutation({
    mutationFn: (id: string) => conversationService.unassignAgent(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations.lists() });
    },
  });

  const toggleStar = useMutation({
    mutationFn: (id: string) => conversationService.toggleStar(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations.lists() });
    },
  });

  const markAsRead = useMutation({
    mutationFn: (id: string) => conversationService.markAsRead(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations.lists() });
    },
  });

  return {
    sendMessage,
    startConversation,
    closeConversation,
    reopenConversation,
    escalateConversation,
    assignAgent,
    unassignAgent,
    toggleStar,
    markAsRead,
  };
}
