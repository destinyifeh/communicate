import { Suspense } from 'react';
import Signup from '@/pages/Signup';

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    }>
      <Signup />
    </Suspense>
  );
}
