import React, { createContext, useContext, useMemo } from 'react';
import {
  AdvertisementWithImages,
  AdvertisementPosition,
  VendorWeightConfig
} from '@/types/advertisements';
import { useAdvertisements } from '@/hooks/queries/useAdvertisements';
import { AD_DIMENSIONS } from '../universal-carousel';

// Re-export AD_DIMENSIONS for backward compatibility
export { AD_DIMENSIONS };

type AdContextType = {
  ads: {
    [key in AdvertisementPosition]?: AdvertisementWithImages[];
  };
  isLoading: boolean;
  vendorWeights: VendorWeightConfig;
};

const AdContext = createContext<AdContextType | undefined>(undefined);

export function useAdManager() {
  const context = useContext(AdContext);

  if (!context) {
    throw new Error('useAdManager must be used within an AdManagerProvider');
  }

  return context;
}

type AdManagerProviderProps = {
  children: React.ReactNode;
  vendorWeights?: VendorWeightConfig;
};

export function AdManagerProvider({
  children,
  vendorWeights = {}
}: AdManagerProviderProps) {
  const { ads: allAds, isLoading } = useAdvertisements();

  // Group ads by position
  const adsByPosition = useMemo(() => {
    const result: {
      [key in AdvertisementPosition]?: AdvertisementWithImages[];
    } = {};

    if (!allAds) return result;

    // Filter ads by their positions
    Object.values(AdvertisementPosition).forEach((position) => {
      result[position] = allAds.filter(
        (ad) => ad.position === position
      ) as AdvertisementWithImages[];
    });

    return result;
  }, [allAds]);

  const value = {
    ads: adsByPosition,
    isLoading,
    vendorWeights
  };

  return <AdContext.Provider value={value}>{children}</AdContext.Provider>;
}
