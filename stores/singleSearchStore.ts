import { create } from 'zustand';
import axiosInstance from '@/utils/axiosWrapper';
import type { Tcgs } from '@/types/index';
import { toast } from 'sonner';
const initialConditionLabels = ['NM', 'LP', 'PL', 'MP', 'HP', 'DMG', 'SCAN'];

type SingleSearchState = {
  searchInput: string;
  searchQuery: string;
  results: any[];
  filteredResults: any[];
  loading: boolean;
  tcg: Tcgs;
  searchStarted: boolean;
  conditions: string[];
  sortField: string;
  sortOrder: 'asc' | 'desc';
  foil: boolean;
  resultsTcg: string;
  promotedCards: any[];
  setSearchInput: (input: string) => void;
  setTcg: (tcg: Tcgs) => void;
  setConditions: (conditions: string[]) => void;
  setSortField: (field: string) => void;
  setDiscounts: () => void;
  toggleSortOrder: () => void;
  toggleFoil: () => void;
  clearFilters: () => void;
  fetchCards: () => Promise<void>;
};

/**
 * Zustand store for the single search page, including input, results, filtering, and sorting state
 */
const useSingleStore = create<SingleSearchState>((set, get) => ({
  searchInput: '',
  searchQuery: '',
  results: [],
  filteredResults: [],
  loading: false,
  searchStarted: false,
  tcg: 'mtg',
  conditions: initialConditionLabels,
  sortField: 'price',
  sortOrder: 'asc',
  foil: false,
  resultsTcg: '',
  promotedCards: [],
  setSearchInput: (input: string) => {
    set({ searchInput: input });
  },
  setTcg: (tcg: Tcgs) => {
    set({ tcg });
  },
  setConditions: (conditions: string[]) => {
    set({ conditions });
    applyFilters();
  },
  setSortField: (field: string) => {
    set({ sortField: field });
    applyFilters();
  },

  setDiscounts: () => {
    const resultsAfterDiscount = get().results;
    resultsAfterDiscount.map((item) => {
      item.priceBeforeDiscount = item.price;
      // if (item.website == 'obsidian' || item.website == 'levelup') {
      if (item.website == 'obsidian') {
        item.price = (item.price * 0.95).toFixed(2);
      }
    });

    const promotedAfterDiscount = get().promotedCards;
    promotedAfterDiscount.map((item) => {
      item.priceBeforeDiscount = item.price;
      if (item.website == 'obsidian') {
        // if (item.website == 'obsidian' || item.website == 'levelup') {
        item.price = (item.price * 0.95).toFixed(2);
      }
    });

    set({
      results: resultsAfterDiscount,
      filteredResults: resultsAfterDiscount,
      promotedCards: promotedAfterDiscount
    });
    applyFilters();
  },

  toggleSortOrder: () => {
    set({ sortOrder: get().sortOrder === 'asc' ? 'desc' : 'asc' });
    applyFilters();
  },
  toggleFoil: () => {
    set({ foil: !get().foil });
    applyFilters();
  },
  clearFilters: () => {
    set({
      conditions: initialConditionLabels,
      sortField: 'price',
      sortOrder: 'asc',
      foil: false,
      filteredResults: get().results
    });
  },
  fetchCards: async () => {
    try {
      set({ loading: true, searchStarted: true });
      set({ resultsTcg: get().tcg });
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_CATALOG_URL}/api/v1/search/?tcg=${
          get().tcg
        }&name=${encodeURIComponent(get().searchInput.trim())}`
      );
      // if response is not 200, throw error
      if (response.status !== 200) {
        // throw error message with status  and statusText
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      set({ searchQuery: get().searchInput });
      set({
        results: response.data.data,
        filteredResults: response.data.data,
        promotedCards: response.data.promotedCards
      });
      get().setDiscounts();
      set({ loading: false });
    } catch (error) {
      console.error(error);
      toast.error('Unable to fetch cards: ' + error);
    }
  }
}));

function applyFilters() {
  const { results, conditions, sortField, sortOrder, foil } =
    useSingleStore.getState();

  // Apply filtering based on conditions and foil status
  let filtered = results.filter((result) => {
    const matchesConditions =
      conditions.length === 0 || conditions.includes(result.condition);

    // Normalize the `foil` value to treat all truthy values as `true`
    const resultFoil = Boolean(result.foil);
    const matchesFoil = foil ? resultFoil === true : true;

    return matchesConditions && matchesFoil;
  });

  // Sort based on the selected field and order
  filtered.sort((a, b) => {
    let comparison = 0;

    // Check if both items have the sort field
    if (a[sortField] === undefined || b[sortField] === undefined) {
      // Items without the sorting field will be placed at the end
      return a[sortField] === undefined ? 1 : -1;
    }

    if (a[sortField] < b[sortField]) comparison = -1;
    if (a[sortField] > b[sortField]) comparison = 1;

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Update the filtered results
  useSingleStore.setState({ filteredResults: filtered });
}

export default useSingleStore;
