import { create } from 'zustand';
import axios from 'axios';
import axiosInstance from '@/utils/axiosWrapper';

type WishlistState = {
    wishlists: any[];
    fetchWishlists: () => void;
    createWishlist: (name: string) => void;
    deleteWishlist: (id: string) => void;
    updateWishlist: (id: string, name: string) => void;
};
// const response = await axiosInstance.post(
//     `${process.env.NEXT_PUBLIC_SEARCH_URL}/bulk`,
//     {
//       cardNames: filteredCardNames,
//       websites: websiteCodes,
//       worstCondition: 'nm'
//     }
//   );
const useWishlistStore = create<WishlistState>((set, get) => ({
    wishlists: [],
    fetchWishlists: async () => {
        try {
            const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_USER_URL}/wishlist/user`);
            set({ wishlists: response.data });
        } catch (error) {
            console.error(error);
        }
    },
    createWishlist: async (name: string) => {
        try {
            const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_USER_URL}/wishlist/create`, { name });
            get().fetchWishlists();
        } catch (error) {
            console.error(error);
        }
    },
    deleteWishlist: async (id: string) => {
        try {
            const response = await axiosInstance.delete(`/wishlists/${id}`);
            get().fetchWishlists();
        } catch (error) {
            console.error(error);
        }
    },
    updateWishlist: async (id: string, name: string) => {
        try {
            const response = await axiosInstance.put(`/wishlists/${id}`, { name });
            get().fetchWishlists();
        } catch (error) {
            console.error(error);
        }
    }
}));

export default useWishlistStore;
