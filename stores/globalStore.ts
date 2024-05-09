import { create } from 'zustand';
import axiosInstance from '@/utils/axiosWrapper';
import type { Website } from '@/types/index';

type GlobalState = {
  websites: Website[];
  fetchWebsites: () => Promise<void>;
};

const useGlobalStore = create<GlobalState>((set, get) => ({
  websites: [],
  fetchWebsites: async () => {
    try {
      if (get().websites.length > 0) {
        return;
      }
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_SEARCH_URL}/websites`
      );
      response.data.websiteList.sort((a: Website, b: Website) =>
        a.name.localeCompare(b.name)
      );
      set({ websites: response.data.websiteList });
    } catch {
      console.log('getWebsiteInformation or promoMap ERROR');
    }
  }
}));

export default useGlobalStore;
