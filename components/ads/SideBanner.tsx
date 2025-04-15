import React from 'react';
import { AdvertisementPosition } from '@/types/advertisements';
import { useAdManager } from './AdManager';
import SideBannerCarousel from '../side-banner-carousel';

interface SideBannerProps {
  position:
    | AdvertisementPosition.LEFT_BANNER
    | AdvertisementPosition.RIGHT_BANNER;
  className?: string;
}

export const SideBanner: React.FC<SideBannerProps> = ({
  position,
  className
}) => {
  const { ads, getVendorWeightsForPosition } = useAdManager();

  const sideBannerAds = ads[position] || [];
  const positionWeights = getVendorWeightsForPosition(position);

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
