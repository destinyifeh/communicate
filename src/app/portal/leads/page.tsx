'use client';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import LeadCRM from '@/pages/portal/LeadCRM';
export default function Page() {
  return (
    <ProtectedRoute allowedRoles={['client']}>
      <LeadCRM />
    </ProtectedRoute>
  );
}
