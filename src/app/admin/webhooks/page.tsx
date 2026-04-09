'use client';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import WebhookLogs from '@/pages/admin/WebhookLogs';
export default function Page() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <WebhookLogs />
    </ProtectedRoute>
  );
}
