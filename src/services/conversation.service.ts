import { apiClient, fetchPaginated } from './api-client';
import type { PaginatedResponse, QueryParams } from '@/types';
import type {
  Conversation,
  Message,
  ConversationFilters,
  SendMessageData,
  EscalateConversationData,
  AssignAgentData,
} from '@/types/conversation';

const CONVERSATIONS_ENDPOINT = '/api/conversations';

/** Query params for fetching conversations */
export interface ConversationQueryParams extends QueryParams, ConversationFilters {
  businessId?: string;
}

export const conversationService = {
  /**
   * Get conversations with pagination and filters
   */
  getConversations: async (
    params?: ConversationQueryParams
  ): Promise<PaginatedResponse<Conversation>> => {
    return fetchPaginated<Conversation>(CONVERSATIONS_ENDPOINT, params);
  },

  /**
   * Get conversation by ID with messages
   */
  getConversation: async (id: string): Promise<Conversation> => {
    return apiClient.get<Conversation>(`${CONVERSATIONS_ENDPOINT}/${id}`);
  },

  /**
   * Get messages for a conversation
   */
  getMessages: async (
    conversationId: string,
    params?: QueryParams
  ): Promise<PaginatedResponse<Message>> => {
    return fetchPaginated<Message>(
      `${CONVERSATIONS_ENDPOINT}/${conversationId}/messages`,
      params
    );
  },

  /**
   * Send a message in a conversation
   */
  sendMessage: async (conversationId: string, data: SendMessageData): Promise<Message> => {
    return apiClient.post<Message>(
      `${CONVERSATIONS_ENDPOINT}/${conversationId}/messages`,
      data
    );
  },

  /**
   * Start a new conversation
   */
  startConversation: async (data: {
    contactId: string;
    channel: string;
    message: string;
  }): Promise<Conversation> => {
    return apiClient.post<Conversation>(CONVERSATIONS_ENDPOINT, data);
  },

  /**
   * Close a conversation
   */
  closeConversation: async (id: string): Promise<Conversation> => {
    return apiClient.post<Conversation>(`${CONVERSATIONS_ENDPOINT}/${id}/close`);
  },

  /**
   * Reopen a conversation
   */
  reopenConversation: async (id: string): Promise<Conversation> => {
    return apiClient.post<Conversation>(`${CONVERSATIONS_ENDPOINT}/${id}/reopen`);
  },

  /**
   * Escalate conversation to agent
   */
  escalateConversation: async (
    id: string,
    data: EscalateConversationData
  ): Promise<Conversation> => {
    return apiClient.post<Conversation>(`${CONVERSATIONS_ENDPOINT}/${id}/escalate`, data);
  },

  /**
   * Assign agent to conversation
   */
  assignAgent: async (id: string, data: AssignAgentData): Promise<Conversation> => {
    return apiClient.post<Conversation>(`${CONVERSATIONS_ENDPOINT}/${id}/assign`, data);
  },

  /**
   * Unassign agent from conversation
   */
  unassignAgent: async (id: string): Promise<Conversation> => {
    return apiClient.post<Conversation>(`${CONVERSATIONS_ENDPOINT}/${id}/unassign`);
  },

  /**
   * Toggle star on conversation
   */
  toggleStar: async (id: string): Promise<Conversation> => {
    return apiClient.post<Conversation>(`${CONVERSATIONS_ENDPOINT}/${id}/star`);
  },

  /**
   * Mark conversation as read
   */
  markAsRead: async (id: string): Promise<Conversation> => {
    return apiClient.post<Conversation>(`${CONVERSATIONS_ENDPOINT}/${id}/read`);
  },

  /**
   * Get conversation statistics
   */
  getStats: async (businessId?: string): Promise<{
    total: number;
    botHandled: number;
    escalated: number;
    agentActive: number;
    closed: number;
    unread: number;
  }> => {
    return apiClient.get(`${CONVERSATIONS_ENDPOINT}/stats`, businessId ? { businessId } : {});
  },
};

export default conversationService;
