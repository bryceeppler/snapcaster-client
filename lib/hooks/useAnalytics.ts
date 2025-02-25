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
  averageDailyUsers: number;
}

interface EngagementTimeResponse {
  averageEngagementTime: number;
  previousPeriodAverageEngagementTime?: number;
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

export interface VendorBuyClickData {
  website: string;
  mtg: number;
  pokemon: number;
  yugioh: number;
  onepiece: number;
  lorcana: number;
  fleshandblood: number;
  starwars: number;
  total: number;
  rank: number;
}

export interface VendorBuyClicksResponse {
  data: VendorBuyClickData[];
  startDate: string;
  endDate: string;
}

export interface UsersByDeviceResponse {
  desktop: number;
  mobile: number;
  tablet: number;
}

interface CityAnalytics {
  city: string;
  users: number;
  percentage: number;
}

interface TrafficSource {
  source: string;
  users: number;
  percentage: number;
}

interface TrafficSourcesResponse {
  data: TrafficSource[];
  totalUsers: number;
}

interface UserType {
  type: string;
  users: number;
  percentage: number;
}

interface UserTypesResponse {
  data: UserType[];
  total: number;
}

interface CityAnalyticsResponse {
  data: CityAnalytics[];
  totalUsers: number;
}

interface RetentionDataPoint {
  month: number;
  users: number;
  percentage: number;
}

interface CohortData {
  cohort: string;
  initialUsers: number;
  retention: RetentionDataPoint[];
}

interface UserRetentionResponse {
  data: CohortData[];
  maxUsers: number;
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
  uniqueUsersByDate: (startDate: Date, endDate: Date) => 
    [...analyticsKeys.all, 'uniqueUsers', startDate.toISOString(), endDate.toISOString()] as const,
  searchQueries: (days: number) => [...analyticsKeys.all, 'searchQueries', days] as const,
  buyClicks: (days: number) => [...analyticsKeys.all, 'buyClicks', days] as const,
  usersByDevice: (startDate: Date, endDate: Date) =>
    [...analyticsKeys.all, 'usersByDevice', startDate.toISOString(), endDate.toISOString()] as const,
  engagementTime: (startDate: Date, endDate: Date) =>
    [...analyticsKeys.all, 'engagementTime', startDate.toISOString(), endDate.toISOString()] as const,
  cityAnalytics: (startDate: Date, endDate: Date) =>
    [...analyticsKeys.all, 'cityAnalytics', startDate.toISOString(), endDate.toISOString()] as const,
  userTypes: (startDate: Date, endDate: Date) =>
    [...analyticsKeys.all, 'userTypes', startDate.toISOString(), endDate.toISOString()] as const,
  trafficSources: (startDate: Date, endDate: Date) =>
    [...analyticsKeys.all, 'trafficSources', startDate.toISOString(), endDate.toISOString()] as const,
  userRetention: (startDate: Date, endDate: Date) =>
    [...analyticsKeys.all, 'userRetention', startDate.toISOString(), endDate.toISOString()] as const,
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

export function useVendorBuyClicks(numberOfDays: number = 30) {
  return useQuery<VendorBuyClicksResponse, AnalyticsError>({
    queryKey: ['vendorBuyClicks', numberOfDays],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/vendor-buy-clicks?numberOfDays=${numberOfDays}`);
      if (!response.ok) {
        throw {
          message: 'Failed to fetch vendor buy clicks',
          status: response.status,
        };
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUniqueUsersByDate(startDate: Date, endDate: Date) {
  return useQuery<UniqueUsersResponse, AnalyticsError>({
    queryKey: analyticsKeys.uniqueUsersByDate(startDate, endDate),
    queryFn: () => fetchAnalytics<UniqueUsersResponse>('unique-users', {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    }),
    ...defaultQueryConfig,
  });
}

export function useUsersByDevice(startDate: Date, endDate: Date) {
  return useQuery<UsersByDeviceResponse, AnalyticsError>({
    queryKey: analyticsKeys.usersByDevice(startDate, endDate),
    queryFn: () => fetchAnalytics<UsersByDeviceResponse>('users-by-device', {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    }),
    ...defaultQueryConfig,
  });
}

export function useEngagementTime(startDate: Date, endDate: Date) {
  return useQuery<EngagementTimeResponse, AnalyticsError>({
    queryKey: analyticsKeys.engagementTime(startDate, endDate),
    queryFn: () => fetchAnalytics<EngagementTimeResponse>('engagement-time', {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    }),
    ...defaultQueryConfig,
  });
}

export function useCityAnalytics(startDate: Date, endDate: Date) {
  return useQuery<CityAnalyticsResponse, AnalyticsError>({
    queryKey: analyticsKeys.cityAnalytics(startDate, endDate),
    queryFn: () => fetchAnalytics<CityAnalyticsResponse>('city-analytics', {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    }),
    ...defaultQueryConfig,
  });
}

export function useUserTypes(startDate: Date, endDate: Date) {
  return useQuery<UserTypesResponse, AnalyticsError>({
    queryKey: analyticsKeys.userTypes(startDate, endDate),
    queryFn: () => fetchAnalytics<UserTypesResponse>('user-types', {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    }),
    ...defaultQueryConfig,
  });
}

export function useTrafficSources(startDate: Date, endDate: Date) {
  return useQuery<TrafficSourcesResponse, AnalyticsError>({
    queryKey: analyticsKeys.trafficSources(startDate, endDate),
    queryFn: () => fetchAnalytics<TrafficSourcesResponse>('traffic-sources', {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    }),
    ...defaultQueryConfig,
  });
}

export function useUserRetention(startDate: Date, endDate: Date) {
  return useQuery<UserRetentionResponse, AnalyticsError>({
    queryKey: analyticsKeys.userRetention(startDate, endDate),
    queryFn: () => fetchAnalytics<UserRetentionResponse>('user-retention', {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    }),
    ...defaultQueryConfig,
  });
}

export type { AnalyticsError, UniqueUsersResponse, SearchQueriesResponse, BuyClicksResponse, EngagementTimeResponse, CityAnalyticsResponse, CityAnalytics, UserTypesResponse, UserType, TrafficSourcesResponse, TrafficSource, UserRetentionResponse, CohortData, RetentionDataPoint }; 