'use client';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import AdminSettings from '@/pages/admin/Settings';
export default function Page() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminSettings />
    </ProtectedRoute>
  );
}
