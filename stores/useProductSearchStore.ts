import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

import type { FilterOption, ProductSortOptions } from '@/types/query';

const PRODUCT_LOCAL_STORAGE_VERSION = 1;

interface FilterSelection {
  field: string;
  value: string;
}

type ProductSearchStore = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;

  // Filter options from API
  filterOptions: FilterOption[] | null;
  setFilterOptions: (filters: FilterOption[]) => void;

  // Selected filter values
  selectedFilters: FilterSelection[];
  toggleFilter: (field: string, value: string) => void;
  clearFilters: () => void;

  sortBy: ProductSortOptions;
  setSortBy: (sortBy: ProductSortOptions) => void;

  region: string;
  setRegion: (region: string) => void;
};

export const useProductSearchStore = create<ProductSearchStore>()(
  devtools(
    persist(
      (set, get) => ({
        searchTerm: '',
        filterOptions: null,
        selectedFilters: [],
        sortBy: 'price-asc',
        region: 'ca',

        setSearchTerm: (term: string) => set({ searchTerm: term }),

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

        setSortBy: (sortBy: ProductSortOptions) => set({ sortBy }),
        setRegion: (region: string) => set({ region })
      }),
      {
        name: 'product-search-store',
        storage: createJSONStorage(() => ({
          setItem: (key: string, value: string) => {
            const parsedValue = JSON.parse(value);
            localStorage.setItem(
              key,
              JSON.stringify({
                state: parsedValue.state,
                version: PRODUCT_LOCAL_STORAGE_VERSION
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
                stored.version !== PRODUCT_LOCAL_STORAGE_VERSION
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
          region: state.region,
          sortBy: state.sortBy,
          selectedFilters: state.selectedFilters
        })
      }
    )
  )
);