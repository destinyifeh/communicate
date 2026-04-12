'use client';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Settings from '@/pages/portal/Settings';
export default function Page() {
  return (
    <ProtectedRoute allowedRoles={['client']}>
      <Settings />
    </ProtectedRoute>
  );
}
