import React from 'react';
import { AdvertisementPosition } from '@/types/advertisements';
import { AdContainer } from './AdContainer';
import { TopBannerSkeleton } from './AdSkeleton';
import { useAdManager } from './AdManager';
import UniversalCarousel from '../universal-carousel';

interface TopBannerProps {
  className?: string;
}

export const TopBanner: React.FC<TopBannerProps> = ({ className }) => {
  const { ads, isLoading, vendorWeights } = useAdManager();

  const topBannerAds = ads[AdvertisementPosition.TOP_BANNER] || [];

  if (topBannerAds.length === 0) return null;

  return (
    <AdContainer
      isLoading={isLoading}
      skeleton={<TopBannerSkeleton />}
      className={className}
    >
      <UniversalCarousel
        ads={topBannerAds}
        vendorWeights={vendorWeights}
        position={AdvertisementPosition.TOP_BANNER}
      />
    </AdContainer>
  );
};
