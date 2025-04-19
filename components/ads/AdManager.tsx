import React, { createContext, useContext, useMemo } from 'react';
import {
  AdvertisementWithImages,
  AdvertisementPosition,
  VendorWeightConfig,
  AdvertisementWeight,
  AdvertisementImageType
} from '@/types/advertisements';
import { useAdvertisements } from '@/hooks/queries/useAdvertisements';
import { AdSelector } from '@/utils/adSelector';
import { useVendors } from '@/hooks/queries/useVendors';
import { VendorTier } from '@/services/vendorService';

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
  // Methods for selecting ads for the feed position
  getFeedAds: (count?: number) => AdvertisementWithImages[];
  getInitialFeedAd: () => AdvertisementWithImages | null;
  getIntervalAds: (
    resultCount: number,
    interval?: number
  ) => AdvertisementWithImages[];
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

// Helper function to derive weight from vendor tier
const getWeightFromTier = (tier: VendorTier): number => {
  switch (tier) {
    case VendorTier.TIER_1:
      return 3;
    case VendorTier.TIER_2:
      return 2;
    case VendorTier.TIER_3:
    case VendorTier.FREE:
    default:
      return 1;
  }
};

export function AdManagerProvider({
  children,
  positionVendorWeights = {}
}: AdManagerProviderProps) {
  const { getActiveAdvertisements } = useAdvertisements();
  const { vendors } = useVendors();
  const activeAds = getActiveAdvertisements();

  // Derive vendor weights from tier information
  const derivedVendorWeights = useMemo(() => {
    const weights: VendorWeightConfig = {};

    // Only derive weights for vendors with a valid tier
    vendors.forEach((vendor) => {
      if (vendor.tier) {
        weights[vendor.slug] = getWeightFromTier(vendor.tier);
      }
    });

    return weights;
  }, [vendors]);

  // Combine derived weights with any manually set weights
  const combinedFeedWeights = useMemo(() => {
    const manualFeedWeights =
      positionVendorWeights[AdvertisementPosition.FEED] || {};
    return {
      ...derivedVendorWeights, // Start with tier-based weights
      ...manualFeedWeights // Override with any manually specified weights
    };
  }, [derivedVendorWeights, positionVendorWeights]);

  const adsByPosition = useMemo(() => {
    const result: {
      [key in AdvertisementPosition]?: AdvertisementWithImages[];
    } = {};

    if (!activeAds) return result;

    // Filter ads by position and ensure they have at least one DEFAULT image for feed ads
    Object.values(AdvertisementPosition).forEach((position) => {
      const positionAds = activeAds.filter((ad) => ad.position === position);

      // For FEED position, ensure ads have DEFAULT images
      if (position === AdvertisementPosition.FEED) {
        result[position] = positionAds.filter((ad) =>
          ad.images.some(
            (img) => img.image_type === AdvertisementImageType.DEFAULT
          )
        );
      } else {
        result[position] = positionAds;
      }
    });

    return result;
  }, [activeAds]);

  // Combine position-specific weights with fallback to default weights
  const combinedVendorWeights = useMemo(() => {
    const result: PositionVendorWeights = {};

    Object.values(AdvertisementPosition).forEach((position) => {
      // For FEED position, use our tier-derived weights
      if (position === AdvertisementPosition.FEED) {
        result[position] = combinedFeedWeights;
      } else {
        result[position] = positionVendorWeights[position] || {};
      }
    });

    return result;
  }, [positionVendorWeights, combinedFeedWeights]);

  // Helper function to get weights for a specific position
  const getVendorWeightsForPosition = (
    position: AdvertisementPosition
  ): VendorWeightConfig => {
    return combinedVendorWeights[position] || {};
  };

  // Convert VendorWeightConfig to AdvertisementWeight[] for AdSelector
  const convertWeightsToArray = (
    position: AdvertisementPosition
  ): AdvertisementWeight[] => {
    const weights = getVendorWeightsForPosition(position);
    return Object.entries(weights).map(([vendor_slug, weight]) => ({
      vendor_slug,
      position,
      weight
    }));
  };

  // Get all available feed ads with DEFAULT images
  const getAllAvailableFeedAds = (): AdvertisementWithImages[] => {
    return adsByPosition[AdvertisementPosition.FEED] || [];
  };

  // Rotate the images in the ad to show different DEFAULT images each time
  // This ensures different images are shown each time the same ad is selected
  const rotateAdImages = (
    ad: AdvertisementWithImages,
    rotationIndex: number = 0
  ): AdvertisementWithImages => {
    // Get all DEFAULT images
    const defaultImages = ad.images.filter(
      (img) => img.image_type === AdvertisementImageType.DEFAULT
    );

    // If we only have one or zero DEFAULT images, return the ad as is
    if (defaultImages.length <= 1) {
      return ad;
    }

    // Create a copy of the non-DEFAULT images
    const nonDefaultImages = ad.images.filter(
      (img) => img.image_type !== AdvertisementImageType.DEFAULT
    );

    // Create a new rotated array of DEFAULT images based on the rotation index
    // This ensures we get a different order every time
    let rotatedDefaultImages = [...defaultImages];

    // Rotate the array the specified number of times
    for (let i = 0; i < rotationIndex % defaultImages.length; i++) {
      // Move the first element to the end
      const firstImage = rotatedDefaultImages.shift();
      if (firstImage) {
        rotatedDefaultImages.push(firstImage);
      }
    }

    // Combine the non-DEFAULT images with the rotated DEFAULT images
    const rotatedImages = [...nonDefaultImages, ...rotatedDefaultImages];

    // Return a new ad object with the rotated images
    return {
      ...ad,
      images: rotatedImages
    };
  };

  // Select a specific number of feed ads based on the weights
  const getFeedAds = (count: number = 5): AdvertisementWithImages[] => {
    const feedAds = getAllAvailableFeedAds();
    if (feedAds.length === 0) return [];

    const feedWeights = convertWeightsToArray(AdvertisementPosition.FEED);
    const selector = new AdSelector(feedAds, feedWeights);

    const selectedAds: AdvertisementWithImages[] = [];
    const maxAds = Math.min(count, feedAds.length);

    for (let i = 0; i < maxAds; i++) {
      const nextAd = selector.getNextAd();
      selectedAds.push(rotateAdImages(nextAd));
    }

    return selectedAds;
  };

  // Get a single ad for the Feed position
  const getInitialFeedAd = (): AdvertisementWithImages | null => {
    const feedAds = getAllAvailableFeedAds();
    if (feedAds.length === 0) return null;

    // Convert the position weights to the format expected by AdSelector
    const feedWeights = convertWeightsToArray(AdvertisementPosition.FEED);

    // Create the ad selector with proper weighting
    const selector = new AdSelector([...feedAds], feedWeights);

    try {
      // Get a single random ad that respects the weights
      const selectedAd = selector.getNextAd();

      // Apply random rotation for variety
      const randomRotationIndex = Math.floor(Math.random() * 10);
      return rotateAdImages(selectedAd, randomRotationIndex);
    } catch (error) {
      console.error('Error selecting initial feed ad:', error);
      return null;
    }
  };

  // Get ads to interleave in search results at regular intervals
  // Ensures there are enough ads to cover the entire result set by reusing ads if necessary
  const getIntervalAds = (
    resultCount: number,
    interval: number = 10
  ): AdvertisementWithImages[] => {
    const neededAdCount = Math.floor(resultCount / interval);
    if (neededAdCount <= 0) return [];

    const availableFeedAds = getAllAvailableFeedAds();
    if (availableFeedAds.length === 0) return [];

    // Convert the position weights to the format expected by AdSelector
    const feedWeights = convertWeightsToArray(AdvertisementPosition.FEED);

    // Create the ad selector with all available feed ads
    const selector = new AdSelector([...availableFeedAds], feedWeights);

    // Result array for selected and rotated ads
    const result: AdvertisementWithImages[] = [];

    // Get one ad at a time with proper weighting
    for (let i = 0; i < neededAdCount; i++) {
      try {
        // If we need more ads than we have available, we'll end up reusing some
        // The AdSelector will handle avoiding immediate repetition automatically
        const selectedAd = selector.getNextAd();

        // Calculate a unique rotation for this position if we're reusing ads
        // This ensures we see different images if we use the same ad multiple times
        const rotationIndex = Math.floor(i / availableFeedAds.length);
        const rotatedAd = rotateAdImages(selectedAd, rotationIndex);

        result.push(rotatedAd);
      } catch (error) {
        console.error('Error selecting ad:', error);
        break;
      }
    }

    return result;
  };

  const value = {
    ads: adsByPosition,
    vendorWeights: combinedVendorWeights,
    getVendorWeightsForPosition,
    getFeedAds,
    getInitialFeedAd,
    getIntervalAds
  };

  return <AdContext.Provider value={value}>{children}</AdContext.Provider>;
}
