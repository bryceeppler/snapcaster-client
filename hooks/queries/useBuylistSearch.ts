import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'sonner';

import useBuylistStore from '@/stores/useBuylistStore';
import type { Tcg } from '@/types';
import axiosInstance from '@/utils/axiosWrapper';

interface SearchParams {
  tcg: Tcg;
  searchTerm: string;
  filters: any[];
  sortBy: any;
}

export interface TransformedSearchResponse {
  searchResults: any[];
  defaultSortBy: string | null;
  filterOptions: any[];
  numPages: number;
  numResults: number;
  nextPage: number | undefined;
  sortOptions: Record<string, string>;
}
const fetchBuylistProducts = async ({
  tcg,
  searchTerm,
  filters,
  sortBy,
  pageParam = 1
}: SearchParams & { pageParam?: number }): Promise<any> => {
  const queryParams = new URLSearchParams({
    mode: 'buylists',
    tcg: tcg,
    region: '',
    keyword: searchTerm,
    pageNumber: pageParam.toString(),
    maxResultsPerPage: '100'
  });

  if (sortBy) {
    queryParams.set('sortBy', `${sortBy}`);
  }

  if (filters && filters.length > 0) {
    filters.forEach((filter) => {
      if (filter.values) {
        filter.values.forEach((value: any) => {
          if (value.selected) {
            queryParams.append(
              `filterSelections[${filter.field}][]`,
              value.value
            );
          }
        });
      }
    });
  }

  try {
    const response = await axiosInstance.get(
      `${
        process.env.NEXT_PUBLIC_API_URL
      }/api/v1/catalog/search?${queryParams.toString()}`
    );

    if (response.status !== 200) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return response.data.data;
  } catch (error) {
    console.error('Error fetching cards:', error);
    if (error instanceof Error) {
      toast.error('Unable to fetch cards: ' + error.message);
    } else {
      toast.error('An unexpected error occurred while fetching cards');
    }
    throw error;
  }
};

export const useBuylistSearch = (
  searchParams: SearchParams,
  options?: { enabled?: boolean }
) => {
  const { setFilterOptions, setSortByOptions } = useBuylistStore();
  const queryClient = useQueryClient();

  const query = useInfiniteQuery({
    queryKey: ['buylistSearch'],
    queryFn: ({ pageParam = 1 }) =>
      fetchBuylistProducts({
        ...searchParams,
        pageParam
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return nextPage <= lastPage.pagination.numPages ? nextPage : undefined;
    },
    enabled: options?.enabled ?? true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,

    select: (data): TransformedSearchResponse => {
      const lastPage = data.pages[data.pages.length - 1];
      const allResults = data.pages.flatMap((page) => page.results);
      const defaultSortBy = data.pages[0].sorting.defaultSort;
      const sortOptionsMap = data.pages[0].sorting.Items.reduce(
        (acc: Record<string, string>, item: any) => ({
          ...acc,
          [item.value]: item.label
        }),
        {} as Record<string, string>
      );
      return {
        searchResults: allResults.map((item) => ({ ...item, promoted: false })),
        defaultSortBy: defaultSortBy,
        filterOptions: lastPage.filters || [],
        numPages: lastPage.pagination.numPages,
        numResults: lastPage.pagination.numResults,
        nextPage:
          data.pages.length + 1 <= lastPage.pagination.numPages
            ? data.pages.length + 1
            : undefined,
        sortOptions: sortOptionsMap
      };
    }
  });

  const refetchWithParams = () => {
    query.refetch();
  };

  const resetSearch = () => {
    queryClient.removeQueries({ queryKey: ['buylistSearch'] });
    query.refetch();
  };

  useEffect(() => {
    if (query.data?.filterOptions) {
      setFilterOptions(query.data.filterOptions);
    }
  }, [query.data?.filterOptions, setFilterOptions]);
  useEffect(() => {
    if (query.data?.sortOptions) {
      setSortByOptions(query.data.sortOptions);
    }
  }, [query.data?.sortOptions, setSortByOptions]);
  return {
    ...query,
    refetch: refetchWithParams,
    resetSearch,
    isLoading: query.isLoading || query.isFetching
  };
};
