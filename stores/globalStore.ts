import { create } from 'zustand';
import axiosInstance from '@/utils/axiosWrapper';
import type { Website } from '@/types/index';
import type { AdsResponse } from '@/types/ads';

type GlobalState = {
  websites: Website[];
  adsEnabled: boolean;
  ads: AdsResponse;
  fetchAds: () => Promise<void>;
  getWebsiteName: (websiteCode: string) => string;
  fetchWebsites: () => Promise<void>;
  setAds: (ads: AdsResponse) => void;
};

const useGlobalStore = create<GlobalState>((set, get) => ({
  websites: [],
  adsEnabled: true,
  ads: { position: {} },
  fetchAds: async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/ads`
      );
      set({ ads: response.data });
    } catch {
      console.log('fetchAds ERROR');
    }
  },
  setAds: (ads) => {
    set({ ads });
  },
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
