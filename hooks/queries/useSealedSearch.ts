import { useInfiniteQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosWrapper';
import { Product, ProductCategory } from '@/types';
import { FilterOption, SingleSortOptions } from '@/types/query';
import { toast } from 'sonner';

interface SearchParams {
  productCategory: ProductCategory;
  searchTerm: string;
  filters: FilterOption[] | null;
  sortBy: SingleSortOptions;
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
}

export interface TransformedSearchResponse {
  searchResults: (Product & { promoted: boolean })[];
  promotedResults: (Product & { promoted: boolean })[];
  filterOptions: FilterOption[];
  numPages: number;
  numResults: number;
  nextPage: number | undefined;
}

const fetchSealedProducts = async ({
  productCategory,
  searchTerm,
  filters,
  sortBy,
  region,
  pageParam = 1
}: SearchParams & { pageParam?: number }): Promise<SearchResponse> => {
  const queryParams = new URLSearchParams({
    index: `ca_${productCategory}_prod*`,
    keyword: searchTerm.trim(),
    sortBy: sortBy,
    maxResultsPerPage: '24',
    pageNumber: pageParam.toString(),
    fuzzy: 'max'
  });

  if (filters) {
    Object.entries(filters).forEach(([_, filter]) => {
      filter.values.forEach((value) => {
        if (value.selected) {
          queryParams.append(
            `filterSelections[${filter.field}][]`,
            value.value
          );
        }
      });
    });
  }

  try {
    const response = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_CATALOG_URL}/api/v1/search?${queryParams.toString()}`
    );

    if (response.status !== 200) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return response.data;
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
  const query = useInfiniteQuery({
    queryKey: ['sealedSearch', searchParams.sortBy],
    queryFn: ({ pageParam = 1 }: { pageParam?: number }) => fetchSealedProducts({ ...searchParams, pageParam }),
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
      const allResults = data.pages.flatMap(page => page.results);
      const allPromotedResults = data.pages[0].promotedResults || []; // Only show promoted results on first page

      return {
        searchResults: allResults.map((item) => ({ ...item, promoted: false })),
        promotedResults: allPromotedResults.map((item) => ({
          ...item,
          promoted: true
        })),
        filterOptions: lastPage.filters || [],
        numPages: lastPage.pagination.numPages,
        numResults: lastPage.pagination.numResults,
        nextPage: data.pages.length + 1 <= lastPage.pagination.numPages 
          ? data.pages.length + 1 
          : undefined
      };
    }
  });

  return {
    ...query,
    isLoading: query.isFetching || query.isLoading
  };
}; 