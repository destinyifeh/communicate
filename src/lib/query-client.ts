import { QueryClient } from '@tanstack/react-query';
import { ApiClientError } from '@/services/api-client';

/**
 * Create a new QueryClient with default options
 */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes
        retry: (failureCount, error) => {
          // Don't retry on 4xx errors
          if (error instanceof ApiClientError && error.statusCode < 500) {
            return false;
          }
          return failureCount < 3;
        },
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

/**
 * Query key factory for consistent cache key management
 *
 * Usage:
 *   queryKeys.contacts.list({ search: 'john' })
 *   queryKeys.contacts.detail('123')
 *   queryKeys.bookings.stats()
 */
export const queryKeys = {
  // Auth
  auth: {
    all: ['auth'],
    session: () => ['auth', 'session'],
    profile: () => ['auth', 'profile'],
  },

  // Users
  users: {
    all: ['users'],
    lists: () => ['users', 'list'],
    list: (filters: object) => ['users', 'list', filters],
    detail: (id: string) => ['users', 'detail', id],
  },

  // Business
  business: {
    all: ['business'],
    lists: () => ['business', 'list'],
    list: (filters: object) => ['business', 'list', filters],
    detail: (id: string) => ['business', 'detail', id],
    current: () => ['business', 'current'],
    features: (id: string) => ['business', id, 'features'],
    subscription: (id: string) => ['business', id, 'subscription'],
    stats: (id: string) => ['business', id, 'stats'],
  },

  // Contacts
  contacts: {
    all: ['contacts'],
    lists: () => ['contacts', 'list'],
    list: (filters: object) => ['contacts', 'list', filters],
    detail: (id: string) => ['contacts', 'detail', id],
    tags: () => ['contacts', 'tags'],
  },

  // Conversations
  conversations: {
    all: ['conversations'],
    lists: () => ['conversations', 'list'],
    list: (filters: object) => ['conversations', 'list', filters],
    detail: (id: string) => ['conversations', 'detail', id],
    messages: (conversationId: string) => ['conversations', conversationId, 'messages'],
    stats: () => ['conversations', 'stats'],
  },

  // Bookings
  bookings: {
    all: ['bookings'],
    lists: () => ['bookings', 'list'],
    list: (filters: object) => ['bookings', 'list', filters],
    detail: (id: string) => ['bookings', 'detail', id],
    availability: (query: object) => ['bookings', 'availability', query],
    upcoming: () => ['bookings', 'upcoming'],
    stats: () => ['bookings', 'stats'],
  },

  // Campaigns
  campaigns: {
    all: ['campaigns'],
    lists: () => ['campaigns', 'list'],
    list: (filters: object) => ['campaigns', 'list', filters],
    detail: (id: string) => ['campaigns', 'detail', id],
    analytics: (id: string) => ['campaigns', id, 'analytics'],
    stats: () => ['campaigns', 'stats'],
  },
};
