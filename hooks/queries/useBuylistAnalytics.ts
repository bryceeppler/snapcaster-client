import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { catalogService, BuylistAnalytics } from '@/services/catalogService';
export const QUERY_KEY = 'buylistAnalytics';

const fetchBuylistAnalytics = async (
  vendorId: string
): Promise<BuylistAnalytics> => {
  try {
    console.log('fetching buylist analytics', vendorId);
    const response = await catalogService.getBuylistAnalytics(vendorId);
    return response;
  } catch (error) {
    console.error('Error fetching buylist analytics:', error);
    throw error;
  }
};

export const useBuylistAnalytics = (vendorId: string) => {
  // Query for fetching buylist analytics
  const query = useQuery({
    queryKey: [QUERY_KEY, vendorId],
    queryFn: () => fetchBuylistAnalytics(vendorId),
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false
  });

  // Memoize and cache query results to prevent unnecessary filtering on window resize
  const cachedData = useMemo<BuylistAnalytics | undefined>(
    () => query.data,
    [query.data]
  );

  return {
    // Query data
    buylistAnalytics: cachedData,
    isLoading: query.isLoading,
    isError: query.isError
  };
};
