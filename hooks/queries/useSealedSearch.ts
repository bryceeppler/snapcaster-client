import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { useSealedSearchStore } from '@/stores/useSealedSearchStore';
import type { Product, Tcg } from '@/types';
import type { FilterOption, SealedSortOptions } from '@/types/query';
import axiosInstance from '@/utils/axiosWrapper';

interface SearchParams {
  productCategory: Tcg;
  searchTerm: string;
  selectedFilters: { field: string; value: string }[];
  sortBy: SealedSortOptions;
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
      value: SealedSortOptions;
      selected: boolean;
    }>;
  };
}

export interface TransformedSearchResponse {
  searchResults: (Product & { promoted: boolean })[];
  promotedResults: (Product & { promoted: boolean })[];
  filterOptions: FilterOption[];
  numPages: number;
  numResults: number;
  nextPage: number | undefined;
  sortOptions: Record<string, string>;
}

const fetchSealedProducts = async ({
  productCategory,
  searchTerm,
  selectedFilters,
  sortBy,
  region,
  pageParam = 1
}: SearchParams & { pageParam?: number }): Promise<SearchResponse> => {
  const queryParams = new URLSearchParams({
    region: region,
    tcg: productCategory,
    mode: 'sealed',
    keyword: searchTerm.trim(),
    sortBy: sortBy,
    maxResultsPerPage: '24',
    pageNumber: pageParam.toString()
    // fuzzy: 'max'
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
    console.error('Error fetching cards:', error);
    if (error instanceof Error) {
      toast.error('Unable to fetch cards: ' + error.message);
    } else {
      toast.error('An unexpected error occurred while fetching cards');
    }
    throw error;
  }
};

export const useSealedSearch = (
  searchParams: SearchParams,
  options?: { enabled?: boolean }
) => {
  const { setFilterOptions } = useSealedSearchStore();

  const query = useInfiniteQuery({
    queryKey: ['sealedSearch', searchParams],
    queryFn: ({ pageParam = 1 }) =>
      fetchSealedProducts({
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
      const allPromotedResults = data.pages[0].promotedResults || [];

      const sortOptionsMap = data.pages[0].sorting.Items.reduce(
        (acc, item) => ({
          ...acc,
          [item.value]: item.label
        }),
        {} as Record<string, string>
      );

      return {
        searchResults: allResults.map((item) => ({ ...item, promoted: false })),
        promotedResults: allPromotedResults.map((item) => ({
          ...item,
          promoted: true
        })),
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
