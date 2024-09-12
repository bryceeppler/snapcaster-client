import { create } from 'zustand';
import axiosInstance from '@/utils/axiosWrapper';
import type { Website } from '@/types/index';

export interface PromoInformation {
  promoCode: string;
  discount: number;
}
export interface PromoMap {
  [key: string]: PromoInformation;
}
export interface Filter {
  name: string;
  abbreviation: string;
}

export interface SingleSearchResult {
  name: string;
  link: string;
  image: string;
  set: string;
  condition: string;
  foil: string;
  price: number;
  priceBeforeDiscount: number;
  website: string;
  s3_image_url?: string;
  collector_number: string;
  frame: string;
  showcase: string;
  promo: string;
  alternate_art: string;
  art_series: string;
}

export type MultiSearchCard = {
  cardName: string;
  variants: SingleSearchResult[];
};

export type MultiSearchCardState = {
  cardName: string;
  variants: SingleSearchResult[];
  selectedVariant: SingleSearchResult;
  selected: boolean;
};

const websites: Website[] = [];

const promoMap: PromoMap = {};

type State = {
  websites: Website[];
  promoMap: PromoMap;
  getWebsiteNameByCode: (slug: string) => string;

  initWebsiteInformation: () => Promise<void>;
};

export const useStore = create<State>((set, get) => ({
  getWebsiteNameByCode: (slug: string) => {
    return get().websites.find((w) => w.slug === slug)?.name || '';
  },

  websites: websites,
  promoMap: promoMap,

  initWebsiteInformation: async () => {
    
    try {
      if (get().websites.length > 0) {
        return;
      }
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_SEARCH_URL}/websites`
      );
      let data = response.data;
      set({ websites: data.websiteList });
      let tempMap: PromoMap = {};
      for (const website of data.websiteList) {
        if (website['code'] !== null) {
          tempMap[website['slug']] = {
            promoCode: website['code'],
            discount: website['discount']
          };
        }
      }
      set({ promoMap: tempMap });
    } catch {
      console.log('getWebsiteInformation or promoMap ERROR');
    }
  }
}));
