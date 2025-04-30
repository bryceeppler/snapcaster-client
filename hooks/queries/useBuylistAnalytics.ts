import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { catalogService, BuylistAnalytics } from '@/services/catalogService';
export const QUERY_KEY = 'buylistAnalytics';
export const SUBMISSIONS_QUERY_KEY = 'buylistSubmissions';

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

// Updated function to fetch buylist submissions with pagination parameters
const fetchBuylistSubmissions = async (
  page = 1,
  limit = 10,
  vendorSlug?: string,
  status?: string,
  startDate?: Date,
  endDate?: Date
) => {
  try {
    console.log(`Fetching submissions page ${page} with limit ${limit}`);
    const response = await catalogService.getBuylistSubmissions(
      page,
      limit,
      vendorSlug,
      status,
      startDate,
      endDate
    );
    return response;
  } catch (error) {
    console.error('Error fetching buylist submissions:', error);
    throw error;
  }
};

export const useBuylistAnalytics = (vendorId: string, role: string | null) => {
  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterVendorSlug, setFilterVendorSlug] = useState<string | undefined>(
    undefined
  );
  const [filterStatus, setFilterStatus] = useState<string | undefined>(
    undefined
  );
  const [filterStartDate, setFilterStartDate] = useState<Date | undefined>(
    undefined
  );
  const [filterEndDate, setFilterEndDate] = useState<Date | undefined>(
    undefined
  );

  // Check if role is valid before fetching
  const isRoleValid = role === 'ADMIN' || role === 'VENDOR';
  const isAdmin = role === 'ADMIN';

  // Query for fetching buylist analytics
  const analyticsQuery = useQuery({
    queryKey: [QUERY_KEY, vendorId, role],
    queryFn: () => fetchBuylistAnalytics(vendorId, role || 'VENDOR'),
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    // Disable the query if role is not yet determined
    enabled: isRoleValid && !!role
  });

  // Updated query for fetching buylist submissions with pagination and filters
  const submissionsQuery = useQuery({
    queryKey: [
      SUBMISSIONS_QUERY_KEY,
      page,
      pageSize,
      filterVendorSlug,
      filterStatus,
      filterStartDate,
      filterEndDate
    ],
    queryFn: () =>
      fetchBuylistSubmissions(
        page,
        pageSize,
        filterVendorSlug,
        filterStatus,
        filterStartDate,
        filterEndDate
      ),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: true, // Ensure we get fresh data when parameters change
    // Only enable if user is admin
    enabled: isAdmin && !!role
  });

  // Memoize and cache query results to prevent unnecessary filtering on window resize
  const cachedAnalyticsData = useMemo(
    () => analyticsQuery.data,
    [analyticsQuery.data]
  );

  // Memoize submissions data - but ensure proper dependents are listed to update when needed
  const cachedSubmissionsData = useMemo(
    () => submissionsQuery.data,
    [submissionsQuery.data, page, pageSize] // Add page, pageSize as dependencies to ensure updates
  );

  // Function to handle page change
  const handlePageChange = (newPage: number) => {
    // Only change if it's a valid page number
    if (
      newPage >= 1 &&
      (!cachedSubmissionsData ||
        newPage <= cachedSubmissionsData.pagination.totalPages)
    ) {
      console.log(`Changing page from ${page} to ${newPage}`);
      setPage(newPage);
    }
  };

  // Function to handle page size change
  const handlePageSizeChange = (newPageSize: number) => {
    console.log(`Changing page size from ${pageSize} to ${newPageSize}`);
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when changing page size
  };

  // Function to update filters
  const updateFilters = (
    vendorSlug?: string,
    status?: string,
    startDate?: Date,
    endDate?: Date
  ) => {
    setFilterVendorSlug(vendorSlug);
    setFilterStatus(status);
    setFilterStartDate(startDate);
    setFilterEndDate(endDate);
    setPage(1); // Reset to first page when filters change
  };

  return {
    // Analytics data
    buylistAnalytics: cachedAnalyticsData,
    isLoadingAnalytics: analyticsQuery.isLoading,
    isErrorAnalytics: analyticsQuery.isError,

    // Submissions data (only for admin)
    buylistSubmissions: cachedSubmissionsData,
    isLoadingSubmissions: submissionsQuery.isLoading,
    isErrorSubmissions: submissionsQuery.isError,

    // Pagination data and controls
    currentPage: page,
    pageSize: pageSize,
    handlePageChange,
    handlePageSizeChange,

    // Filters
    updateFilters,
    filterVendorSlug,
    filterStatus,
    filterStartDate,
    filterEndDate,

    // Add new property to indicate if we're still waiting for role
    isRolePending: !isRoleValid
  };
};
