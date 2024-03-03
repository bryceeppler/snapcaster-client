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
  }
  type WishlistCard = {
    wishlist_item_id: number;
    card_name: string;
    oracle_id: string;
    cheapest_price_doc: PriceEntry;
    
  }
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
    setAddCardInput: (input: string) => void;
    addCardToWishlist: (id: number, cardName: string) => void;
    fetchWishlists: () => void;
    fetchWishlistView: (id: number) => void;
    createWishlist: (name: string) => void;
    deleteWishlist: (id: number) => void;
    updateWishlist: (id: number, name: string) => void;
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
    addCardInput: '',
    setAddCardInput: (input: string) => {
        set({ addCardInput: input });
    },
    addCardToWishlist: async (id: number, cardName: string) => {
        try {
            const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_WISHLIST_URL}/add/${id}`, { cardName });
            toast.success('Card added to wishlist');
            get().fetchWishlistView(id);
        } catch (error) {
            console.error(error);
        }
    },
    fetchWishlists: async () => {
        try {
            const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_WISHLIST_URL}/user`);
            set({ wishlists: response.data });
        } catch (error) {
            console.error(error);
        }
    },
    fetchWishlistView: async (id: number) => {
        try {
            const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_WISHLIST_URL}/view/${id}`);
            set({ wishlistView: response.data });
            console.log(response.data)
        } catch (error) {
            console.error(error);
        }
    },
    createWishlist: async (name: string) => {
        try {
            const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_WISHLIST_URL}/create`, { name });
            toast.success('Wishlist created');
            get().fetchWishlists();
        } catch (error) {
            console.error(error);
        }
    },
    deleteWishlist: async (id: number) => {
        try {
            const response = await axiosInstance.delete(`${process.env.NEXT_PUBLIC_WISHLIST_URL}/delete/${id}`);
            toast.success('Wishlist deleted');
            get().fetchWishlists();
        } catch (error) {
            console.error(error);
        }
    },
    updateWishlist: async (id: number, name: string) => {
        try {
            const response = await axiosInstance.put(`${process.env.NEXT_PUBLIC_WISHLIST_URL}/update/${id}`, { name });
            toast.success('Wishlist updated');
            get().fetchWishlists();
        } catch (error) {
            console.error(error);
        }
    }
}));

export default useWishlistStore;