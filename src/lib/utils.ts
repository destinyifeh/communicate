import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extract error message from various error types
 * Handles: strings, Error instances, API errors, nested response objects
 */
export function getErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;

  if (error && typeof error === 'object') {
    const e = error as Record<string, unknown>;

    // Direct message property
    if (typeof e.message === 'string') return e.message;

    // Error property (some APIs use this)
    if (typeof e.error === 'string') return e.error;

    // Nested response.data.message (axios-style)
    if (e.response && typeof e.response === 'object') {
      const resp = e.response as Record<string, unknown>;
      if (typeof resp.message === 'string') return resp.message;
      if (resp.data && typeof resp.data === 'object') {
        const data = resp.data as Record<string, unknown>;
        if (typeof data.message === 'string') return data.message;
        if (typeof data.error === 'string') return data.error;
      }
    }

    // data.message (some wrappers)
    if (e.data && typeof e.data === 'object') {
      const data = e.data as Record<string, unknown>;
      if (typeof data.message === 'string') return data.message;
    }
  }

  return fallback;
}
