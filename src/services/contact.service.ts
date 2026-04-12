import { apiClient, fetchPaginated } from './api-client';
import type { PaginatedResponse, QueryParams } from '@/types';
import type {
  Contact,
  CreateContactData,
  UpdateContactData,
  ContactFilters,
  ImportContactsData,
  ImportContactsResult,
} from '@/types/contact';

const CONTACTS_ENDPOINT = '/api/contacts';

export interface ContactQueryParams extends QueryParams, ContactFilters {
  businessId?: string;
}

export const contactService = {
  /**
   * Get contacts with pagination and filters
   */
  getContacts: async (params?: ContactQueryParams): Promise<PaginatedResponse<Contact>> => {
    return fetchPaginated<Contact>(CONTACTS_ENDPOINT, params);
  },

  /**
   * Get contact by ID
   */
  getContact: async (id: string): Promise<Contact> => {
    return apiClient.get<Contact>(`${CONTACTS_ENDPOINT}/${id}`);
  },

  /**
   * Create a new contact
   */
  createContact: async (data: CreateContactData): Promise<Contact> => {
    return apiClient.post<Contact>(CONTACTS_ENDPOINT, data);
  },

  /**
   * Update contact
   */
  updateContact: async (id: string, data: UpdateContactData): Promise<Contact> => {
    return apiClient.patch<Contact>(`${CONTACTS_ENDPOINT}/${id}`, data);
  },

  /**
   * Delete contact
   */
  deleteContact: async (id: string): Promise<{ success: boolean }> => {
    return apiClient.delete<{ success: boolean }>(`${CONTACTS_ENDPOINT}/${id}`);
  },

  /**
   * Import contacts in bulk
   */
  importContacts: async (data: ImportContactsData): Promise<ImportContactsResult> => {
    return apiClient.post<ImportContactsResult>(`${CONTACTS_ENDPOINT}/import`, data);
  },

  /**
   * Export contacts
   */
  exportContacts: async (params?: ContactQueryParams): Promise<Blob> => {
    const queryString = params
      ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
      : '';

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${CONTACTS_ENDPOINT}/export${queryString}`,
      { credentials: 'include' }
    );

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return response.blob();
  },

  /**
   * Add tags to contact
   */
  addTags: async (id: string, tags: string[]): Promise<Contact> => {
    return apiClient.post<Contact>(`${CONTACTS_ENDPOINT}/${id}/tags`, { tags });
  },

  /**
   * Remove tags from contact
   */
  removeTags: async (id: string, tags: string[]): Promise<Contact> => {
    return apiClient.delete<Contact>(`${CONTACTS_ENDPOINT}/${id}/tags`);
  },

  /**
   * Get all unique tags
   */
  getTags: async (): Promise<string[]> => {
    return apiClient.get<string[]>(`${CONTACTS_ENDPOINT}/tags`);
  },

  /**
   * Opt out contact from channel
   */
  optOut: async (
    id: string,
    channel: 'sms' | 'whatsapp' | 'email'
  ): Promise<Contact> => {
    return apiClient.post<Contact>(`${CONTACTS_ENDPOINT}/${id}/opt-out`, { channel });
  },

  /**
   * Opt in contact for channel
   */
  optIn: async (
    id: string,
    channel: 'sms' | 'whatsapp' | 'email'
  ): Promise<Contact> => {
    return apiClient.post<Contact>(`${CONTACTS_ENDPOINT}/${id}/opt-in`, { channel });
  },
};

export default contactService;
