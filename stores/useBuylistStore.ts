import { toast } from 'sonner';
import { create } from 'zustand';

import type { Tcg } from '@/types/product';
import type { FilterOption } from '@/types/query';
import axiosInstance from '@/utils/axiosWrapper';

export type BuylistUIState =
  | 'listSelectionState'
  | 'searchResultsState'
  | 'viewAllOffersState'
  | 'finalSubmissionState';

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
  openCart: boolean;
  setOpenCart: (open: boolean) => void;

  openListSelection: boolean;
  setOpenListSelection: (open: boolean) => void;
  /////////////////////////////////////////
  //1. Search State Variables & functions//
  /////////////////////////////////////////
  tcg: Tcg;
  setTcg: (tcg: Tcg) => void;

  searchTerm: string;
  setSearchTerm: (searchBoxValue: string) => void;

  searchResultCount: number;
  setSearchResultCount: (count: number) => void;

  defaultSortBy: string | null;
  setDefaultSortBy: (sortBy: string | null) => void;

  sortBy: string | null;
  setSortBy: (sortBy: string | null) => void;

  sortByOptions: Record<string, string>;
  setSortByOptions: (sortOptions: Record<string, string>) => void;

  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  filters: FilterOption[] | null;
  setFilter: (filterField: string, value: string, selected: boolean) => void;

  filterOptions?: FilterOption[];
  setFilterOptions: (filters: FilterOption[]) => void;

  clearFilters: () => void;
  ////////////////////////////////////////////////////////
  //2. Step, current Cart, and offers states & functions//
  ///////////////////////////////////////////////////////
  buylistUIState: BuylistUIState;
  setBuylistUIState: (sideBarMode: BuylistUIState) => void;

  currentCartId: number | null;
  setCurrentCartId: (cartId: number | null) => void;

  currentCart: IBuylistCart | null;
  setCurrentCart: (cart: IBuylistCart | null) => void;

  reviewData: any;
  setAllCartsData: (cartId: number | null) => Promise<void>;

  selectedStoreForReview: string | null;
  setSelectedStoreForReview: (storeName: string) => void;
  submitBuylist: (
    paymentType: 'Cash' | 'Store Credit'
  ) => Promise<SubmitBuylistResponse>;
};

const useBuyListStore = create<BuyListState>((set, get) => ({
  buylistUIState: 'listSelectionState',
  openCart: false,
  setOpenCart: (open: boolean) => set({ openCart: open }),
  openListSelection: false,
  setOpenListSelection: (open: boolean) => set({ openListSelection: open }),
  //Search State Variables
  searchTerm: '',
  searchResultCount: 0,
  tcg: 'mtg',
  defaultSortBy: null,
  sortBy: null,
  sortByOptions: {},
  filters: null,
  isLoading: false,
  //Cart State Variables
  currentCartId: null,
  currentCart: null,
  //Review State Variables
  reviewData: null,
  selectedStoreForReview: null,

  //////////////////////
  // Search Functions //
  //////////////////////
  setIsLoading: (loading: boolean) => set({ isLoading: loading }),

  setSearchResultCount: (count: number) => set({ searchResultCount: count }),

  setSearchTerm(searchBoxValue: string) {
    set({ searchTerm: searchBoxValue });
  },

  setTcg: (tcg: Tcg) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tcg', tcg);
    }
    set({ tcg });
  },

  setSortBy: (sortBy: string | null) => {
    set({ sortBy: sortBy });
  },

  setFilterOptions: (filters: FilterOption[]) => {
    set({ filterOptions: filters });
  },

  setFilter: (filterField: string, value: string, selected: boolean) => {
    const currentFilters = get().filters || [];
    const filterExists = currentFilters.some(
      (filter) =>
        filter.field === filterField &&
        filter.values.some((v) => v.value === value)
    );

    if (!filterExists && selected) {
      // Add new filter if it doesn't exist and selected is true
      set({
        filters: [
          ...currentFilters,
          {
            field: filterField,
            values: [{ value, selected: true }]
          } as FilterOption
        ]
      });
    } else {
      // Update existing filter with the selected value
      set({
        filters: currentFilters.map((filter) => {
          if (filter.field === filterField) {
            return {
              ...filter,
              values: filter.values.map((v) =>
                v.value === value ? { ...v, selected } : v
              )
            };
          }
          return filter;
        })
      });
    }
  },
  setSortByOptions: (sortByOptions: Record<string, string>) => {
    set({ sortByOptions: sortByOptions });
  },

  clearFilters: () => set({ filters: null }),

  setCurrentCartId: (cartId: number | null) => {
    set({ currentCartId: cartId });
  },

  setAllCartsData: async (cartId: number | null) => {
    if (cartId === null) {
      set({ reviewData: [] });
      return;
    }
    try {
      // Add a small delay to ensure the cart update has propagated
      await new Promise((resolve) => setTimeout(resolve, 100));

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

        set({ reviewData: formattedData });
      } else {
        toast.error(
          'Error fetching buylist checkout breakdown data: ' +
            response.statusText
        );
      }
    } catch (error: any) {
      toast.error(
        'Error fetching buylist checkout breakdown data: ' + error.message
      );
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
      return { success: false, message };
    }
  },
  setBuylistUIState: (buylistUIState: BuylistUIState) => {
    set({ buylistUIState: buylistUIState });
  },
  setDefaultSortBy: (sortBy: string | null) => {
    set({ defaultSortBy: sortBy });
  },
  setCurrentCart: (cart: IBuylistCart | null) => {
    set({ currentCart: cart });
  }
}));

export default useBuyListStore;
