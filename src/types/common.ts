// Common types used across the application

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

/**
 * API error structure
 */
export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

/**
 * Standard pagination params
 */
export interface QueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  startDate?: string;
  endDate?: string;
}
