import { create } from 'zustand';
import axiosInstance from '@/utils/axiosWrapper';
import type { Website } from '@/types/index';

type GlobalState = {
  websites: Website[];
  adsEnabled: boolean;
  getWebsiteName: (websiteCode: string) => string;
  fetchWebsites: () => Promise<void>;
};

const useGlobalStore = create<GlobalState>((set, get) => ({
  websites: [],
  adsEnabled: false,
  getWebsiteName: (websiteCode: string) => {
    const website = get().websites.find((w) => w.code === websiteCode);
    return website ? website.name : '';
  },
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
