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
  foil: boolean;
  price: number;
  priceBeforeDiscount: number;
  website: string;
  s3_image_url?: string;
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
const websiteList: Filter[] = [];
const promoMap: PromoMap = {};

type State = {
  websites: Website[];
  promoMap: PromoMap;
  getWebsiteNameByCode: (code: string) => string;

  initWebsiteInformation: () => Promise<void>;
};

export const useStore = create<State>((set, get) => ({
  getWebsiteNameByCode: (code: string) => {
    return get().websites.find((w) => w.code === code)?.name || '';
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
        if (website['promoCode'] !== null) {
          tempMap[website['code']] = {
            promoCode: website['promoCode'],
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
