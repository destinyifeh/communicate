import { useEffect, useRef, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import type { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';
import type { PaginatedResponse } from '@/types';

interface UseInfiniteScrollOptions {
  /** Threshold for triggering next page load (0-1) */
  threshold?: number;
  /** Root margin for intersection observer */
  rootMargin?: string;
  /** Whether to enable the infinite scroll behavior */
  enabled?: boolean;
}

interface UseInfiniteScrollReturn<T> {
  /** Ref to attach to the sentinel element */
  ref: (node?: Element | null) => void;
  /** Whether the sentinel is in view */
  inView: boolean;
  /** Flattened data from all pages */
  items: T[];
  /** Total count from the last page meta */
  totalCount: number;
  /** Whether there are more pages to load */
  hasMore: boolean;
  /** Whether currently fetching next page */
  isFetchingNextPage: boolean;
  /** Whether the initial load is in progress */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Function to manually fetch next page */
  fetchNextPage: () => void;
}

/**
 * Custom hook for implementing infinite scroll with TanStack Query
 *
 * @example
 * ```tsx
 * function ContactList() {
 *   const infiniteQuery = useInfiniteContacts({ search: 'john' });
 *   const { ref, items, hasMore, isFetchingNextPage } = useInfiniteScroll(infiniteQuery);
 *
 *   return (
 *     <div>
 *       {items.map(contact => (
 *         <ContactCard key={contact.id} contact={contact} />
 *       ))}
 *       {hasMore && (
 *         <div ref={ref}>
 *           {isFetchingNextPage ? <Spinner /> : 'Load more'}
 *         </div>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useInfiniteScroll<T>(
  query: UseInfiniteQueryResult<InfiniteData<PaginatedResponse<T>>, Error>,
  options: UseInfiniteScrollOptions = {}
): UseInfiniteScrollReturn<T> {
  const { threshold = 0.1, rootMargin = '100px', enabled = true } = options;

  const { ref, inView } = useInView({
    threshold,
    rootMargin,
    skip: !enabled,
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = query;

  // Trigger fetch when sentinel comes into view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && enabled) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage, enabled]);

  // Flatten pages into single array
  const items = data?.pages.flatMap((page) => page.data) ?? [];

  // Get total count from last page
  const lastPage = data?.pages[data.pages.length - 1];
  const totalCount = lastPage?.meta.total ?? 0;

  return {
    ref,
    inView,
    items,
    totalCount,
    hasMore: hasNextPage ?? false,
    isFetchingNextPage,
    isLoading,
    error,
    fetchNextPage,
  };
}

/**
 * Hook for virtualized infinite scroll (for very large lists)
 * Uses a callback ref pattern for integration with react-window or react-virtual
 */
export function useVirtualInfiniteScroll<T>(
  query: UseInfiniteQueryResult<InfiniteData<PaginatedResponse<T>>, Error>,
  options: {
    /** Number of items to preload before reaching the end */
    overscan?: number;
  } = {}
): {
  items: T[];
  totalCount: number;
  isItemLoaded: (index: number) => boolean;
  loadMoreItems: (startIndex: number, stopIndex: number) => Promise<void>;
  hasMore: boolean;
  isLoading: boolean;
} {
  const { overscan = 10 } = options;
  const loadingRef = useRef(false);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = query;

  const items = data?.pages.flatMap((page) => page.data) ?? [];
  const lastPage = data?.pages[data.pages.length - 1];
  const totalCount = lastPage?.meta.total ?? 0;

  const isItemLoaded = useCallback(
    (index: number) => {
      return !hasNextPage || index < items.length;
    },
    [hasNextPage, items.length]
  );

  const loadMoreItems = useCallback(
    async (startIndex: number, stopIndex: number) => {
      if (loadingRef.current || !hasNextPage || isFetchingNextPage) {
        return;
      }

      // Check if we need to load more based on the stopIndex
      if (stopIndex >= items.length - overscan) {
        loadingRef.current = true;
        try {
          await fetchNextPage();
        } finally {
          loadingRef.current = false;
        }
      }
    },
    [hasNextPage, isFetchingNextPage, items.length, overscan, fetchNextPage]
  );

  return {
    items,
    totalCount,
    isItemLoaded,
    loadMoreItems,
    hasMore: hasNextPage ?? false,
    isLoading,
  };
}

/**
 * Simple hook for manual "Load More" button pattern
 */
export function useLoadMore<T>(
  query: UseInfiniteQueryResult<InfiniteData<PaginatedResponse<T>>, Error>
) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } =
    query;

  const items = data?.pages.flatMap((page) => page.data) ?? [];
  const lastPage = data?.pages[data.pages.length - 1];
  const totalCount = lastPage?.meta.total ?? 0;
  const loadedCount = items.length;

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    items,
    totalCount,
    loadedCount,
    hasMore: hasNextPage ?? false,
    isFetchingNextPage,
    isLoading,
    error,
    loadMore,
    /** Progress as percentage (0-100) */
    progress: totalCount > 0 ? Math.round((loadedCount / totalCount) * 100) : 0,
  };
}
