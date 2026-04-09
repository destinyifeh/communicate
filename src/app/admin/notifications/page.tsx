'use client';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import AdminNotifications from '@/pages/admin/Notifications';
export default function Page() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminNotifications />
    </ProtectedRoute>
  );
}
