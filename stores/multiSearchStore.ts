import { WebsiteMapping } from '@/types/website';
import { create } from 'zustand';
import axiosInstance from '@/utils/axiosWrapper';
import type { Tcg, Product } from '@/types';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { trackSearch } from '@/utils/analytics';

type MultiSearchState = {
  mode: 'search' | 'results';
  selectedWebsites: WebsiteMapping[];
  tcg: Tcg;
  searchInput: string;
  searchQuery: string;
  loading: boolean;
  results: Product[][];
  resultsTcg: Tcg;
  cart: Product[];
  notFound: string[];
  resultsList: { name: string; normalized_name: string }[];
  resetSearch: () => void;
  removeFromCart: (product: Product) => void;
  isInCart: (product: Product) => boolean;
  addToCart: (product: Product) => void;
  setResultsTcg: (value: Tcg) => void;
  setMode: (mode: 'search' | 'results') => void;
  handleSubmit: (tcg: string) => void;
  setSearchInput: (value: string) => void;
  setTcg: (tcg: Tcg) => void;
  onWebsiteSelect: (value: WebsiteMapping) => void;
  resetSelectedWebsites: () => void;
};

const useMultiSearchStore = create<MultiSearchState>()(
  devtools( 
    persist(
      // @ts-ignore
      (set, get) => ({
        cart: [], 
        resultsTcg: 'mtg',
        mode: 'search',
        selectedWebsites: [],
        tcg: 'mtg',
        searchInput: '',
        searchQuery: '',
        loading: false,
        results: [],
        resultsList: [],
        resetSelectedWebsites: () => {
          set({ selectedWebsites: [] });
        },
        resetSearch: () => {
          set({
            mode: 'search',
            searchQuery: '',
            loading: false,
            results: [],
            resultsTcg: 'mtg'
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

        setMode: (mode: 'search' | 'results') => {
          set({ mode });
        },
        handleSubmit: async (tcg) => {
          set({ loading: true });
          set({ searchQuery: get().searchInput });
          set({ resultsTcg: get().tcg });

          try {
            const cardNames = get().searchInput;
            trackSearch(cardNames, tcg, 'multi');
            const url = `${process.env.NEXT_PUBLIC_CATALOG_URL}/api/v1/multisearch`;
            const body = {
              cardData: cardNames,
              index: `ca_singles_${tcg}_prod*`
              // TODO: Add acceptable conditions
            };

            const response = await axiosInstance.post(url, body);

            set({ mode: 'results' });
            set({ results: response.data.results });
            set({ resultsList: response.data.list });
            set({ notFound : response.data.not_found });
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
            const index = state.selectedWebsites.findIndex(
              (v) => v.slug === value.slug
            );

            if (index > -1) {
              return {
                ...state,
                selectedWebsites: state.selectedWebsites.filter(
                  (_, i) => i !== index
                )
              };
            }

            return {
              ...state,
              selectedWebsites: [...state.selectedWebsites, value]
            };
          });
        }
      }),
      {
        name: 'multi-search-store',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ tcg: state.tcg }),
      }
    )
  )
);

export default useMultiSearchStore;
