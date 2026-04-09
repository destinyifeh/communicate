'use client';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import AdminDashboard from '@/pages/admin/Dashboard';
export default function Page() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminDashboard />
    </ProtectedRoute>
  );
}
