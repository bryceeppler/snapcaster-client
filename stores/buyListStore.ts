import { create } from 'zustand';
import axios from 'axios';
import { Tcg, BuyListQueryCard } from '@/types/product';
import axiosInstance from '@/utils/axiosWrapper';
import { toast } from 'sonner';
import { BuylistSortOptions, FilterOption } from '@/types/query';
import { Mode } from '@/types/buylists';

type SubmitBuylistResponse = {
  success: boolean;
  message: string;
};

export interface IBuylistCartItem {
  buylist_cart_id: string;
  base_card_id: string;
  card_name: string;
  set_name: string;
  game: string;
  rarity: string;
  condition_name: string;
  foil: string;
  quantity: number;
  image: string;
}

export interface IBuylistCart {
  id: string;
  name: string;
  items: IBuylistCartItem[];
}

type BuyListState = {
  //Search State Variables & functions
  searchResults: BuyListQueryCard[] | null;
  currentPage: number;
  numPages: number | null;
  numResults: number;
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

  //Cart State Variables & Functions
  mode: Mode;
  carts: IBuylistCart[];
  currentCart: any;
  currentCartData: any[];
  buylistCheckoutBreakdownData: any;
  selectedStoreForReview: string | null;
  setMode: (mode: Mode) => void;
  fetchCarts: () => Promise<void>;
  getCartData: (cartId: string) => Promise<void>;
  setCurrentCart: (cart: IBuylistCart | null) => void;
  createCart: (cartName: string) => Promise<void>;
  deleteCart: (cartId: number) => Promise<void>;
  renameCart: (cartData: any) => Promise<boolean>;
  getCheckoutData: (cartId: string) => Promise<void>;
  setSelectedStoreForReview: (storeName: string) => void;
  submitBuylist: (
    paymentType: 'Cash' | 'Credit'
  ) => Promise<SubmitBuylistResponse>;
  pendingUpdates: { [key: string]: number };
  updateCartItemPending: (card: any, quantity: number) => void;
  updateCartItemAPI: (card: any, quantity: number) => Promise<void>;
};

