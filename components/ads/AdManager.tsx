import React, { createContext, useContext, useMemo } from 'react';
import {
  AdvertisementWithImages,
  AdvertisementPosition,
  VendorWeightConfig
} from '@/types/advertisements';
import { useAdvertisements } from '@/hooks/queries/useAdvertisements';

export const AD_DIMENSIONS = {
  topBanner: {
    mobile: {
      width: 382,
      height: 160,
      aspectRatio: '382/160'
    },
    desktop: {
      width: 1008,
      height: 160,
      aspectRatio: '1008/160'
    }
  },
  sideBanner: {
    width: 160,
    height: 480,
    aspectRatio: '160/480'
  }
} as const;

// Define position-specific vendor weights
export type PositionVendorWeights = {
  [key in AdvertisementPosition]?: VendorWeightConfig;
};

type AdContextType = {
  ads: {
    [key in AdvertisementPosition]?: AdvertisementWithImages[];
  };
  // Individual weights for each position
  vendorWeights: PositionVendorWeights;
  // Helper function to get weights for a specific position
  getVendorWeightsForPosition: (
    position: AdvertisementPosition
  ) => VendorWeightConfig;
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
  positionVendorWeights?: PositionVendorWeights;
};

export function AdManagerProvider({
  children,
  positionVendorWeights = {}
}: AdManagerProviderProps) {
  const { ads: allAds } = useAdvertisements();

  const adsByPosition = useMemo(() => {
    const result: {
      [key in AdvertisementPosition]?: AdvertisementWithImages[];
    } = {};

    if (!allAds) return result;

    Object.values(AdvertisementPosition).forEach((position) => {
      result[position] = allAds.filter(
        (ad) => ad.position === position
      ) as AdvertisementWithImages[];
    });

    return result;
  }, [allAds]);

  // Combine position-specific weights with fallback to default weights
  const combinedVendorWeights = useMemo(() => {
    const result: PositionVendorWeights = {};

    Object.values(AdvertisementPosition).forEach((position) => {
      result[position] = positionVendorWeights[position] || {};
    });

    return result;
  }, [positionVendorWeights]);

  // Helper function to get weights for a specific position
  const getVendorWeightsForPosition = (
    position: AdvertisementPosition
  ): VendorWeightConfig => {
    return combinedVendorWeights[position] || {};
  };

  const value = {
    ads: adsByPosition,
    vendorWeights: combinedVendorWeights,
    getVendorWeightsForPosition
  };

  return <AdContext.Provider value={value}>{children}</AdContext.Provider>;
}
