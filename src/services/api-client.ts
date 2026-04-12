import type { ApiError, PaginatedResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Custom error class for API errors
 */
export class ApiClientError extends Error {
  statusCode: number;
  code?: string;
  errors?: Record<string, string[]>;

  constructor(error: ApiError, statusCode = 500) {
    super(error.message);
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
    this.code = error.code;
    this.errors = error.errors;
  }
}

/**
 * Build query string from params object
 */
function buildQueryString(params?: Record<string, any>): string {
  if (!params) return '';

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Extract error message from API response
 */
function extractErrorMessage(data: unknown): string {
  if (data === null || data === undefined) {
    return 'Request failed';
  }

  if (typeof data === 'string') {
    return data;
  }

  if (typeof data !== 'object') {
    return 'Request failed';
  }

  const d = data as Record<string, unknown>;

  // Handle wrapped error format: { success: false, error: { message: string } }
  if (d.error && typeof d.error === 'object') {
    const errorObj = d.error as Record<string, unknown>;
    if (typeof errorObj.message === 'string') {
      return errorObj.message;
    }
  }

  // NestJS typically returns { message: string }
  if (typeof d.message === 'string') {
    return d.message;
  }

  // NestJS validation errors return message as array
  if (Array.isArray(d.message) && d.message.length > 0) {
    const firstMsg = d.message[0];
    return typeof firstMsg === 'string' ? firstMsg : 'Validation failed';
  }

  // error field as string (but not generic HTTP error names)
  if (typeof d.error === 'string') {
    if (!['Conflict', 'Bad Request', 'Not Found', 'Unauthorized', 'Internal Server Error'].includes(d.error)) {
      return d.error;
    }
  }

  return 'Request failed';
}

/**
 * Make an HTTP request
 */
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  };

  try {
    const response = await fetch(url, config);

    let data: any;
    try {
      data = await response.json();
    } catch {
      // Response is not JSON
      data = { message: response.statusText || 'Request failed' };
    }

    if (!response.ok) {
      throw new ApiClientError(
        {
          message: extractErrorMessage(data),
          code: typeof data?.code === 'string' ? data.code : undefined,
          errors: data?.errors,
        },
        response.status
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }

    // Log unexpected errors for debugging
    console.error('Unexpected API error:', error);

    throw new ApiClientError({
      message: error instanceof Error ? error.message : 'Network error',
      code: 'NETWORK_ERROR',
    });
  }
}

/**
 * API client with HTTP methods
 */
export const apiClient = {
  get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    return request<T>(`${endpoint}${buildQueryString(params)}`);
  },

  post<T>(endpoint: string, body?: any): Promise<T> {
    return request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  put<T>(endpoint: string, body?: any): Promise<T> {
    return request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  patch<T>(endpoint: string, body?: any): Promise<T> {
    return request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  delete<T>(endpoint: string): Promise<T> {
    return request<T>(endpoint, { method: 'DELETE' });
  },
};

/**
 * Fetch paginated data
 */
export function fetchPaginated<T>(
  endpoint: string,
  params?: Record<string, any>
): Promise<PaginatedResponse<T>> {
  return apiClient.get<PaginatedResponse<T>>(endpoint, params);
}

export default apiClient;
