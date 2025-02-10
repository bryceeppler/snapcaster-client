import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosWrapper';
import { Product, ProductCategory } from '@/types';
import { FilterOption, SingleSortOptions } from '@/types/query';
import { toast } from 'sonner';

interface SearchParams {
  productCategory: ProductCategory;
  searchTerm: string;
  filters: FilterOption[] | null;
  sortBy: SingleSortOptions;
  currentPage: number;
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
}

const fetchSealedProducts = async ({
  productCategory,
  searchTerm,
  filters,
  sortBy,
  currentPage,
  region
}: SearchParams): Promise<SearchResponse> => {
  console.log("Calling useSealedSearch with productCategory:", productCategory);
  console.log("Calling useSealedSearch with searchTerm:", searchTerm);
  console.log("Calling useSealedSearch with filters:", filters);
  console.log("Calling useSealedSearch with sortBy:", sortBy);
  console.log("Calling useSealedSearch with currentPage:", currentPage);
  console.log("Calling useSealedSearch with region:", region);
  const queryParams = new URLSearchParams({
    index: `ca_${productCategory}_prod*`,
    keyword: searchTerm.trim(),
    sortBy: `${sortBy}`,
    maxResultsPerPage: '100',
    pageNumber: currentPage.toString()
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
  return useQuery<SearchResponse, Error, TransformedSearchResponse>({
    queryKey: ['sealedSearch', searchParams],
    queryFn: () => fetchSealedProducts(searchParams),
    enabled: options?.enabled ?? !!searchParams.searchTerm,
    select: (data): TransformedSearchResponse => ({
      searchResults: data.results.map((item) => ({ ...item, promoted: false })),
      promotedResults: (data.promotedResults || []).map((item) => ({
        ...item,
        promoted: true
      })),
      filterOptions: data.filters || [],
      numPages: data.pagination.numPages,
      numResults: data.pagination.numResults
    })
  });
}; 