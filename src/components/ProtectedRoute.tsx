'use client';

import { useAuth, UserRole } from '@/hooks';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    router.replace('/login');
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    router.replace(user.role === 'admin' ? '/admin' : '/portal');
    return null;
  }

  return <>{children}</>;
}
