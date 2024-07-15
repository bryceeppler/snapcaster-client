import { WebsiteMapping } from '@/types/website';
import { create } from 'zustand';
import axiosInstance from '@/utils/axiosWrapper';
import type { Tcgs, MultiSearchProduct, Product } from '@/types';
import { handleQuerySingleCard } from '@/utils/analytics';

type MultiSearchState = {
  mode: 'search' | 'results';
  selectedWebsites: WebsiteMapping[];
  tcg: Tcgs;
  searchInput: string;
  searchQuery: string;
  loading: boolean;
  results: MultiSearchProduct[];
  selectedVariants: {
    [key: string]: Product;
  };
  resultsTcg: Tcgs;
  selectedResult?: MultiSearchProduct;
  cart: Product[];
  resetSearch: () => void;
  removeFromCart: (product: Product) => void;
  isInCart: (product: Product) => boolean;
  addToCart: (product: Product) => void;
  setResultsTcg: (value: Tcgs) => void;
  setSelectedResult: (value: MultiSearchProduct) => void;
  setMode: (mode: 'search' | 'results') => void;
  selectVariant: (key: string, product: Product) => void;
  handleSubmit: (tcg: string) => void;
  setSearchInput: (value: string) => void;
  setTcg: (value: Tcgs) => void;
  onWebsiteSelect: (value: WebsiteMapping) => void;
  resetSelectedWebsites: () => void;
};

const useMultiSearchStore = create<MultiSearchState>((set, get) => ({
  cart: [],
  resultsTcg: 'mtg',
  selectedResult: undefined,
  mode: 'search',
  selectedWebsites: [],
  tcg: 'mtg',
  searchInput: '',
  searchQuery: '',
  loading: false,
  results: [],
  selectedVariants: {},
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
      selectedResult: undefined
    });
  },
  removeFromCart: (product) => {
    set((state) => {
      return {
        ...state,
        cart: state.cart.filter((p) => p._id !== product._id)
      };
    });
  },
  isInCart: (product) => {
    return get().cart.some((p) => p._id === product._id);
  },
  addToCart: (product) => {
    set((state) => {
      return {
        ...state,
        cart: [...state.cart, product]
      };
    });
  },
  setSelectedResult: (value: MultiSearchProduct) => {
    set({ selectedResult: value });
  },
  setResultsTcg: (value: Tcgs) => {
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
      // Split by newlines to handle multiple lines and encode each name
      // Split by newlines and collect all card names
      const cardNames = get()
        .searchInput.split('\n')
        .map((name) => name.trim())
        .filter((name) => name.length > 0);
      cardNames.forEach((card) => {
        handleQuerySingleCard(card, tcg, 'multi');
      });
      // JSON encode the array and then URL encode it
      const encodedNames = encodeURIComponent(JSON.stringify(cardNames));

      // Construct the URL
      const url = `${
        process.env.NEXT_PUBLIC_CATALOG_URL
      }/api/v1/search_multiple?tcg=${get().tcg}&websites=${get()
        .selectedWebsites.map((v) => v.slug)
        .join(',')}&names=${encodedNames}`;

      const response = await axiosInstance.get(url);

      set({ mode: 'results' });
      set({ results: response.data.data });
      set({ selectedResult: response.data.data[0] });
      set({ loading: false });
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },
  setSearchInput: (value: string) => {
    set({ searchInput: value });
  },
  setTcg: (value: Tcgs) => {
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
