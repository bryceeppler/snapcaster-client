// globalStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Vendor } from '@/services/vendorService';
import { vendorService } from '@/services/vendorService';

type GlobalState = {
  vendors: Vendor[];
  notificationStatus: boolean;
  getVendorBySlug: (slug: string) => Vendor | undefined;
  getVendorNameBySlug: (slug: string) => string;
  initNotificationStatus: () => void;
  setNotificationStatusFalse: () => void;
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

    return {
      vendors: [],
      notificationStatus: false,
      getVendorBySlug: (slug: string) => {
        return get().vendors.find((vendor) => vendor.slug === slug);
      },
      getVendorNameBySlug: (slug: string) => {
        const vendor = get().vendors.find((vendor) => vendor.slug === slug);
        return vendor ? vendor.name : 'Vendor not found';
      },
      initNotificationStatus: () => {
        set({ notificationStatus: true });
      },
      setNotificationStatusFalse: () => {
        set({ notificationStatus: false });
      }
    };
  })
);

export default useGlobalStore;
