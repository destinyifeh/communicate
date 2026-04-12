import { apiClient } from './api-client';
import type {
  User,
  LoginCredentials,
  SignupData,
  LoginResponse,
  SignupResponse,
  ProfileUpdateData,
} from '@/types';

const AUTH_ENDPOINT = '/api/auth';

export const authService = {
  /**
   * Login with email and password
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>(`${AUTH_ENDPOINT}/login`, credentials);
  },

  /**
   * Sign up a new user
   */
  signup: async (data: SignupData): Promise<SignupResponse> => {
    return apiClient.post<SignupResponse>(`${AUTH_ENDPOINT}/signup`, data);
  },

  /**
   * Logout current user
   */
  logout: async (): Promise<{ success: boolean }> => {
    return apiClient.post<{ success: boolean }>(`${AUTH_ENDPOINT}/logout`);
  },

  /**
   * Get current session
   */
  getSession: async (): Promise<{ user: User | null }> => {
    return apiClient.get<{ user: User | null }>(`${AUTH_ENDPOINT}/session`);
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<User> => {
    return apiClient.get<User>(`${AUTH_ENDPOINT}/me`);
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: ProfileUpdateData): Promise<{ user: User }> => {
    return apiClient.patch<{ user: User }>(`${AUTH_ENDPOINT}/profile`, data);
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
    return apiClient.post<{ accessToken: string; refreshToken: string }>(
      `${AUTH_ENDPOINT}/refresh`,
      { refreshToken }
    );
  },

  /**
   * Request password reset
   */
  forgotPassword: async (email: string): Promise<{ success: boolean }> => {
    return apiClient.post<{ success: boolean }>(`${AUTH_ENDPOINT}/forgot-password`, { email });
  },

  /**
   * Reset password with token
   */
  resetPassword: async (email: string, token: string, password: string): Promise<{ success: boolean }> => {
    return apiClient.post<{ success: boolean }>(`${AUTH_ENDPOINT}/reset-password`, {
      email,
      token,
      password,
    });
  },

  /**
   * Change password (authenticated)
   */
  changePassword: async (currentPassword: string, newPassword: string): Promise<{ success: boolean }> => {
    return apiClient.post<{ success: boolean }>(`${AUTH_ENDPOINT}/change-password`, {
      currentPassword,
      newPassword,
    });
  },

  /**
   * Verify email with OTP code
   */
  verifyEmail: async (email: string, otp: string): Promise<{ success: boolean; message: string }> => {
    return apiClient.post<{ success: boolean; message: string }>(`${AUTH_ENDPOINT}/verify-email`, {
      email,
      otp,
    });
  },

  /**
   * Resend verification email
   */
  resendVerification: async (email: string): Promise<{ success: boolean; message: string }> => {
    return apiClient.post<{ success: boolean; message: string }>(`${AUTH_ENDPOINT}/resend-verification`, {
      email,
    });
  },
};

export default authService;
