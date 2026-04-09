'use client';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Notifications from '@/pages/portal/Notifications';
export default function Page() {
  return (
    <ProtectedRoute allowedRoles={['client']}>
      <Notifications />
    </ProtectedRoute>
  );
}
