import { create } from 'zustand';
import axiosInstance from '@/utils/axiosWrapper';
import type { Tcgs } from '@/types/index';
import { toast } from 'sonner';

const conditions = [
  'NM',
  'LP',
  'MP',
  'HP',
  'DMG',
];

type FilterState = {
  conditions: string[];
  priceRange: { min: number | null, max: number | null };
  foil: boolean;
  vendors: string[];
  sortField: string;
  sortOrder: 'asc' | 'desc';
};

type SingleSearchState = {
  searchInput: string;
  results: any[];
  loading: boolean;
  searchStarted: boolean;
  tcg: Tcgs;
  resultsTcg: string;
  promotedCards: any[];
  filters: FilterState; 
  setSearchInput: (input: string) => void;
  setTcg: (tcg: Tcgs) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  applyFilters: () => void; 
  clearFilters: () => void;
  fetchCards: (searchInput:string, filters?: FilterState) => Promise<void>; // Pass filters as a parameter
};

const useSingleStore = create<SingleSearchState>((set, get) => ({
  searchInput: '',
  results: [],
  loading: false,
  searchStarted: false,
  tcg: 'mtg',
  filters: {
    conditions: conditions,
    priceRange: { min: null, max: null },
    foil: false,
    showcase: false,
    alternateArt: false,
    promo: false,
    sets: [],
    vendors: [],
    sortField: 'price',
    sortOrder: 'asc',
  },
  resultsTcg: '',
  promotedCards: [],
  
  // Update search input
  setSearchInput: (input: string) => {
    set({ searchInput: input });
  },
  
  // Set selected TCG
  setTcg: (tcg: Tcgs) => {
    set({ tcg });
  },
  
  // Set filters by passing a partial object
  setFilters: (filters: Partial<FilterState>) => {
    set((state) => ({
      filters: {
        ...state.filters,
        ...filters,
      },
    }));
  },
  
  // Apply the current filters to the results and fetch cards with filters
  applyFilters: () => {
    const { searchInput, filters } = useSingleStore.getState();
    get().fetchCards(searchInput, filters);
  },
  
  clearFilters: () => {
    set({
      filters: {
        conditions: conditions,
        priceRange: { min: null, max: null },
        foil: false,
        vendors: [],
        sortField: 'price',
        sortOrder: 'asc',
      },
    });

  },

  // Fetch cards with the filters
  fetchCards: async (cardName: string, filters?: FilterState) => {
    try {
      set({ loading: true, searchStarted: true });

      // Construct the query string for filters
      const queryParams = new URLSearchParams({
        tcg: get().tcg,
        name: encodeURIComponent(cardName.trim()),
        search: 'fuzzy',
      });

      if (filters) {
        // Add conditions as individual query parameters
        if (filters.conditions.length > 0) {
          filters.conditions.forEach((condition) => {
            queryParams.append('condition[]', condition);
          });
        }
        if (filters.foil) queryParams.append('foil', 'true');
        if (filters.priceRange.min !== null) {
          queryParams.append('price_gte', filters.priceRange.min.toString());
        }
        if (filters.priceRange.max !== null) {
          queryParams.append('price_lte', filters.priceRange.max.toString());
        }
        if (filters.vendors.length > 0) {
          filters.vendors.forEach((vendor) => queryParams.append('vendors[]', vendor));
        }
      }

      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_CATALOG_URL}/api/v1/search/?${queryParams.toString()}`
      );

      if (response.status !== 200) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      set({
        results: response.data.data,
        promotedCards: response.data.promotedResults,
      });
      set({ loading: false });
    } catch (error) {
      console.error(error);
      toast.error('Unable to fetch cards: ' + error);
      set({ loading: false });
    }
  },
}));

export default useSingleStore;
