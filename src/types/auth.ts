// Auth-related types

export type UserRole = 'admin' | 'client';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  businessName?: string;
  businessSlug?: string;
  businessLogo?: string;
  brandColor?: string;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
  businessName?: string;
  businessSlug?: string;
  features?: string[];
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export interface SignupResponse {
  user: User;
  accessToken: string;
  requiresVerification?: boolean;
}

export interface ProfileUpdateData {
  businessName?: string;
  businessSlug?: string;
  businessLogo?: string;
  brandColor?: string;
}
