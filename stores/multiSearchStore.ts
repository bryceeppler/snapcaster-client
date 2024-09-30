import { WebsiteMapping } from '@/types/website';
import { create } from 'zustand';
import axiosInstance from '@/utils/axiosWrapper';
import type { Tcg, Product } from '@/types';
import { trackSearch } from '@/utils/analytics';
import axios from 'axios';

type MultiSearchState = {
  mode: 'search' | 'results';
  selectedWebsites: WebsiteMapping[];
  tcg: Tcg;
  searchInput: string;
  searchQuery: string;
  loading: boolean;
  results: Product[][];
  selectedVariants: {
    [key: string]: Product;
  };
  resultsTcg: Tcg;
  cart: Product[];
  resultsList: {name:string, normalized_name:string}[];
  resetSearch: () => void;
  removeFromCart: (product: Product) => void;
  isInCart: (product: Product) => boolean;
  addToCart: (product: Product) => void;
  setResultsTcg: (value: Tcg) => void;
  setMode: (mode: 'search' | 'results') => void;
  selectVariant: (key: string, product: Product) => void;
  handleSubmit: (tcg: string) => void;
  setSearchInput: (value: string) => void;
  setTcg: (value: Tcg) => void;
  onWebsiteSelect: (value: WebsiteMapping) => void;
  resetSelectedWebsites: () => void;
};

const useMultiSearchStore = create<MultiSearchState>((set, get) => ({
  cart: [],
  resultsTcg: 'mtg',
  mode: 'search',
  selectedWebsites: [],
  tcg: 'mtg',
  searchInput: '',
  searchQuery: '',
  loading: false,
  results: [],
  selectedVariants: {},
  resultsList: [],
  resetSelectedWebsites: () => {
    set({ selectedWebsites: [] });
  },
  resetSearch: () => {
    set({
      mode: 'search',
      tcg: 'mtg',
      searchQuery: '',
      loading: false,
      results: [],
      selectedVariants: {},
      resultsTcg: 'mtg',
    });
  },
  removeFromCart: (product) => {
    set((state) => {
      return {
        ...state,
        cart: state.cart.filter((p) => p !== product)
      };
    });
  },
  isInCart: (product) => {
    return get().cart.some((p) => p === product);
  },
  addToCart: (product) => {
    set((state) => {
      return {
        ...state,
        cart: [...state.cart, product]
      };
    });
  },
  setResultsTcg: (value: Tcg) => {
    set({ resultsTcg: value });
  },
  selectVariant: (key: string, product: Product) => {
    set((state) => {
      return {
        ...state,
        selectedVariants: {
          ...state.selectedVariants,
          [key]: product
        }
      };
    });
  },
  setMode: (mode: 'search' | 'results') => {
    set({ mode });
  },
  handleSubmit: async (tcg) => {
    set({ loading: true });
    set({ searchQuery: get().searchInput });
    set({ resultsTcg: get().tcg });

    try {
      const cardNames = get().searchInput
      trackSearch(cardNames, tcg, 'multi');
      const url = `${
        process.env.NEXT_PUBLIC_CATALOG_URL
      }/api/v1/multisearch`
      const body = {
        cardData: cardNames,
        index: `singles_${tcg}_prod*`,
        // TODO: Add acceptable conditions
      }

      const response = await axios.post(url, body);

      set({ mode: 'results' });
      set({ results: response.data.results });
      set({ resultsList: response.data.list});
      set({ loading: false });
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },
  setSearchInput: (value: string) => {
    set({ searchInput: value });
  },
  setTcg: (value: Tcg) => {
    set({ tcg: value });
  },
  onWebsiteSelect: (value: WebsiteMapping) => {
    set((state) => {
      // Find the index of the website by its code
      const index = state.selectedWebsites.findIndex(
        (v) => v.slug === value.slug
      );

      // If the website is found, remove it from the list
      if (index > -1) {
        return {
          ...state,
          selectedWebsites: state.selectedWebsites.filter((_, i) => i !== index)
        };
      }

      // Otherwise, add it to the list
      return {
        ...state,
        selectedWebsites: [...state.selectedWebsites, value]
      };
    });
  }
}));

export default useMultiSearchStore;
