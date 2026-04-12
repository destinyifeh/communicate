import { apiClient, fetchPaginated } from './api-client';
import type { PaginatedResponse, QueryParams } from '@/types';
import type { AdminUser, CreateUserData, UpdateUserData } from '@/types/user';

const USERS_ENDPOINT = '/api/users';

export const userService = {
  /**
   * Get all users (admin only)
   */
  getUsers: async (params?: QueryParams): Promise<PaginatedResponse<AdminUser>> => {
    return fetchPaginated<AdminUser>(USERS_ENDPOINT, params);
  },

  /**
   * Get user by ID
   */
  getUser: async (id: string): Promise<AdminUser> => {
    return apiClient.get<AdminUser>(`${USERS_ENDPOINT}/${id}`);
  },

  /**
   * Create a new user (admin only)
   */
  createUser: async (data: CreateUserData): Promise<AdminUser> => {
    return apiClient.post<AdminUser>(USERS_ENDPOINT, data);
  },

  /**
   * Update user
   */
  updateUser: async (id: string, data: UpdateUserData): Promise<AdminUser> => {
    return apiClient.patch<AdminUser>(`${USERS_ENDPOINT}/${id}`, data);
  },

  /**
   * Delete user (admin only)
   */
  deleteUser: async (id: string): Promise<{ success: boolean }> => {
    return apiClient.delete<{ success: boolean }>(`${USERS_ENDPOINT}/${id}`);
  },

  /**
   * Activate user
   */
  activateUser: async (id: string): Promise<AdminUser> => {
    return apiClient.post<AdminUser>(`${USERS_ENDPOINT}/${id}/activate`);
  },

  /**
   * Deactivate user
   */
  deactivateUser: async (id: string): Promise<AdminUser> => {
    return apiClient.post<AdminUser>(`${USERS_ENDPOINT}/${id}/deactivate`);
  },
};

export default userService;