const useBuyListStore = create<BuyListState>((set, get) => ({
  //Search State Variables
  searchResults: null,
  currentPage: 1,
  numPages: 0,
  numResults: 0,
  tcg: 'mtg',
  searchTerm: '',
  sortBy: 'name-asc',
  filters: null,

  //Cart State Variables
  mode: 'cart',
  carts: [],
  currentCart: null,
  currentCartData: [],
  buylistCheckoutBreakdownData: null,
  selectedStoreForReview: null,

  pendingUpdates: {},

  //////////////////////
  // Search Functions //
  //////////////////////

  fetchCards: async () => {
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
        }/v2/search?${queryParams.toString()}`
      );

      if (response.status !== 200) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const filterOptionsFromResponse: FilterOption[] =
        response.data.filters || [];

      set({
        searchResults: response.data.results.slice(0, 500),
        numPages: response.data.pagination.numPages,
        numResults: response.data.pagination.numResults,
        filterOptions: filterOptionsFromResponse,
        filters: filterOptionsFromResponse
      });
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
    const { tcg, searchTerm, filters, sortBy } = get();
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
        }/v2/search?${queryParams.toString()}`
      );

      if (response.status !== 200) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const updatedSearchResults = response.data.results.map((item: any) => ({
        ...item,
        promoted: false
      }));

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
  clearSearchResults: () => set({ searchResults: null }),

  ////////////////////
  // Cart Functions //
  ////////////////////
  setMode: (mode: Mode) => {
    set({ mode });
  },

  fetchCarts: async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_BUYLISTS_URL}/v2/carts`
      );
      if (response.status === 200) {
        set({ carts: response.data.carts });
        if (
          get().currentCart === null &&
          Object.keys(response.data.carts).length > 0
        ) {
          get().setCurrentCart(response.data.carts[0]);
          get().getCartData(response.data.carts[0].id);
        }
      }
    } catch (error: any) {
      toast.error('Error fetching carts: ' + error.message);
      console.error('Error fetching carts:', error);
    }
  },
  setCurrentCart: (cart: IBuylistCart | null) => {
    if (!cart) {
      set({ currentCart: null });
      return;
    }
    set({
      currentCart: {
        ...cart
      }
    });
    if (cart.id) {
      get().getCartData(cart.id);
    }
  },
  createCart: async (cartName: string) => {
    try {
      const body = {
        cartName: cartName
      };
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_BUYLISTS_URL}/v2/carts`,
        body
      );
      if (response.status === 201) {
        toast.success('Cart created successfully');
        await get().fetchCarts();
        // Find the newly created cart and set it as current
        const newCart = get().carts.find((cart: any) => cart.name === cartName);
        if (newCart) {
          get().setCurrentCart(newCart);
        }
      } else {
        toast.error('Error creating cart');
      }
    } catch (error: any) {
      toast.error('Error creating cart: ' + error.message);
      console.error('Error creating cart:', error);
    }
  },
  deleteCart: async (cartId: number) => {
    try {
      const response = await axiosInstance.delete(
        `${process.env.NEXT_PUBLIC_BUYLISTS_URL}/v2/carts/${cartId}`
      );
      if (response.status === 200) {
        // First set currentCart to null to avoid stale state
        set({ currentCart: null, currentCartData: [] });
        toast.success('Cart deleted successfully');

        // Fetch latest carts
        await get().fetchCarts();

        // After fetch completes, check if there are any carts
        const remainingCarts = get().carts;
        if (remainingCarts && remainingCarts.length > 0) {
          // Set the first cart as current if any exist
          get().setCurrentCart(remainingCarts[0]);
        }
      }
    } catch (error: any) {
      toast.error('Error deleting cart: ' + error.message);
      console.error('Error deleting cart:', error);
    }
  },
  renameCart: async (cartData: any) => {
    try {
      const body = {
        cartName: cartData.name.trim()
      };
      const response = await axiosInstance.patch(
        `${process.env.NEXT_PUBLIC_BUYLISTS_URL}/v2/carts/${cartData.id}`,
        body
      );
      if (response.status === 200) {
        toast.success('Cart renamed successfully');
        await get().fetchCarts();
        const updatedCart = Object.values(get().carts).find(
          (cart: any) => cart.id === cartData.id
        );
        if (updatedCart) {
          get().setCurrentCart(updatedCart);
        }
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error('Error renaming cart: ' + error.message);
      console.error('Error renaming cart:', error);
      return false;
    }
  },
  getCartData: async (cartId: string) => {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_BUYLISTS_URL}/v2/carts/${cartId}/cards`
      );
      if (response.status === 200) {
        set({ currentCartData: response.data.items });
      }
    } catch (error: any) {
      toast.error('Error fetching cart data: ' + error.message);
      console.error('Error fetching cart data:', error);
    }
  },
  getCheckoutData: async (cartId: string) => {
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

  updateCartItemPending: (card: any, quantity: number) => {
    const { currentCartData } = get();
    if (quantity < 0) {
      quantity = 0;
    }
    if (quantity > 99) {
      toast.error('Maximum quantity is 99');
      return;
    }

    if (quantity === 0) {
      const filteredItems = (currentCartData || []).filter(
        (item: any) =>
          !(
            item.card_name === card.card_name &&
            item.condition_name === card.condition_name &&
            item.set_name === card.set_name &&
            item.foil === card.foil &&
            item.rarity === card.rarity &&
            item.image === card.image
          )
      );
      set({ currentCartData: filteredItems });
    } else {
      const existingItemIndex = (currentCartData || []).findIndex(
        (item: any) =>
          item.card_name === card.card_name &&
          item.condition_name === card.condition_name &&
          item.set_name === card.set_name &&
          item.foil === card.foil &&
          item.rarity === card.rarity
      );

      if (existingItemIndex === -1) {
        // Card doesn't exist in cart yet, add it
        set({
          currentCartData: [...(currentCartData || []), { ...card, quantity }]
        });
      } else {
        // Card exists, update its quantity
        const updatedCartData = [...(currentCartData || [])];
        updatedCartData[existingItemIndex] = {
          ...updatedCartData[existingItemIndex],
          quantity
        };
        set({ currentCartData: updatedCartData });
      }
    }
  },

  updateCartItemAPI: async (card: any, quantity: number) => {
    const { currentCart, getCartData } = get();
    if (!currentCart) return;

    try {
      const response = await axiosInstance.put(
        `${process.env.NEXT_PUBLIC_BUYLISTS_URL}/v2/carts/${currentCart.id}/cards`,
        { ...card, quantity }
      );

      if (response.status === 200) {
        await getCartData(currentCart.id);
      }
    } catch (error: any) {
      toast.error('Error updating cart item: ' + error.message);
      console.error('Error updating cart item:', error);
      await getCartData(currentCart.id);
    }
  },

  submitBuylist: async (paymentType: 'Cash' | 'Credit') => {
    const { currentCart, selectedStoreForReview } = get();
    if (!currentCart || !selectedStoreForReview) {
      toast.error('No cart or store selected');
      return { success: false, message: 'No cart or store selected' };
    }

    try {
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_BUYLISTS_URL}/v2/carts/${currentCart.id}/submit`,
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
