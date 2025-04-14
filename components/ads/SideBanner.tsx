import React from 'react';
import { AdvertisementPosition } from '@/types/advertisements';
import { AdContainer } from './AdContainer';
import { SideBannerSkeleton } from './AdSkeleton';
import { useAdManager } from './AdManager';
import UniversalCarousel from '../universal-carousel';
import { cn } from '@/lib/utils';

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
  const { ads, isLoading, vendorWeights } = useAdManager();

  const sideBannerAds = ads[position] || [];

  if (sideBannerAds.length === 0) return null;

  // Determine alignment based on position
  const isLeft = position === AdvertisementPosition.LEFT_BANNER;
  const wrapperClass = cn(
    'flex w-full',
    isLeft ? 'justify-start' : 'justify-end',
    isLeft ? 'pl-4' : 'pr-4'
  );

  return (
    <div className={wrapperClass}>
      <AdContainer
        isLoading={isLoading}
        skeleton={<SideBannerSkeleton />}
        className={className}
      >
        <UniversalCarousel
          ads={sideBannerAds}
          vendorWeights={vendorWeights}
          position={position}
        />
      </AdContainer>
    </div>
  );
};
