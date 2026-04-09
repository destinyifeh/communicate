'use client';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import AutomationSettings from '@/pages/portal/AutomationSettings';
export default function Page() {
  return (
    <ProtectedRoute allowedRoles={['client']}>
      <AutomationSettings />
    </ProtectedRoute>
  );
}
