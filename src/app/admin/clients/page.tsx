'use client';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import ClientManagement from '@/pages/admin/ClientManagement';
export default function Page() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <ClientManagement />
    </ProtectedRoute>
  );
}
