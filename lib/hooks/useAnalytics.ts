import { useQuery } from '@tanstack/react-query';

// Types
interface AnalyticsDataPoint {
  date: string;
  count: number;
}

interface BaseAnalyticsResponse {
  data: AnalyticsDataPoint[];
}

interface SearchQueriesWithParamsDataPoint extends AnalyticsDataPoint {
  search_tools: { [key: string]: number };
  tcgs: { [key: string]: number };
}

interface SearchQueriesWithParamsResponse {
  data: SearchQueriesWithParamsDataPoint[];
  totalSearches: number;
  previousPeriodSearches?: number;
  percentageChange?: number;
  averageDailySearches: number;
}

interface PopularClickedCardsDataPoint extends AnalyticsDataPoint {
  cardName: string;
  tcg: string;
  count: number;
}

interface PopularClickedCardsResponse {
  [key: string]: { cardName: string; count: number; averagePrice: number }[];
}

interface PopularClickedSetsDataPoint extends AnalyticsDataPoint {
  setName: string;
  tcg: string;
  count: number;
}

interface PopularClickedSetsResponse {
  [key: string]: { setName: string; count: number }[];
}

interface BuyClicksWithParamsDataPoint extends AnalyticsDataPoint {
  tcgs: { [key: string]: number };
}

