'use client';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Contacts from '@/pages/portal/Contacts';

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={['client']}>
      <Contacts />
    </ProtectedRoute>
  );
}
