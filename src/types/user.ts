// User-related types (for admin management)

export type AdminUserRole = 'ADMIN' | 'OWNER' | 'AGENT';

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: AdminUserRole;
  avatarUrl?: string;
  phone?: string;
  emailVerified: boolean;
  isActive: boolean;
  lastLoginAt?: string;
  currentBusinessId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: AdminUserRole;
  phone?: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  isActive?: boolean;
}
