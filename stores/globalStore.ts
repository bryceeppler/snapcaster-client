// globalStore.ts
import { create } from 'zustand';
import axiosInstance from '@/utils/axiosWrapper';
import type { Website } from '@/types/index';
import { devtools } from 'zustand/middleware';
import type { Ad, AdsResponse } from '@/types/ads';

type GlobalState = {
  websites: Website[];
  adsEnabled: boolean;
  ads: AdsResponse;
  getWebsiteName: (websiteCode: string) => string;
  getFeedAds: () => Ad[];
  getRandomAd: (position: string) => Ad;
};

const useGlobalStore = create<GlobalState>()(devtools((set, get) => {
  // Fetch websites during store initialization
  (async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_SEARCH_URL}/websites`
      );
      const websites = response.data.websiteList.sort((a: Website, b: Website) =>
        a.name.localeCompare(b.name)
      );
      set({ websites });
    } catch (error) {
      console.error('Error fetching websites:', error);
    }
  })();

  // Fetch ads during store initialization
  (async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/ads`
      );
      set({ ads: response.data });
    } catch (error) {
      console.error('Error fetching ads:', error);
    }
  })();

  return {
    websites: [],
    adsEnabled: true,
    ads: { position: {} },
    getWebsiteName: (websiteCode: string) => {
      const website = get().websites.find((w) => w.slug === websiteCode);
      return website ? website.name : '';
    },
    getFeedAds: () => {
      return get().ads.position['5'].ads;
    },
    getRandomAd: (position: string) => {
      const ads = get().ads.position[position].ads;
      const randomIndex = Math.floor(Math.random() * ads.length);
      return ads[randomIndex];
    },
  };
}));

export default useGlobalStore;
