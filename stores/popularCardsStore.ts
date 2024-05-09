import { create } from 'zustand';
import axiosInstance from '@/utils/axiosWrapper';

export type PopularCard = {
  name: string;
  image_url: string;
};

type PopularCardsState = {
  popularCards: PopularCard[];
  popularCardsLoading: boolean;
  fetchPopularCards: () => void;
};

const usePopularCardsStore = create<PopularCardsState>((set, get) => ({
  popularCards: [],
  popularCardsLoading: false,
  fetchPopularCards: async () => {
    try {
      set({ popularCardsLoading: true });
      console.log('fetching popular cards');
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_ANALYTICS_URL}/search/popular`
      );
      set({ popularCards: response.data });
      console.log('fetched popular cards');
      set({ popularCardsLoading: false });
    } catch (error) {
      console.error(error);
    }
  }
}));

export default usePopularCardsStore;
