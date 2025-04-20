import React, { useMemo } from 'react';
import { AdvertisementPosition } from '@/types/advertisements';
import { useAdManager } from './AdManager';
import TopBannerCarousel from '../top-banner-carousel';

interface TopBannerProps {
  className?: string;
}

const TopBanner: React.FC<TopBannerProps> = ({ className }) => {
  const { ads, getVendorWeightsForPosition } = useAdManager();

  // Memoize these values to prevent recalculation on window resize
  const topBannerAds = useMemo(
    () => ads[AdvertisementPosition.TOP_BANNER] || [],
    [ads]
  );
  const topBannerWeights = useMemo(
    () => getVendorWeightsForPosition(AdvertisementPosition.TOP_BANNER),
    [getVendorWeightsForPosition]
  );

  if (topBannerAds.length === 0) return null;

  return (
    <TopBannerCarousel
      ads={topBannerAds}
      vendorWeights={topBannerWeights}
      className="w-full"
    />
  );
};

// Use React.memo with custom comparison function to prevent unnecessary re-renders
const TopBannerMemo = React.memo(TopBanner, (prevProps, nextProps) => {
  // Only re-render if className has changed
  return prevProps.className === nextProps.className;
});

export { TopBannerMemo as TopBanner };
