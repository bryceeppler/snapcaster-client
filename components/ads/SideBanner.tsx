import React from 'react';
import { AdvertisementPosition } from '@/types/advertisements';
import { AdContainer } from './AdContainer';
import { useAdManager } from './AdManager';
import UniversalCarousel from '../universal-carousel';
import { cn } from '@/lib/utils';
import { AD_DIMENSIONS } from './AdManager';

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

  const isLeft = position === AdvertisementPosition.LEFT_BANNER;
  const wrapperClass = cn(
    'flex w-full',
    isLeft ? 'justify-start' : 'justify-end',
    isLeft ? 'pl-4' : 'pr-4'
  );

  return (
    <div className={wrapperClass}>
      <AdContainer
        className={cn('relative', className)}
        width={AD_DIMENSIONS.sideBanner.width}
        height={AD_DIMENSIONS.sideBanner.height}
      >
        <UniversalCarousel
          ads={sideBannerAds}
          vendorWeights={positionWeights}
          position={position}
          className="h-full w-full"
        />
      </AdContainer>
    </div>
  );
};
