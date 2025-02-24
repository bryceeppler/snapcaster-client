import { useQuery } from '@tanstack/react-query';

// Types
interface AnalyticsDataPoint {
  date: string;
  count: number;
}

interface BaseAnalyticsResponse {
  data: AnalyticsDataPoint[];
}

interface UniqueUsersResponse extends BaseAnalyticsResponse {
  totalUniqueUsers: number;
  previousPeriodUniqueUsers?: number;
  percentageChange?: number;
}

interface SearchQueriesResponse extends BaseAnalyticsResponse {
  totalSearches: number;
  previousPeriodSearches?: number;
  percentageChange?: number;
}

interface BuyClicksResponse extends BaseAnalyticsResponse {
  totalClicks: number;
  previousPeriodClicks?: number;
  percentageChange?: number;
}

// Error type
interface AnalyticsError {
  message: string;
  status?: number;
}

// Query keys
const analyticsKeys = {
  all: ['analytics'] as const,
  uniqueUsers: (days: number) => [...analyticsKeys.all, 'uniqueUsers', days] as const,
  searchQueries: (days: number) => [...analyticsKeys.all, 'searchQueries', days] as const,
  buyClicks: (days: number) => [...analyticsKeys.all, 'buyClicks', days] as const,
};

// Fetch function
async function fetchAnalytics<T>(endpoint: string, params: Record<string, string>): Promise<T> {
  const searchParams = new URLSearchParams(params);
  const response = await fetch(`/api/analytics/${endpoint}?${searchParams}`);
  
  if (!response.ok) {
    const error: AnalyticsError = {
      message: 'Failed to fetch analytics data',
      status: response.status,
    };
    throw error;
  }
  
  return response.json();
}

// Common query config
const defaultQueryConfig = {
  staleTime: 60 * 60 * 1000, // 1 hour - data is considered fresh for an hour
  cacheTime: 2 * 60 * 60 * 1000, // 2 hours - keep in cache for 2 hours
  retry: 2,
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  refetchOnMount: false, // Don't refetch when component mounts if data is fresh
  refetchOnWindowFocus: false, // Don't refetch when window regains focus if data is fresh
  refetchOnReconnect: false, // Don't refetch when reconnecting if data is fresh
};

export type UniqueUsersQueryResult = ReturnType<typeof useUniqueUsers>;
export type SearchQueriesQueryResult = ReturnType<typeof useSearchQueries>;
export type BuyClicksQueryResult = ReturnType<typeof useBuyClicks>;

export function useUniqueUsers(numberOfDays: number = 30) {
  return useQuery<UniqueUsersResponse, AnalyticsError>({
    queryKey: analyticsKeys.uniqueUsers(numberOfDays),
    queryFn: () => fetchAnalytics<UniqueUsersResponse>('unique-users', {
      numberOfDays: numberOfDays.toString(),
      sum: 'true'
    }),
    ...defaultQueryConfig,
  });
}

export function useSearchQueries(numberOfDays: number = 30) {
  return useQuery<SearchQueriesResponse, AnalyticsError>({
    queryKey: analyticsKeys.searchQueries(numberOfDays),
    queryFn: () => fetchAnalytics<SearchQueriesResponse>('search-queries', {
      numberOfDays: numberOfDays.toString(),
      sum: 'true'
    }),
    ...defaultQueryConfig,
  });
}

export function useBuyClicks(numberOfDays: number = 30) {
  return useQuery<BuyClicksResponse, AnalyticsError>({
    queryKey: analyticsKeys.buyClicks(numberOfDays),
    queryFn: () => fetchAnalytics<BuyClicksResponse>('buy-clicks', {
      numberOfDays: numberOfDays.toString(),
      sum: 'true'
    }),
    ...defaultQueryConfig,
  });
}

export type { AnalyticsError, UniqueUsersResponse, SearchQueriesResponse, BuyClicksResponse }; 