import { create } from 'zustand';
import axiosInstance from '@/utils/axiosWrapper';

export type PopularCard = {
  name: string;
  image_url: string;
};

type GlobalState = {
  popularCards: PopularCard[];
  fetchPopularCards: () => void;
};

const useGlobalStore = create<GlobalState>((set, get) => ({
  popularCards: [],
  fetchPopularCards: async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_ANALYTICS_URL}/search/popular`
      );
      set({ popularCards: response.data });
    } catch (error) {
      console.error(error);
    }
  }
}));

export default useGlobalStore;
