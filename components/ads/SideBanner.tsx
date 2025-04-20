import React, { useMemo } from 'react';
import { AdvertisementPosition } from '@/types/advertisements';
import { useAdManager } from './AdManager';
import SideBannerCarousel from '../side-banner-carousel';

interface SideBannerProps {
  position:
    | AdvertisementPosition.LEFT_BANNER
    | AdvertisementPosition.RIGHT_BANNER;
  className?: string;
}

const SideBanner: React.FC<SideBannerProps> = ({ position, className }) => {
  const { ads, getVendorWeightsForPosition } = useAdManager();

  // Memoize these values to prevent recalculation on window resize
  const sideBannerAds = useMemo(() => ads[position] || [], [ads, position]);
  const positionWeights = useMemo(
    () => getVendorWeightsForPosition(position),
    [getVendorWeightsForPosition, position]
  );

  if (sideBannerAds.length === 0) return null;

  // Render the carousel directly as an overlay
  return (
    <SideBannerCarousel
      ads={sideBannerAds}
      vendorWeights={positionWeights}
      position={position}
      className={className}
    />
  );
};

// Use React.memo with custom comparison function to prevent unnecessary re-renders
const SideBannerMemo = React.memo(SideBanner, (prevProps, nextProps) => {
  // Only re-render if position or className has changed
  return (
    prevProps.position === nextProps.position &&
    prevProps.className === nextProps.className
  );
});

export { SideBannerMemo as SideBanner };
