import { create } from 'zustand';
import axios from 'axios';
import axiosInstance from '@/utils/axiosWrapper';
import { toast } from 'sonner';
type PriceEntry = {
  _id: string;
  website: string;
  name: string;
  image: string;
  link: string;
  price: number;
  set: string;
  condition: string;
  timestamp: string;
  foil: boolean;
};
export type WishlistCard = {
  wishlist_item_id: number;
  quantity: number;
  card_name: string;
  oracle_id: string;
  target_price: number;
  minimum_condition: string;
  cheapest_price_doc: PriceEntry;
  email_notifications: boolean;
};
type WishlistView = {
  wishlist_id: number;
  name: string;
  updated_at: string;
  created_at: string;
  item_count: number;
  items: WishlistCard[];
};
type WishlistState = {
  wishlists: any[];
  wishlistView: WishlistView;
  addCardInput: string;
  deleteWishlistItem: (wishlist_item_id: number) => void;
  setAddCardInput: (input: string) => void;
  addCardToWishlist: (id: number, cardName: string) => void;
  fetchWishlists: () => void;
  fetchWishlistView: (id: number) => void;
  fetching: boolean;
  createWishlist: (name: string) => void;
  deleteWishlist: (id: number) => void;
  updateWishlist: (id: number, name: string) => void;
  updateWishlistItem: (
    wishlistItemId: number,
    quantity: number,
    minimumCondition: string,
    targetPrice: number,
    emailNotifications: boolean
  ) => void;
};

const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlists: [],
  wishlistView: {
    wishlist_id: 0,
    name: '',
    updated_at: '',
    created_at: '',
    item_count: 0,
    items: []
  },
  fetching: false,
  addCardInput: '',
  setAddCardInput: (input: string) => {
    set({ addCardInput: input });
  },
  addCardToWishlist: async (wishlistId: number, oracleId: string) => {
    if (get().wishlistView.item_count >= 100) {
      toast.error('Wishlist is full (100 items max)');
      return;
    }
    try {
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_WISHLIST_URL}/wishlist-item/create`,
        {
          wishlist_id: wishlistId,
          oracle_id: oracleId,
          quantity: 1,
          minimum_condition: 'NM'
        }
      );
      toast.success('Card added to wishlist');
      get().fetchWishlistView(wishlistId);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 409) {
          toast.error('Card already in wishlist');
        } else if (error.response?.data.message) {
          toast.error(`${error.response?.data.message}`);
        } else {
          toast.error(
            'An error occurred while adding the card to the wishlist'
          );
        }
      } else {
        toast.error('An unexpected error occurred');
      }
      console.error(error);
    }
  },
  deleteWishlistItem: async (wishlistItemId: number) => {
    try {
      const response = await axiosInstance.delete(
        `${process.env.NEXT_PUBLIC_WISHLIST_URL}/wishlist-item/delete/${wishlistItemId}`
      );
      toast.success('Card removed from wishlist');
      get().fetchWishlistView(get().wishlistView.wishlist_id);
    } catch (error) {
      console.error(error);
    }
  },
  fetchWishlists: async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_WISHLIST_URL}/user`
      );
      set({ wishlists: response.data });
    } catch (error) {
      console.error(error);
    }
  },
  fetchWishlistView: async (id: number) => {
    try {
      // set fetching = true
      set({ fetching: true });
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_WISHLIST_URL}/view/${id}`
      );
      set({ wishlistView: response.data });
      set({ fetching: false });
    } catch (error) {
      set({ fetching: false });
      console.error(error);
      toast.error('Failed to fetch updated wishlist view');
    }
  },
  createWishlist: async (name: string) => {
    try {
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_WISHLIST_URL}/create`,
        { name }
      );
      toast.success('Wishlist created');
      get().fetchWishlists();
    } catch (error) {
      console.error(error);
    }
  },
  deleteWishlist: async (id: number) => {
    try {
      const response = await axiosInstance.delete(
        `${process.env.NEXT_PUBLIC_WISHLIST_URL}/delete/${id}`
      );
      toast.success('Wishlist deleted');
      get().fetchWishlists();
    } catch (error) {
      console.error(error);
    }
  },
  updateWishlist: async (id: number, name: string) => {
    try {
      const response = await axiosInstance.put(
        `${process.env.NEXT_PUBLIC_WISHLIST_URL}/update/${id}`,
        { name }
      );
      if (response.status === 200) {
        toast.success('Wishlist updated');
        await get().fetchWishlistView(id); // Make sure to await this fetch call
      } else {
        toast.error('Wishlist update was not successful');
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
      console.error(error);
    }
  },
  updateWishlistItem: async (
    wishlistItemId: number,
    quantity: number,
    minimumCondition: string,
    targetPrice: number,
    emailNotifications: boolean
  ) => {
    try {
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_WISHLIST_URL}/wishlist-item/update/${wishlistItemId}`,
        // only include the fields if they are not undefined
        {
          quantity,
          minimum_condition: minimumCondition,
          target_price: targetPrice,
          email_notifications: emailNotifications
        }
      );
      toast.success('Wishlist item updated');
      get().fetchWishlistView(get().wishlistView.wishlist_id);
    } catch (error) {
      console.error(error);
    }
  }
}));

export default useWishlistStore;
