import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { FilterOption, SealedSortOptions } from '@/types/query';
import { Tcg } from '@/types';

const SEALED_LOCAL_STORAGE_VERSION = 1;

interface FilterSelection {
  field: string;
  value: string;
}

type SearchState = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;

  productCategory: Tcg;
  setProductCategory: (productCategory: Tcg) => void;

  // Filter options from API
  filterOptions: FilterOption[] | null;
  setFilterOptions: (filters: FilterOption[]) => void;

  // Selected filter values
  selectedFilters: FilterSelection[];
  toggleFilter: (field: string, value: string) => void;
  clearFilters: () => void;

  sortBy: SealedSortOptions;
  setSortBy: (sortBy: SealedSortOptions) => void;

  region: string;
  setRegion: (region: string) => void;
};

export const useSealedSearchStore = create<SearchState>()(
  devtools(
    persist(
      (set, get) => ({
        searchTerm: '',
        productCategory: 'mtg',
        filterOptions: null,
        selectedFilters: [],
        sortBy: 'price-asc',
        region: 'ca',

        setSearchTerm: (term: string) => set({ searchTerm: term }),

        setProductCategory: (productCategory: Tcg) => {
          set({ productCategory });
        },

        setFilterOptions: (filters: FilterOption[]) => {
          set({ filterOptions: filters });
        },

        toggleFilter: (field: string, value: string) => {
          const currentSelections = get().selectedFilters;

          const exists = currentSelections.some(
            (f) => f.field === field && f.value === value
          );

          if (exists) {
            // Remove the selection
            set({
              selectedFilters: currentSelections.filter(
                (f) => !(f.field === field && f.value === value)
              )
            });
          } else {
            // Add the selection
            set({
              selectedFilters: [...currentSelections, { field, value }]
            });
          }
        },

        clearFilters: () => set({ selectedFilters: [] }),

        setSortBy: (sortBy: SealedSortOptions) => set({ sortBy }),
        setRegion: (region: string) => set({ region })
      }),
      {
        name: 'sealed-search-store',
        storage: createJSONStorage(() => ({
          setItem: (key: string, value: string) => {
            const parsedValue = JSON.parse(value);
            localStorage.setItem(
              key,
              JSON.stringify({
                state: parsedValue.state,
                version: SEALED_LOCAL_STORAGE_VERSION
              })
            );
          },
          getItem: (key: string) => {
            const item = localStorage.getItem(key);
            if (!item) return null;

            try {
              const stored = JSON.parse(item);
              if (
                !stored.version ||
                stored.version !== SEALED_LOCAL_STORAGE_VERSION
              ) {
                localStorage.removeItem(key);
                return null;
              }
              return JSON.stringify({ state: stored.state });
            } catch {
              localStorage.removeItem(key);
              return null;
            }
          },
          removeItem: (key: string) => localStorage.removeItem(key)
        })),
        partialize: (state) => ({
          productCategory: state.productCategory,
          region: state.region,
          sortBy: state.sortBy,
          selectedFilters: state.selectedFilters
        })
      }
    )
  )
);
