import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { catalogService, BuylistAnalytics } from '@/services/catalogService';
export const QUERY_KEY = 'buylistAnalytics';

const fetchBuylistAnalytics = async (
  vendorId: string,
  role: string
): Promise<BuylistAnalytics[]> => {
  try {
    console.log('fetching buylist analytics', vendorId, 'role:', role);

    // Use different endpoint for ADMIN users
    if (role === 'ADMIN') {
      const response = await catalogService.getAdminBuylistAnalytics();
      return response;
    } else {
      const response = await catalogService.getBuylistAnalytics(vendorId);
      return [response];
    }
  } catch (error) {
    console.error('Error fetching buylist analytics:', error);
    throw error;
  }
};

export const useBuylistAnalytics = (vendorId: string, role: string | null) => {
  // Check if role is valid before fetching
  const isRoleValid = role === 'ADMIN' || role === 'VENDOR';

  // Query for fetching buylist analytics
  const query = useQuery<BuylistAnalytics[]>({
    queryKey: [QUERY_KEY, vendorId, role],
    queryFn: () => fetchBuylistAnalytics(vendorId, role || 'VENDOR'),
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    // Disable the query if role is not yet determined
    enabled: isRoleValid && !!role
  });

  // Memoize and cache query results to prevent unnecessary filtering on window resize
  const cachedData = useMemo<BuylistAnalytics[] | undefined>(
    () => query.data,
    [query.data]
  );

  return {
    // Query data
    buylistAnalytics: cachedData,
    isLoading: query.isLoading,
    isError: query.isError,
    // Add new property to indicate if we're still waiting for role
    isRolePending: !isRoleValid
  };
};
