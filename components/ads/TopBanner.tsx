import React from 'react';
import { AdvertisementPosition } from '@/types/advertisements';
import { AdContainer } from './AdContainer';
import { useAdManager } from './AdManager';
import TopBannerCarousel from '../top-banner-carousel';

interface TopBannerProps {
  className?: string;
}

export const TopBanner: React.FC<TopBannerProps> = ({ className }) => {
  const { ads, getVendorWeightsForPosition } = useAdManager();

  const topBannerAds = ads[AdvertisementPosition.TOP_BANNER] || [];
  const topBannerWeights = getVendorWeightsForPosition(
    AdvertisementPosition.TOP_BANNER
  );

  if (topBannerAds.length === 0) return null;

  return (
    <AdContainer className={`relative w-full ${className || ''}`}>
      <TopBannerCarousel
        ads={topBannerAds}
        vendorWeights={topBannerWeights}
        className="w-full"
      />
    </AdContainer>
  );
};
