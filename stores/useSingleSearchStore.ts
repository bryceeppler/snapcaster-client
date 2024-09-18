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
  sortField: string;
  setSortField: (field: string) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  loading: boolean;
  searchResults: Product[] | null;
  resultsTcg: Tcg;
  promotedResults: Product[] | null;
  autocompleteSuggestions: string[];
  filterOptions?: FilterOption[];
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
  sortField: 'price',
  sortOrder: 'asc',
  loading: false,
  searchResults: null,
  promotedResults: null,
  autocompleteSuggestions: [],

  // Actions
  setSearchTerm: (term: string) => set({ searchTerm: term }),
  setTcg: (tcg: Tcg) => set({ tcg }),
  setSortField: (field: string) => set({ sortField: field }),
  setSortOrder: (order: 'asc' | 'desc') => set({ sortOrder: order }),
  setAutocompleteSuggestions: (suggestions: string[]) =>
    set({ autocompleteSuggestions: suggestions }),

  fetchCards: async () => {
    const { tcg, searchTerm, filters, sortField, sortOrder } = get();
    try {
      set({ loading: true });

      // Construct the query parameters
      const queryParams = new URLSearchParams({
        index: `singles_${tcg}*`,
        keyword: searchTerm.trim(),
        search: 'fuzzy', // Default to 'fuzzy' search
        sortBy: `${sortField}-${sortOrder}`, // Sort format like 'price-asc' or 'price-desc'
        maxResultsPerPage: '100'
      });

      // Handle dynamic filters
      if (filters) {
        Object.entries(filters).forEach(([key, values]) => {
          if (Array.isArray(values)) {
            values.forEach((value) => queryParams.append(`filterSelections[${key}]`, value));
          }
        });
      }

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
        resultsTcg: tcg,
      });
    } catch (error: any) {
      console.error('Error fetching cards:', error);
      toast.error('Unable to fetch cards: ' + error.message);
    } finally {
      set({ loading: false });
    }
  },

  clearSearchResults: () => set({ searchResults: null, promotedResults: null }),
}));
