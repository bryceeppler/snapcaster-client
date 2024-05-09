import { WebsiteMapping } from '@/types/website';
import { create } from 'zustand';
import axiosInstance from '@/utils/axiosWrapper';
import type { Tcgs, MultiSearchProduct, Product } from '@/types';

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
  setMode: (mode: 'search' | 'results') => void;
  selectVariant: (key: string, product: Product) => void;
  handleSubmit: () => void;
  setSearchInput: (value: string) => void;
  setTcg: (value: Tcgs) => void;
  onWebsiteSelect: (value: WebsiteMapping) => void;
};

const useMultiSearchStore = create<MultiSearchState>((set, get) => ({
  mode: 'search',
  selectedWebsites: [],
  tcg: 'mtg',
  searchInput: '',
  searchQuery: '',
  loading: false,
  results: [],
  selectedVariants: {},
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
  handleSubmit: async () => {
    set({ loading: true });
    set({ searchQuery: get().searchInput });

    try {
      // Split by newlines to handle multiple lines and encode each name
      // Split by newlines and collect all card names
      const cardNames = get()
        .searchInput.split('\n')
        .map((name) => name.trim());

      // JSON encode the array and then URL encode it
      const encodedNames = encodeURIComponent(JSON.stringify(cardNames));

      // Construct the URL
      const url = `${
        process.env.NEXT_PUBLIC_CATALOG_URL
      }/api/v1/search_multiple?tcg=${get().tcg}&websites=${get()
        .selectedWebsites.map((v) => v.code)
        .join(',')}&names=${encodedNames}`;

      const response = await axiosInstance.get(url);

      set({ mode: 'results' });
      set({ results: response.data.data });
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
        (v) => v.code === value.code
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