interface BuyClicksWithParamsResponse {
  data: BuyClicksWithParamsDataPoint[];
  totalBuyClicks: number;
  previousPeriodBuyClicks?: number;
  percentageChange?: number;
  averageDailyBuyClicks: number;
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

// Helper function to normalize date to midnight UTC
const normalizeDateForCache = (date: Date): string => {
  const normalizedDate = new Date(date);
  normalizedDate.setUTCHours(0, 0, 0, 0);
  return normalizedDate.toISOString();
};

// Query keys
const analyticsKeys = {
  all: ['analytics'] as const,
  uniqueUsers: (days: number) =>
    [...analyticsKeys.all, 'uniqueUsers', days] as const,
  uniqueUsersByDate: (startDate: Date, endDate: Date) =>
    [
      ...analyticsKeys.all,
      'uniqueUsers',
      normalizeDateForCache(startDate),
      normalizeDateForCache(endDate)
    ] as const,
  searchQueries: (days: number) =>
    [...analyticsKeys.all, 'searchQueries', days] as const,
  searchQueriesWithParams: (startDate: Date, endDate: Date) =>
    [
      ...analyticsKeys.all,
      'searchQueriesWithParams',
      normalizeDateForCache(startDate),
      normalizeDateForCache(endDate)
    ] as const,
  buyClicks: (days: number) =>
    [...analyticsKeys.all, 'buyClicks', days] as const,
  buyClicksWithParams: (startDate: Date, endDate: Date) =>
    [
      ...analyticsKeys.all,
      'buyClicksWithParams',
      normalizeDateForCache(startDate),
      normalizeDateForCache(endDate)
    ] as const,
  usersByDevice: (startDate: Date, endDate: Date) =>
    [
      ...analyticsKeys.all,
      'usersByDevice',
      normalizeDateForCache(startDate),
      normalizeDateForCache(endDate)
    ] as const,
  engagementTime: (startDate: Date, endDate: Date) =>
    [
      ...analyticsKeys.all,
      'engagementTime',
      normalizeDateForCache(startDate),
      normalizeDateForCache(endDate)
    ] as const,
  cityAnalytics: (startDate: Date, endDate: Date) =>
    [
      ...analyticsKeys.all,
      'cityAnalytics',
      normalizeDateForCache(startDate),
      normalizeDateForCache(endDate)
    ] as const,
  userTypes: (startDate: Date, endDate: Date) =>
    [
      ...analyticsKeys.all,
      'userTypes',
      normalizeDateForCache(startDate),
      normalizeDateForCache(endDate)
    ] as const,
  trafficSources: (startDate: Date, endDate: Date) =>
    [
      ...analyticsKeys.all,
      'trafficSources',
      normalizeDateForCache(startDate),
      normalizeDateForCache(endDate)
    ] as const,
  userRetention: (startDate: Date, endDate: Date) =>
    [
      ...analyticsKeys.all,
      'userRetention',
      normalizeDateForCache(startDate),
      normalizeDateForCache(endDate)
    ] as const,
  popularClickedCards: (startDate: Date, endDate: Date) =>
    [
      ...analyticsKeys.all,
      'popularClickedCards',
      normalizeDateForCache(startDate),
      normalizeDateForCache(endDate)
    ] as const,
  popularClickedSets: (startDate: Date, endDate: Date) =>
    [
      ...analyticsKeys.all,
      'popularClickedSets',
      normalizeDateForCache(startDate),
      normalizeDateForCache(endDate)
    ] as const
};

// Fetch function
async function fetchAnalytics<T>(
  endpoint: string,
  params: Record<string, string>
): Promise<T> {
  const searchParams = new URLSearchParams(params);
  const response = await fetch(`/api/analytics/${endpoint}?${searchParams}`);

  if (!response.ok) {
    const error: AnalyticsError = {
      message: 'Failed to fetch analytics data',
      status: response.status
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
  retryDelay: (attemptIndex: number) =>
    Math.min(1000 * 2 ** attemptIndex, 30000),
  refetchOnMount: false, // Don't refetch when component mounts if data is fresh
  refetchOnWindowFocus: false, // Don't refetch when window regains focus if data is fresh
  refetchOnReconnect: false // Don't refetch when reconnecting if data is fresh
};

export type UniqueUsersQueryResult = ReturnType<typeof useUniqueUsers>;
export type SearchQueriesQueryResult = ReturnType<typeof useSearchQueries>;
export type BuyClicksQueryResult = ReturnType<typeof useBuyClicks>;
export type SearchQueriesWithParamsQueryResult = ReturnType<
  typeof useSearchQueriesWithParams
>;
export type BuyClicksWithParamsQueryResult = ReturnType<
  typeof useBuyClicksWithParams
>;
export type PopularClickedCardsQueryResult = ReturnType<
  typeof usePopularClickedCards
>;
export type PopularClickedSetsQueryResult = ReturnType<
  typeof usePopularClickedSets
>;

export function useUniqueUsers(numberOfDays: number = 30) {
  return useQuery<UniqueUsersResponse, AnalyticsError>({
    queryKey: analyticsKeys.uniqueUsers(numberOfDays),
    queryFn: () =>
      fetchAnalytics<UniqueUsersResponse>('unique-users', {
        numberOfDays: numberOfDays.toString(),
        sum: 'true'
      }),
    ...defaultQueryConfig
  });
}

export function useSearchQueries(numberOfDays: number = 30) {
  return useQuery<SearchQueriesResponse, AnalyticsError>({
    queryKey: analyticsKeys.searchQueries(numberOfDays),
    queryFn: () =>
      fetchAnalytics<SearchQueriesResponse>('search-queries', {
        numberOfDays: numberOfDays.toString(),
        sum: 'true'
      }),
    ...defaultQueryConfig
  });
}

export function useBuyClicks(numberOfDays: number = 30) {
  return useQuery<BuyClicksResponse, AnalyticsError>({
    queryKey: analyticsKeys.buyClicks(numberOfDays),
    queryFn: () =>
      fetchAnalytics<BuyClicksResponse>('buy-clicks', {
        numberOfDays: numberOfDays.toString(),
        sum: 'true'
      }),
    ...defaultQueryConfig
  });
}

export function useBuyClicksWithParams(startDate: Date, endDate: Date) {
  return useQuery<BuyClicksWithParamsResponse, AnalyticsError>({
    queryKey: analyticsKeys.buyClicksWithParams(startDate, endDate),
    queryFn: () =>
      fetchAnalytics<BuyClicksWithParamsResponse>('buy-clicks-with-params', {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }),
    ...defaultQueryConfig
  });
}

export function useVendorBuyClicks(
  numberOfDaysOrStartDate: number | Date = 30,
  endDate?: Date,
  limit?: number
) {
  const isDateRange = typeof numberOfDaysOrStartDate !== 'number';
  const numberOfDays = isDateRange ? undefined : numberOfDaysOrStartDate;
  const startDate = isDateRange ? numberOfDaysOrStartDate : undefined;

  return useQuery<VendorBuyClicksResponse, AnalyticsError>({
    queryKey: isDateRange
      ? [
          'vendorBuyClicks',
          'dateRange',
          startDate?.toISOString(),
          endDate?.toISOString()
        ]
      : ['vendorBuyClicks', 'days', numberOfDays],
    queryFn: async () => {
      const url = '/api/analytics/vendor-buy-clicks';
      const params = new URLSearchParams();

      if (isDateRange && startDate && endDate) {
        params.append('startDate', startDate.toISOString());
        params.append('endDate', endDate.toISOString());
      } else if (numberOfDays) {
        params.append('numberOfDays', numberOfDays.toString());
      }

      // Add parameter to not limit results
      params.append('limit', limit?.toString() || '5'); // 0 means no limit

      const response = await fetch(`${url}?${params.toString()}`);
      if (!response.ok) {
        throw {
          message: 'Failed to fetch vendor buy clicks',
          status: response.status
        };
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
}

export function useVendorLeaderboard(
  numberOfDaysOrStartDate: number | Date = 30,
  endDate?: Date,
  limit?: number
) {
  const isDateRange = typeof numberOfDaysOrStartDate !== 'number';
  const numberOfDays = isDateRange ? undefined : numberOfDaysOrStartDate;
  const startDate = isDateRange ? numberOfDaysOrStartDate : undefined;

  return useQuery<VendorBuyClicksResponse, AnalyticsError>({
    queryKey: isDateRange
      ? [
          'vendorLeaderboard',
          'dateRange',
          startDate?.toISOString(),
          endDate?.toISOString()
        ]
      : ['vendorLeaderboard', 'days', numberOfDays],
    queryFn: async () => {
      const url = '/api/analytics/vendor-buy-clicks';
      const params = new URLSearchParams();

      if (isDateRange && startDate && endDate) {
        params.append('startDate', startDate.toISOString());
        params.append('endDate', endDate.toISOString());
      } else if (numberOfDays) {
        params.append('numberOfDays', numberOfDays.toString());
      }

      // Add parameter to not limit results
      params.append('limit', limit?.toString() || '5'); // 0 means no limit

      const response = await fetch(`${url}?${params.toString()}`);
      if (!response.ok) {
        throw {
          message: 'Failed to fetch vendor buy clicks',
          status: response.status
        };
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
}

export function useUniqueUsersByDate(startDate: Date, endDate: Date) {
  return useQuery<UniqueUsersResponse, AnalyticsError>({
    queryKey: analyticsKeys.uniqueUsersByDate(startDate, endDate),
    queryFn: () =>
      fetchAnalytics<UniqueUsersResponse>('unique-users', {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }),
    ...defaultQueryConfig
  });
}

export function useUsersByDevice(startDate: Date, endDate: Date) {
  return useQuery<UsersByDeviceResponse, AnalyticsError>({
    queryKey: analyticsKeys.usersByDevice(startDate, endDate),
    queryFn: () =>
      fetchAnalytics<UsersByDeviceResponse>('users-by-device', {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }),
    ...defaultQueryConfig
  });
}

export function useEngagementTime(startDate: Date, endDate: Date) {
  return useQuery<EngagementTimeResponse, AnalyticsError>({
    queryKey: analyticsKeys.engagementTime(startDate, endDate),
    queryFn: () =>
      fetchAnalytics<EngagementTimeResponse>('engagement-time', {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }),
    ...defaultQueryConfig
  });
}

export function useCityAnalytics(startDate: Date, endDate: Date) {
  return useQuery<CityAnalyticsResponse, AnalyticsError>({
    queryKey: analyticsKeys.cityAnalytics(startDate, endDate),
    queryFn: () =>
      fetchAnalytics<CityAnalyticsResponse>('city-analytics', {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }),
    ...defaultQueryConfig
  });
}

export function useUserTypes(startDate: Date, endDate: Date) {
  return useQuery<UserTypesResponse, AnalyticsError>({
    queryKey: analyticsKeys.userTypes(startDate, endDate),
    queryFn: () =>
      fetchAnalytics<UserTypesResponse>('user-types', {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }),
    ...defaultQueryConfig
  });
}

export function useTrafficSources(startDate: Date, endDate: Date) {
  return useQuery<TrafficSourcesResponse, AnalyticsError>({
    queryKey: analyticsKeys.trafficSources(startDate, endDate),
    queryFn: () =>
      fetchAnalytics<TrafficSourcesResponse>('traffic-sources', {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }),
    ...defaultQueryConfig
  });
}

export function useUserRetention(startDate: Date, endDate: Date) {
  return useQuery<UserRetentionResponse, AnalyticsError>({
    queryKey: analyticsKeys.userRetention(startDate, endDate),
    queryFn: () =>
      fetchAnalytics<UserRetentionResponse>('user-retention', {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }),
    ...defaultQueryConfig
  });
}

export function useSearchQueriesWithParams(startDate: Date, endDate: Date) {
  return useQuery<SearchQueriesWithParamsResponse, AnalyticsError>({
    queryKey: analyticsKeys.searchQueriesWithParams(startDate, endDate),
    queryFn: () =>
      fetchAnalytics<SearchQueriesWithParamsResponse>(
        'search-queries-with-params',
        {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      ),
    ...defaultQueryConfig
  });
}

export function usePopularClickedCards(
  startDate: Date,
  endDate: Date,
  limit: number = 10
) {
  return useQuery<PopularClickedCardsResponse, AnalyticsError>({
    queryKey: analyticsKeys.popularClickedCards(startDate, endDate),
    queryFn: () =>
      fetchAnalytics<PopularClickedCardsResponse>('popular-clicked-cards', {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        limit: limit.toString()
      }),
    ...defaultQueryConfig
  });
}

export function usePopularClickedSets(
  startDate: Date,
  endDate: Date,
  limit: number = 10
) {
  return useQuery<PopularClickedSetsResponse, AnalyticsError>({
    queryKey: analyticsKeys.popularClickedSets(startDate, endDate),
    queryFn: () =>
      fetchAnalytics<PopularClickedSetsResponse>('popular-clicked-sets', {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        limit: limit.toString()
      }),
    ...defaultQueryConfig
  });
}

export type {
  AnalyticsError,
  UniqueUsersResponse,
  SearchQueriesResponse,
  SearchQueriesWithParamsResponse,
  BuyClicksResponse,
  EngagementTimeResponse,
  CityAnalyticsResponse,
  CityAnalytics,
  UserTypesResponse,
  UserType,
  TrafficSourcesResponse,
  TrafficSource,
  UserRetentionResponse,
  CohortData,
  RetentionDataPoint,
  PopularClickedCardsResponse,
  PopularClickedCardsDataPoint,
  PopularClickedSetsResponse,
  PopularClickedSetsDataPoint
};
