'use client';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import ClientDashboard from '@/pages/portal/Dashboard';
export default function Page() {
  return (
    <ProtectedRoute allowedRoles={['client']}>
      <ClientDashboard />
    </ProtectedRoute>
  );
}
