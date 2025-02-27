import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { FilterOption, SingleSortOptions } from '@/types/query';
import { Tcg } from '@/types';

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

  sortBy: SingleSortOptions;
  setSortBy: (sortBy: SingleSortOptions) => void;

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
          if (typeof window !== 'undefined') {
            localStorage.setItem('productCategory', productCategory);
          }
          set({ productCategory });
        },

        setFilterOptions: (filters: FilterOption[]) => {
          set({ filterOptions: filters });
        },

        toggleFilter: (field: string, value: string) => {
          const currentSelections = get().selectedFilters;
          const selectionKey = `${field}:${value}`;

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

        setSortBy: (sortBy: SingleSortOptions) => set({ sortBy }),
        setRegion: (region: string) => set({ region })
      }),
      {
        name: 'sealed-search-store',
        storage: createJSONStorage(() => localStorage),
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
