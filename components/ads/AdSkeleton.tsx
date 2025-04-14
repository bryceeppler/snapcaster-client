import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { AD_DIMENSIONS } from './AdManager';

export const TopBannerSkeleton: React.FC = () => (
  <div className="w-full overflow-hidden rounded-lg">
    <div className="relative mx-auto flex w-full justify-center">
      {/* Mobile Banner */}
      <div className="block w-full sm:hidden">
        <div
          className="relative w-full"
          style={{
            aspectRatio: AD_DIMENSIONS.topBanner.mobile.aspectRatio
          }}
        >
          <Skeleton className="absolute inset-0" />
        </div>
      </div>
      {/* Desktop Banner */}
      <div className="hidden w-full sm:block">
        <div
          className="relative mx-auto"
          style={{
            width: '100%',
            maxWidth: AD_DIMENSIONS.topBanner.desktop.width,
            height: AD_DIMENSIONS.topBanner.desktop.height,
            aspectRatio: AD_DIMENSIONS.topBanner.desktop.aspectRatio
          }}
        >
          <Skeleton className="absolute inset-0" />
        </div>
      </div>
    </div>
  </div>
);

export const SideBannerSkeleton: React.FC = () => (
  <div
    className="overflow-hidden rounded-lg"
    style={{
      width: AD_DIMENSIONS.sideBanner.width,
      height: AD_DIMENSIONS.sideBanner.height,
      aspectRatio: AD_DIMENSIONS.sideBanner.aspectRatio
    }}
  >
    <Skeleton className="h-full w-full" />
  </div>
);
