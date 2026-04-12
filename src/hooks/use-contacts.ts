import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { contactService, type ContactQueryParams } from '@/services';
import { queryKeys } from '@/lib/query-client';
import type {
  Contact,
  CreateContactData,
  UpdateContactData,
  ImportContactsData,
} from '@/types';

/**
 * Hook for fetching contacts with pagination
 */
export function useContacts(params?: ContactQueryParams) {
  return useQuery({
    queryKey: queryKeys.contacts.list(params || {}),
    queryFn: () => contactService.getContacts(params),
  });
}

/**
 * Hook for infinite scroll contacts
 */
export function useInfiniteContacts(params?: Omit<ContactQueryParams, 'page'>) {
  return useInfiniteQuery({
    queryKey: queryKeys.contacts.list({ ...params, infinite: true }),
    queryFn: ({ pageParam = 1 }) =>
      contactService.getContacts({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasMore ? lastPage.meta.page + 1 : undefined,
  });
}

/**
 * Hook for fetching a single contact
 */
export function useContact(id: string) {
  return useQuery({
    queryKey: queryKeys.contacts.detail(id),
    queryFn: () => contactService.getContact(id),
    enabled: !!id,
  });
}

/**
 * Hook for contact tags
 */
export function useContactTags() {
  return useQuery({
    queryKey: queryKeys.contacts.tags(),
    queryFn: () => contactService.getTags(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook for contact mutations
 */
export function useContactMutations() {
  const queryClient = useQueryClient();

  const createContact = useMutation({
    mutationFn: (data: CreateContactData) => contactService.createContact(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.lists() });
    },
  });

  const updateContact = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateContactData }) =>
      contactService.updateContact(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.lists() });
    },
  });

  const deleteContact = useMutation({
    mutationFn: (id: string) => contactService.deleteContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.lists() });
    },
  });

  const importContacts = useMutation({
    mutationFn: (data: ImportContactsData) => contactService.importContacts(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.tags() });
    },
  });

  const addTags = useMutation({
    mutationFn: ({ id, tags }: { id: string; tags: string[] }) =>
      contactService.addTags(id, tags),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.tags() });
    },
  });

  const optOut = useMutation({
    mutationFn: ({ id, channel }: { id: string; channel: 'sms' | 'whatsapp' | 'email' }) =>
      contactService.optOut(id, channel),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.detail(id) });
    },
  });

  const optIn = useMutation({
    mutationFn: ({ id, channel }: { id: string; channel: 'sms' | 'whatsapp' | 'email' }) =>
      contactService.optIn(id, channel),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.detail(id) });
    },
  });

  return {
    createContact,
    updateContact,
    deleteContact,
    importContacts,
    addTags,
    optOut,
    optIn,
  };
}
