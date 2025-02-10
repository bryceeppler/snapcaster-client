import type { Product, ProductCategory, Tcg } from '@/types';
import { create } from 'zustand';
import axiosInstance from '@/utils/axiosWrapper';
import { toast } from 'sonner';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { FilterOption, FilterOptionValues, SingleSortOptions } from '@/types/query';



type SearchState = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  productCategory: ProductCategory;
  setProductCategory: (productCategory: ProductCategory) => void;
  filters: FilterOption[] | null;
  setFilters: (filterField: string, value: string, selected: boolean) => void;
  sortBy: SingleSortOptions;
  setSortBy: (sortBy: SingleSortOptions) => void;
  loadingCardResults: boolean;
  loadingFilterResults: boolean;
  searchResults: Product[] | null;
  resultsProductCategory: ProductCategory;
  promotedResults: Product[] | null;
  autocompleteSuggestions: string[];
  filterOptions?: FilterOption[];
  currentPage: number;
  numResults?: number;
  numPages: number | null;
  region: string;
  setRegion: (region: string) => void;
  setCurrentPage: (currentPage: number) => void;
  clearFilters: () => void;
  setAutocompleteSuggestions: (suggestions: string[]) => void;
  applyFilters: () => Promise<void>;
  clearSearchResults: () => void;
};


export const useSealedSearchStore = create<SearchState>()(
  devtools(
    persist(
      (set, get) => ({
        searchTerm: '',
        productCategory: 'sealed_mtg',
        resultsProductCategory: 'sealed_mtg',
        filters: null,
        sortBy: 'price-asc',
        loadingCardResults: false,
        loadingFilterResults:false,
        searchResults: null,
        promotedResults: null,
        autocompleteSuggestions: [],
        currentPage: 1,
        numPages: null,
        region: 'ca',
        setRegion: (region: string) => set({ region }),
        setFilters: (filterField: string, value: string, selected: boolean) => {
          const filters = get().filters || [];
          const updatedFilters = filters.map((filter) => {
            if (filter.field === filterField) {
              const updatedValues = filter.values.map((option) => {
                if (option.value === value) {
                  return { ...option, selected };
                }
                return option;
              });
              return { ...filter, values: updatedValues };
            }
            return filter;
          });
          set({ filters: updatedFilters });
        },

        setSearchTerm: (term: string) => set({ searchTerm: term }),
        setProductCategory: (productCategory: ProductCategory) => {
          if (typeof window !== 'undefined') {
            localStorage.setItem('productCategory', productCategory);
          }
          set({ productCategory, resultsProductCategory: productCategory });
        },
        setSortBy: (sortBy: SingleSortOptions) => set({ sortBy }),

        setAutocompleteSuggestions: (suggestions: string[]) =>
          set({ autocompleteSuggestions: suggestions }),
        clearFilters: () => set({ filters: null }),

        applyFilters: async () => {
          const { productCategory, searchTerm, filters, sortBy, region } = get();
          try {
            const queryParams = new URLSearchParams({
              index: `ca_singles_${productCategory}_prod*`,
              keyword: searchTerm.trim(),
              // search: 'fuzzy',
              sortBy: `${sortBy}`,
              maxResultsPerPage: '100',
              pageNumber: get().currentPage.toString()
            });

            if (filters) {
              Object.entries(filters).forEach(([index, filter]) => {
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

            // set loadingCardResults to true
            set({ loadingCardResults: true });

            const response = await axiosInstance.get(
              `${
                process.env.NEXT_PUBLIC_CATALOG_URL
              }/api/v1/search?${queryParams.toString()}`
            );

            if (response.status !== 200) {
              throw new Error(
                `Error: ${response.status} - ${response.statusText}`
              );
            }

            const updatedSearchResults = response.data.results.map(
              (item: Product) => ({
                ...item,
                promoted: false
              })
            );

            const promotedResults = response.data.promotedResults || [];
            const updatedPromotedResults = promotedResults.map(
              (item: Product) => ({
                ...item,
                promoted: true
              })
            );

            const filterOptionsFromResponse: FilterOption[] =
              response.data.filters || [];

            set({
              searchResults: updatedSearchResults,
              promotedResults: updatedPromotedResults,
              filterOptions: filterOptionsFromResponse,
              filters: filterOptionsFromResponse,
              resultsProductCategory: productCategory,
              numPages: response.data.pagination.numPages,
              numResults: response.data.pagination.numResults,
              loadingCardResults: false
            });
          } catch (error: any) {
            console.error('Error fetching cards:', error);
            toast.error('Unable to fetch cards: ' + error.message);
          }
        },
        clearSearchResults: () =>
          set({ searchResults: null, promotedResults: null }),
        setCurrentPage: (currentPage: number) => set({ currentPage })
      }),
      {
        name: 'sealed-search-store',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ productCategory: state.productCategory, region: state.region })
      }
    )
  )
);
