'use client';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import AdminBookings from '@/pages/admin/Bookings';
export default function Page() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminBookings />
    </ProtectedRoute>
  );
}
