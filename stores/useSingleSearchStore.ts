import type { Product } from '@/types';
import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'sonner'; 

type Tcg = 'mtg' | 'yugioh' | 'lorcana' | 'pokemon' | 'onepiece';

export interface FilterOptionValues {
  label: string;
  value: string;
  count: number;
  selected: boolean;
}

export type SortOptions = 'price-asc' | 'price-desc' | 'score' | 'name-asc' | 'name-desc';

export interface FilterOption {
  name: string;
  field: string;
  fieldType: string;
  filterType: string;
  values: FilterOptionValues[];
}

interface SearchState {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  tcg: Tcg;
  setTcg: (tcg: Tcg) => void;
  filters: FilterOption[] | null;
  setFilter: (filterField:string, value: string, selected: boolean) => void;
  sortBy: SortOptions;
  setSortBy: (sortBy: SortOptions) => void;
  loading: boolean;
  searchResults: Product[] | null;
  resultsTcg: Tcg;
  promotedResults: Product[] | null;
  autocompleteSuggestions: string[];
  filterOptions?: FilterOption[];
  currentPage: number;
  numPages: number | null;
  setCurrentPage: (currentPage: number) => void;
  clearFilters: () => void;
  setAutocompleteSuggestions: (suggestions: string[]) => void;
  fetchCards: () => Promise<void>;
  clearSearchResults: () => void;
}

export const useSingleSearchStore = create<SearchState>((set, get) => ({
  // Initial State
  searchTerm: '',
  tcg: 'mtg',
  resultsTcg: 'mtg',
  filters: null,
  sortBy: 'price-asc',
  loading: false,
  searchResults: null,
  promotedResults: null,
  autocompleteSuggestions: [],
  currentPage: 1,
  numPages: null,

  // Actions
  setFilter: (filterField:string, value: string, selected: boolean) => {
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
  setTcg: (tcg: Tcg) => set({ tcg }),
  setSortBy: (sortBy: SortOptions) =>
    set({ sortBy }),

  setAutocompleteSuggestions: (suggestions: string[]) =>
    set({ autocompleteSuggestions: suggestions }),
  clearFilters: () => set({ filters: null }),
  fetchCards: async () => {
    const { tcg, searchTerm, filters, sortBy } = get();
    try {
      set({ loading: true });

      // Construct the query parameters
      const queryParams = new URLSearchParams({
        index: `singles_${tcg}*`,
        keyword: searchTerm.trim(),
        search: 'fuzzy', // Default to 'fuzzy' search
        sortBy: `${sortBy}`,
        maxResultsPerPage: '100',
        pageNumber: get().currentPage.toString(),
      });

      // Handle dynamic filters
      if (filters) {
        Object.entries(filters).forEach(([index, filter]) => {
          filter.values.forEach((value) => {
            if (value.selected) {
              queryParams.append(`filterSelections[${filter.field}][]`, value.value);
            }
          })
        });
      }

      console.log(queryParams.toString());
      // Fetch data from the API
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_CATALOG_URL}/api/v1/search?${queryParams.toString()}`
      );

      if (response.status !== 200) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      // Update state with the search results and filter options
      const updatedSearchResults = response.data.results.map((item: Product) => ({
        ...item,
        promoted: false,
      }));

      const promotedResults = response.data.promotedResults || [];
      const updatedPromotedResults = promotedResults.map((item: Product) => ({
        ...item,
        promoted: true,
      }));

      const filterOptionsFromResponse: FilterOption[] = response.data.filters || [];

        console.log(filterOptionsFromResponse);
      set({
        searchResults: updatedSearchResults,
        promotedResults: updatedPromotedResults,
        filterOptions: filterOptionsFromResponse,
        filters: filterOptionsFromResponse,
        resultsTcg: tcg,
        numPages: response.data.pagination.numPages,
        
      });
    } catch (error: any) {
      console.error('Error fetching cards:', error);
      toast.error('Unable to fetch cards: ' + error.message);
    } finally {
      set({ loading: false });
    }
  },

  clearSearchResults: () => set({ searchResults: null, promotedResults: null }),
  setCurrentPage: (currentPage: number) => set({ currentPage }),
}));
