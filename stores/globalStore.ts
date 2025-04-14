// globalStore.ts
import { create } from 'zustand';
import axiosInstance from '@/utils/axiosWrapper';
import type { Website } from '@/types/index';
import { devtools } from 'zustand/middleware';
import type { Ad, AdsResponse } from '@/types/ads';
import { Vendor, vendorService } from '@/services/vendorService';
type GlobalState = {
  vendors: Vendor[];
  adsEnabled: boolean;
  ads: AdsResponse;
  notificationStatus: boolean;
  getVendorBySlug: (slug: string) => Vendor | undefined;
  getVendorNameBySlug: (slug: string) => string;
  initNotificationStatus: () => void;
  setNotificationStatusFalse: () => void;
  getFeedAds: () => Ad[];
  getRandomAd: (position: string) => Ad;
};

const useGlobalStore = create<GlobalState>()(
  devtools((set, get) => {
    // Fetch websites during store initialization
    (async () => {
      try {
        const response = await vendorService.getAllVendors();
        set({ vendors: response });
      } catch (error) {
        console.error('Error fetching vendors:', error);
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
      vendors: [],
      notificationStatus: false,
      adsEnabled: true,
      ads: { position: {} },
      getVendorBySlug: (slug: string) => {
        return get().vendors.find((vendor) => vendor.slug === slug);
      },
      getVendorNameBySlug: (slug: string) => {
        const vendor = get().vendors.find((vendor) => vendor.slug === slug);
        return vendor ? vendor.name : 'Vendor not found';
      },
      getFeedAds: () => {
        return get().ads.position['5'].ads;
      },
      getRandomAd: (position: string) => {
        const ads = get().ads.position[position].ads;
        const randomIndex = Math.floor(Math.random() * ads.length);
        return ads[randomIndex];
      },
      initNotificationStatus: () => {
        const navNotification = localStorage.getItem('notificationStatus');

        if (navNotification === null) {
          // If not set, initialize to false
          localStorage.setItem('notificationStatus', JSON.stringify(true));
          set({ notificationStatus: true });
          return;
        }
        const parsedValue = JSON.parse(navNotification);
        if (parsedValue === true) {
          set({ notificationStatus: true });
        } else if (parsedValue === false) {
          set({ notificationStatus: false });
        } else {
          // Handle unexpected value (optional)
          console.warn(
            'Unexpected value found in navNotification, resetting to false.'
          );
          localStorage.setItem('notificationStatus', JSON.stringify(false));
          set({ notificationStatus: false });
        }
      },
      setNotificationStatusFalse: () => {
        localStorage.setItem('notificationStatus', JSON.stringify(false));
        set({ notificationStatus: false });
      }
    };
  })
);

export default useGlobalStore;
