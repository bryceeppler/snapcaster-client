import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { useProductSearchStore } from '@/stores/useProductSearchStore';
import type { Product } from '@/types';
import type { FilterOption, ProductSortOptions } from '@/types/query';
import axiosInstance from '@/utils/axiosWrapper';

interface SearchParams {
  searchTerm: string;
  selectedFilters: { field: string; value: string }[];
  sortBy: ProductSortOptions;
  region: string;
}

interface SearchResponse {
  results: Product[];
  promotedResults: Product[];
  filters: FilterOption[];
  pagination: {
    numPages: number;
    numResults: number;
  };
  sorting: {
    Items: Array<{
      label: string;
      value: ProductSortOptions;
      selected: boolean;
    }>;
  };
}

export interface TransformedSearchResponse {
  searchResults: Product[];
  filterOptions: FilterOption[];
  numPages: number;
  numResults: number;
  nextPage: number | undefined;
  sortOptions: Record<string, string>;
}

const fetchProducts = async ({
  searchTerm,
  selectedFilters,
  sortBy,
  region,
  pageParam = 1
}: SearchParams & { pageParam?: number }): Promise<SearchResponse> => {
  const queryParams = new URLSearchParams({
    region: region,
    tcg: '', // Empty for general product search
    mode: 'generic', // Changed from 'sealed' to 'product'
    keyword: searchTerm.trim(),
    sortBy: sortBy,
    maxResultsPerPage: '24',
    pageNumber: pageParam.toString()
  });

  selectedFilters.forEach(({ field, value }) => {
    queryParams.append(`filterSelections[${field}][]`, value);
  });

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
    console.error('Error fetching products:', error);
    if (error instanceof Error) {
      toast.error('Unable to fetch products: ' + error.message);
    } else {
      toast.error('An unexpected error occurred while fetching products');
    }
    throw error;
  }
};

export const useProductSearch = (
  searchParams: SearchParams,
  options?: { enabled?: boolean }
) => {
  const { setFilterOptions } = useProductSearchStore();
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(
    searchParams.searchTerm
  );

  // Debounce the search term to prevent excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchParams.searchTerm);
    }, 500); // 500ms delay for debouncing

    return () => clearTimeout(timer);
  }, [searchParams.searchTerm]);

  // Create debounced search params
  const debouncedSearchParams = {
    ...searchParams,
    searchTerm: debouncedSearchTerm
  };

  // Always enable query - it will use the debounced search term
  const shouldEnableQuery = options?.enabled ?? true;

  const query = useInfiniteQuery({
    queryKey: ['productSearch', debouncedSearchParams],
    queryFn: ({ pageParam = 1 }) =>
      fetchProducts({
        ...debouncedSearchParams,
        pageParam
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return nextPage <= lastPage.pagination.numPages ? nextPage : undefined;
    },
    enabled: shouldEnableQuery,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    select: (data): TransformedSearchResponse => {
      const lastPage = data.pages[data.pages.length - 1];
      const allResults = data.pages.flatMap((page) => page.results);

      const sortOptionsMap = data.pages[0]?.sorting.Items.reduce(
        (acc, item) => ({
          ...acc,
          [item.value]: item.label
        }),
        {} as Record<string, string>
      );

      return {
        searchResults: allResults,
        filterOptions: lastPage?.filters || [],
        numPages: lastPage?.pagination.numPages || 0,
        numResults: lastPage?.pagination.numResults || 0,
        nextPage:
          data.pages.length + 1 <= (lastPage?.pagination.numPages || 0)
            ? data.pages.length + 1
            : undefined,
        sortOptions: sortOptionsMap || {}
      };
    }
  });

  useEffect(() => {
    if (query.data?.filterOptions) {
      setFilterOptions(query.data.filterOptions);
    }
  }, [query.data?.filterOptions, setFilterOptions]);

  return {
    ...query,
    isLoading: query.isLoading || query.isFetching
  };
};
