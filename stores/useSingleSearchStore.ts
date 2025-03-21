import type { Product, Tcg } from '@/types';
import { create } from 'zustand';
import axiosInstance from '@/utils/axiosWrapper';
import { toast } from 'sonner';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import {
  FilterOption,
  FilterOptionValues,
  SingleSortOptions
} from '@/types/query';

type SearchState = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  tcg: Tcg;
  setTcg: (tcg: Tcg) => void;
  filters: FilterOption[] | null;
  setFilter: (filterField: string, value: string, selected: boolean) => void;
  sortBy: SingleSortOptions;
  setSortBy: (sortBy: SingleSortOptions) => void;
  loadingCardResults: boolean;
  loadingFilterResults: boolean;
  searchResults: Product[] | null;
  resultsTcg: Tcg;
  promotedResults: Product[] | null;
  autocompleteSuggestions: string[];
  filterOptions?: FilterOption[];
  currentPage: number;
  numResults?: number;
  numPages: number | null;
  region: string;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setRegion: (region: string) => void;
  setCurrentPage: (currentPage: number) => void;
  clearFilters: () => void;
  setAutocompleteSuggestions: (suggestions: string[]) => void;
  fetchCards: (page?: number) => Promise<void>;
  applyFilters: () => Promise<void>;
  clearSearchResults: () => void;
};

export const useSingleSearchStore = create<SearchState>()(
  // @ts-ignore
  devtools(
    persist(
      (set, get) => ({
        searchTerm: '',
        tcg: 'mtg',
        resultsTcg: 'mtg',
        filters: null,
        sortBy: 'price-asc',
        loadingCardResults: false,
        loadingFilterResults: false,
        searchResults: null,
        promotedResults: null,
        autocompleteSuggestions: [],
        currentPage: 1,
        numPages: null,
        region: 'ca',
        isLoading: false,
        setIsLoading: (loading: boolean) => set({ isLoading: loading }),
        setRegion: (region: string) => set({ region }),
        setFilter: (filterField: string, value: string, selected: boolean) => {
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
        setTcg: (tcg: Tcg) => {
          if (typeof window !== 'undefined') {
            localStorage.setItem('tcg', tcg);
          }
          set({ tcg, resultsTcg: tcg });
        },
        setSortBy: (sortBy: SingleSortOptions) => set({ sortBy }),

        setAutocompleteSuggestions: (suggestions: string[]) =>
          set({ autocompleteSuggestions: suggestions }),
        clearFilters: () => set({ filters: null }),
        fetchCards: async (page?: number) => {
          const { tcg, searchTerm, filters, sortBy, region } = get();
          try {
            set({ loadingCardResults: true, loadingFilterResults: true });

            const queryParams = new URLSearchParams({
              mode: 'singles',
              tcg: `${tcg}`,
              region: 'ca',
              // index: `ca_singles_${tcg}_prod*`,
              keyword: searchTerm.trim(),
              // search: 'fuzzy',
              sortBy: `${sortBy}`,
              maxResultsPerPage: '100',
              pageNumber: (page ?? get().currentPage).toString()
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

            const updatedSearchResults = response.data.data.results.map(
              (item: Product) => ({
                ...item,
                promoted: false
              })
            );

            const promotedResults = response.data.data.promotedResults || [];
            const updatedPromotedResults = promotedResults.map(
              (item: Product) => ({
                ...item,
                promoted: true
              })
            );

            const filterOptionsFromResponse: FilterOption[] =
              response.data.data.filters || [];

            set({
              searchResults: updatedSearchResults,
              promotedResults: updatedPromotedResults,
              filterOptions: filterOptionsFromResponse,
              filters: filterOptionsFromResponse,
              resultsTcg: tcg,
              numPages: response.data.data.pagination.numPages,
              numResults: response.data.data.pagination.numResults,
              currentPage: page ?? get().currentPage
            });
          } catch (error: any) {
            console.error('Error fetching cards:', error);
            toast.error('Unable to fetch cards: ' + error.message);
          } finally {
            set({ loadingCardResults: false, loadingFilterResults: false });
          }
        },
        applyFilters: async () => {
          const { tcg, searchTerm, filters, sortBy, region } = get();
          try {
            const queryParams = new URLSearchParams({
              region: region,
              mode: 'singles',
              tcg: tcg,
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

            const updatedSearchResults = response.data.data.results.map(
              (item: Product) => ({
                ...item,
                promoted: false
              })
            );

            const promotedResults = response.data.data.promotedResults || [];
            const updatedPromotedResults = promotedResults.map(
              (item: Product) => ({
                ...item,
                promoted: true
              })
            );

            const filterOptionsFromResponse: FilterOption[] =
              response.data.data.filters || [];

            set({
              searchResults: updatedSearchResults,
              promotedResults: updatedPromotedResults,
              filterOptions: filterOptionsFromResponse,
              filters: filterOptionsFromResponse,
              resultsTcg: tcg,
              numPages: response.data.data.pagination.numPages,
              numResults: response.data.data.pagination.numResults,
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
        name: 'single-search-store',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ tcg: state.tcg, region: state.region })
      }
    )
  )
);
