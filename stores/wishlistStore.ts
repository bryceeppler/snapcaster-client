import { create } from 'zustand';
import axios from 'axios';
import axiosInstance from '@/utils/axiosWrapper';
import { toast } from 'sonner';

type WishlistState = {
    wishlists: any[];
    fetchWishlists: () => void;
    createWishlist: (name: string) => void;
    deleteWishlist: (id: number) => void;
    updateWishlist: (id: number, name: string) => void;
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
            toast.success('Wishlist created');
            get().fetchWishlists();
        } catch (error) {
            console.error(error);
        }
    },
    deleteWishlist: async (id: number) => {
        try {
            const response = await axiosInstance.delete(`${process.env.NEXT_PUBLIC_USER_URL}/wishlist/delete/${id}`);
            toast.success('Wishlist deleted');
            get().fetchWishlists();
        } catch (error) {
            console.error(error);
        }
    },
    updateWishlist: async (id: number, name: string) => {
        try {
            const response = await axiosInstance.put(`${process.env.NEXT_PUBLIC_USER_URL}/wishlist/update/${id}`, { name });
            toast.success('Wishlist updated');
            get().fetchWishlists();
        } catch (error) {
            console.error(error);
        }
    }
}));

export default useWishlistStore;
