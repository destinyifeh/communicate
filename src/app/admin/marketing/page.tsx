'use client';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import AdminMarketingOverview from '@/pages/admin/MarketingOverview';
export default function Page() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminMarketingOverview />
    </ProtectedRoute>
  );
}
