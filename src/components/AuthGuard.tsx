"use client";

import { ReactNode } from "react";

interface AuthGuardProps {
  children: ReactNode;
  /** If true, redirects authenticated users away (for login/signup pages) */
  redirectIfAuthenticated?: boolean;
  /** Where to redirect authenticated users (default: /portal) */
  redirectTo?: string;
}

export function AuthGuard({
  children,
}: AuthGuardProps) {
  // The middleware/proxy handles all auth redirects server-side
  // This component just renders children - no client-side redirect logic needed
  return <>{children}</>;
}
