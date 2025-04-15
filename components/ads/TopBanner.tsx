import React from 'react';
import { AdvertisementPosition } from '@/types/advertisements';
import { AdContainer } from './AdContainer';
import { useAdManager } from './AdManager';
import UniversalCarousel from '../universal-carousel';

interface TopBannerProps {
  className?: string;
}

export const TopBanner: React.FC<TopBannerProps> = ({ className }) => {
  const { ads, vendorWeights } = useAdManager();

  const topBannerAds = ads[AdvertisementPosition.TOP_BANNER] || [];

  if (topBannerAds.length === 0) return null;

  return (
    <AdContainer className={`w-full ${className || ''}`}>
      <UniversalCarousel
        ads={topBannerAds}
        vendorWeights={vendorWeights}
        position={AdvertisementPosition.TOP_BANNER}
        absolute={false}
        className="h-auto w-full overflow-hidden"
      />
    </AdContainer>
  );
};
