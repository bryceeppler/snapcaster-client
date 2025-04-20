import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
  useEffect
} from 'react';
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

  // Store the active ads in state to prevent re-fetching on window resize
  const [storedActiveAds, setStoredActiveAds] = useState<
    AdvertisementWithImages[]
  >([]);

  // Use a ref to track initial mount
  const initialMountRef = useRef(true);

  // Get active ads only on first mount and when data actually changes
  useEffect(() => {
    if (initialMountRef.current) {
      const ads = getActiveAdvertisements();
      setStoredActiveAds(ads);
      initialMountRef.current = false;
    }
  }, [getActiveAdvertisements]);

  // Only update stored ads when the hook returns new data (not on resize)
  const activeAdsRef = useRef<AdvertisementWithImages[]>([]);
  useEffect(() => {
    const currentAds = getActiveAdvertisements();

    // Compare with previous ads to see if we actually got new data
    if (JSON.stringify(currentAds) !== JSON.stringify(activeAdsRef.current)) {
      activeAdsRef.current = currentAds;
      setStoredActiveAds(currentAds);
    }
  }, [getActiveAdvertisements]);

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

    if (!storedActiveAds.length) return result;

    // Filter ads by position and ensure they have at least one DEFAULT image for feed ads
    Object.values(AdvertisementPosition).forEach((position) => {
      const positionAds = storedActiveAds.filter(
        (ad) => ad.position === position
      );

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
  }, [storedActiveAds]);

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

  // Memoize all functions to prevent recreating them on window resize
  const getAllAvailableFeedAds = useMemo(() => {
    return (): AdvertisementWithImages[] => {
      return adsByPosition[AdvertisementPosition.FEED] || [];
    };
  }, [adsByPosition]);

  // Memoize rotateAdImages function to prevent recreating it on every render
  const rotateAdImages = useMemo(() => {
    return (
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
  }, []);

  // Select a specific number of feed ads based on the weights - memoized
  const getFeedAds = useMemo(() => {
    return (count: number = 5): AdvertisementWithImages[] => {
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
  }, [getAllAvailableFeedAds, convertWeightsToArray, rotateAdImages]);

  // Get a single ad for the Feed position - memoized
  const getInitialFeedAd = useMemo(() => {
    return (): AdvertisementWithImages | null => {
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
  }, [getAllAvailableFeedAds, convertWeightsToArray, rotateAdImages]);

  // Get ads to interleave in search results at regular intervals - memoized
  const getIntervalAds = useMemo(() => {
    return (
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
  }, [getAllAvailableFeedAds, convertWeightsToArray, rotateAdImages]);

  // Memoize the context value object to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      ads: adsByPosition,
      vendorWeights: combinedVendorWeights,
      getVendorWeightsForPosition,
      getFeedAds,
      getInitialFeedAd,
      getIntervalAds
    }),
    [adsByPosition, combinedVendorWeights]
  );

  return <AdContext.Provider value={value}>{children}</AdContext.Provider>;
}
