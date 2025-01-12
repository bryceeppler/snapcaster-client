import { create } from 'zustand';
import axios from 'axios';
import { Tcg, BuyListQueryCard } from '@/types/product';
import axiosInstance from '@/utils/axiosWrapper';
import { toast } from 'sonner';
import { BuylistSortOptions, FilterOption } from '@/types/query';

// Need to add local storage logic for last selected TCG
type BuyListState = {
  searchResults: BuyListQueryCard[]| null;
  currentPage: number; 
  numPages: number | null;
  numResults:number ;
  filterOptions?: FilterOption[];
  tcg: Tcg;
  searchTerm: string;
  sortBy: BuylistSortOptions;
  filters: FilterOption[] | null;
  setSortBy: (sortBy: BuylistSortOptions) => void;
  setTcg: (tcg: Tcg) => void;
  setCurrentPage: (currentPage: number) => void;
  setSearchTerm: (searchBoxValue: string) => void;
  fetchCards: () => Promise<void>;
  setFilter: (filterField: string, value: string, selected: boolean) => void;
  clearFilters: () => void;
  applyFilters: () => Promise<void>;
  clearSearchResults: () => void;
};

const useBuyListStore = create<BuyListState>((set, get) => ({

  searchResults: null,
  currentPage: 1,
  numPages:0,
  numResults:0,
  tcg: 'mtg',
  searchTerm: '',
  sortBy: 'name-asc',
  filters: null,
  
  fetchCards: async () => {
    const {  filters } = get();
    if (get().searchTerm) {
      const queryParams = new URLSearchParams({
        keyword: get().searchTerm,
        tcg: get().tcg,
        sortBy: get().sortBy,
        pageNumber:get().currentPage.toString(),
        maxResultsPerPage:'100',

      });
      if (filters) {
        Object.entries(filters).forEach(([index, filter]) => {
          filter.values.forEach((value) => {
            if (value.selected) {
              queryParams.append(
                `filterSelections[${filter.field}][]`,
                value.value
              );
            }
          });
        });
      }
      const response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_BUYLISTS_URL
        }/search?${queryParams.toString()}`
      );

      if (response.status !== 200) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const filterOptionsFromResponse: FilterOption[] =
      response.data.filters || [];

      set({
        searchResults: response.data.results.slice(0, 500),
        numPages:response.data.pagination.numPages,
        numResults:response.data.pagination.numResults,
        filterOptions: filterOptionsFromResponse,
        filters: filterOptionsFromResponse,
      });
    }
  },

  setSearchTerm(searchBoxValue: string) {
    set({ searchTerm: searchBoxValue });
  },
  setCurrentPage(currentPage:number){
    set({currentPage:currentPage})
  },

  setFilter: (filterField: string, value: string, selected: boolean) => {
    const filters = get().filters || [];
    const updatedFilters = filters.map((filter) => {
      if (filter.field === filterField) {
        const updatedValues = filter.values.map((option) => {
          if (option.value === value) {
            return { ...option, selected };
          }
          return option;
        });
        return { ...filter, values: updatedValues };
      }
      return filter;
    });
    set({ filters: updatedFilters });
  },
  applyFilters: async () => {
    const { tcg, searchTerm, filters, sortBy, } = get();
    try {
      const queryParams = new URLSearchParams({
        index: `buylists_${tcg}*`,
        keyword: searchTerm.trim(),
        sortBy: `${sortBy}`,
        maxResultsPerPage: '100',
        pageNumber: get().currentPage.toString()
      });

      if (filters) {
        Object.entries(filters).forEach(([index, filter]) => {
          filter.values.forEach((value) => {
            if (value.selected) {
              queryParams.append(
                `filterSelections[${filter.field}][]`,
                value.value
              );
            }
          });
        });
      }

      const response = await axiosInstance.get(
        `${
          process.env.NEXT_PUBLIC_BUYLISTS_URL
        }/search?${queryParams.toString()}`
      );

      if (response.status !== 200) {
        throw new Error(
          `Error: ${response.status} - ${response.statusText}`
        );
      }

      const updatedSearchResults = response.data.results.map(
        (item: any) => ({
          ...item,
          promoted: false
        })
      );

      const filterOptionsFromResponse: FilterOption[] =
        response.data.filters || [];

      set({
        searchResults: updatedSearchResults,
        filters: filterOptionsFromResponse,
        tcg: tcg,
        filterOptions: filterOptionsFromResponse,
        numPages: response.data.pagination.numPages,
        numResults: response.data.pagination.numResults
      });
    } catch (error: any) {
      console.error('Error fetching cards:', error);
      toast.error('Unable to fetch cards: ' + error.message);
    }
  },
  setTcg: (tcg: Tcg) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tcg', tcg);
    }
    set({ tcg });
  },
  setSortBy: (sortBy: BuylistSortOptions) => set({ sortBy }),
  clearFilters: () => set({ filters: null }),
  clearSearchResults: () =>
    set({ searchResults: null }),

  
}));
export default useBuyListStore;
