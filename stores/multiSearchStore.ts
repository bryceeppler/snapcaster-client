import { WebsiteMapping } from '@/types/website';
import { create } from 'zustand';
import axiosInstance from '@/utils/axiosWrapper';
import type { Tcg, Product, Condition } from '@/types';
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
  minimumAcceptableCondition: Condition;
  setMinimumAcceptableCondition: (condition: Condition) => void;
  resetSearch: () => void;
  removeFromCart: (product: Product) => void;
  isInCart: (product: Product) => boolean;
  addToCart: (product: Product) => void;
  setResultsTcg: (value: Tcg) => void;
  setMode: (mode: 'search' | 'results') => void;
  handleSubmit: (tcg: string, minimumAcceptableCondition: Condition) => void;
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
        minimumAcceptableCondition: 'mp',
        setMinimumAcceptableCondition: (condition: Condition) => {
          set({ minimumAcceptableCondition: condition });
        },
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
        handleSubmit: async (
          tcg: string,
          minimumAcceptableCondition: Condition
        ) => {
          set({ loading: true });
          set({ searchQuery: get().searchInput });
          set({ resultsTcg: get().tcg });

          try {
            const cardNames = get().searchInput;
            trackSearch(cardNames, tcg, 'multi');
            const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/catalog/multisearch`;

            const conditionOrder = ['nm', 'lp', 'mp', 'hp', 'dmg'];
            const minConditionIndex = conditionOrder.indexOf(
              minimumAcceptableCondition
            );

            const conditionFlags = conditionOrder.reduce((acc, condition) => {
              acc[condition.toUpperCase()] =
                conditionOrder.indexOf(condition) <= minConditionIndex;
              return acc;
            }, {} as Record<string, boolean>);

            const body = {
              cardData: cardNames,
              index: `ca_singles_${tcg}_prod*`,
              ...conditionFlags
            };

            const response = await axiosInstance.post(url, body);

            set({ mode: 'results' });
            set({ results: response.data.data.results });
            set({ resultsList: response.data.data.list });
            set({ notFound: response.data.data.not_found });
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
        partialize: (state) => ({ tcg: state.tcg })
      }
    )
  )
);

export default useMultiSearchStore;
