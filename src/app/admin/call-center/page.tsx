'use client';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import AdminCallCenterOverview from '@/pages/admin/CallCenterOverview';
export default function Page() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminCallCenterOverview />
    </ProtectedRoute>
  );
}
