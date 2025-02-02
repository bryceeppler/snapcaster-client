import { create } from 'zustand';
import axios from 'axios';
import { Tcg, BuyListQueryCard } from '@/types/product';
import axiosInstance from '@/utils/axiosWrapper';
import { toast } from 'sonner';
import { BuylistSortOptions, FilterOption } from '@/types/query';

type SubmitBuylistResponse = {
  success: boolean;
  message: string;
};

export interface IBuylistCartItem {
  id: number;
  buylist_cart_id: number;
  game: string;
  base_card_id: number;
  card_name: string;
  set_name: string;
  image: string;
  rarity: string;
  condition_name: string;
  foil: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface IBuylistCart {
  id: number;
  name: string;
  items: IBuylistCartItem[];
}

type BuyListState = {
  //Search State Variables & functions
  searchResults: BuyListQueryCard[] | null;
  currentPage: number;
  numPages: number | null;
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

  //Cart State Variables
  currentCartId: number | null;
  buylistCheckoutBreakdownData: any;
  selectedStoreForReview: string | null;
  setCurrentCartId: (cartId: number | null) => void;
  getCheckoutData: (cartId: number) => Promise<void>;
  setSelectedStoreForReview: (storeName: string) => void;
  submitBuylist: (
    paymentType: 'Cash' | 'Store Credit'
  ) => Promise<SubmitBuylistResponse>;
};

const useBuyListStore = create<BuyListState>((set, get) => ({
  //Search State Variables
  searchResults: null,
  currentPage: 1,
  numPages: 0,
  tcg: 'mtg',
  searchTerm: '',
  sortBy: 'name-asc',
  filters: null,

  //Cart State Variables
  currentCartId: null,
  buylistCheckoutBreakdownData: null,
  selectedStoreForReview: null,

  //////////////////////
  // Search Functions //
  //////////////////////

  fetchCards: async () => {
    if (get().tcg === 'starwars') {
      toast.error('Star Wars will be available soon!');
      return;
    }
    const { filters } = get();
    if (get().searchTerm) {
      const queryParams = new URLSearchParams({
        keyword: get().searchTerm,
        tcg: get().tcg,
        index: `buylists_${get().tcg}_prod`,
        sortBy: get().sortBy,
        pageNumber: get().currentPage.toString(),
        maxResultsPerPage: '100'
      });

      if (filters) {
        filters.forEach((filter) => {
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

      try {
        const response = await axios.get(
          `${
            process.env.NEXT_PUBLIC_BUYLISTS_URL
          }/v2/search?${queryParams.toString()}`
        );

        if (response.status !== 200) {
          console.error('Search API Error:');
          toast.error('Error fetching cards');
          return;
        }

        const filterOptionsFromResponse: FilterOption[] =
          response.data.filters || [];

        set({
          searchResults: response.data.results.slice(0, 500),
          numPages: response.data.pagination.numPages,
          filterOptions: filterOptionsFromResponse,
          filters: filterOptionsFromResponse
        });
      } catch (error) {
        console.error('Search API Error:', error);
        toast.error('Error fetching cards');
      }
    }
  },

  setSearchTerm(searchBoxValue: string) {
    set({ searchTerm: searchBoxValue });
  },
  setCurrentPage(currentPage: number) {
    set({ currentPage: currentPage });
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
    await get().fetchCards();
  },

  setTcg: (tcg: Tcg) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tcg', tcg);
    }
    set({ tcg });
  },
  setSortBy: (sortBy: BuylistSortOptions) => set({ sortBy }),
  clearFilters: () => set({ filters: null }),

  ////////////////////
  // Cart Functions //
  ////////////////////

  setCurrentCartId: (cartId: number | null) => {
    set({ currentCartId: cartId });
  },

  getCheckoutData: async (cartId: number) => {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_BUYLISTS_URL}/v2/carts/${cartId}/checkouts`
      );
      if (response.status === 200) {
        const storeBreakdowns = response.data.data.storeBreakdowns;
        const formattedData = Object.entries(storeBreakdowns).map(
          ([storeName, data]: [string, any]) => ({
            storeName,
            cashSubtotal: data.cashSubtotal.toFixed(2),
            creditSubtotal: data.creditSubtotal.toFixed(2),
            unableToPurchaseItems: data.unableToPurchaseItems,
            items: data.items
          })
        );

        set({ buylistCheckoutBreakdownData: formattedData });
      } else {
        toast.error(
          'Error fetching buylist checkout breakdown data: ' +
            response.statusText
        );
        console.error(
          'Error fetching buylist checkout breakdown data:',
          response
        );
      }
    } catch (error: any) {
      toast.error(
        'Error fetching buylist checkout breakdown data: ' + error.message
      );
      console.error('Error fetching buylist checkout breakdown data:', error);
    }
  },

  setSelectedStoreForReview: (storeName: string) => {
    set({ selectedStoreForReview: storeName });
  },

  submitBuylist: async (paymentType: 'Cash' | 'Store Credit') => {
    const { currentCartId, selectedStoreForReview } = get();
    if (!currentCartId || !selectedStoreForReview) {
      toast.error('No cart or store selected');
      return { success: false, message: 'No cart or store selected' };
    }

    try {
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_BUYLISTS_URL}/v2/carts/${currentCartId}/submit`,
        {
          paymentType,
          store: selectedStoreForReview
        }
      );

      if (response.status === 200) {
        const message =
          response.data?.message || 'Order submitted successfully!';
        toast.success(message);
        return {
          success: true,
          message
        };
      } else {
        const message = response.data?.message || 'Failed to submit order';
        toast.error(message);
        return { success: false, message };
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Error submitting order';
      toast.error(message);
      console.error('Error submitting order:', error);
      return { success: false, message };
    }
  }
}));

export default useBuyListStore;
