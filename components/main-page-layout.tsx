import React, { useState, useEffect, useMemo } from 'react';
import { useAdContext } from '@/pages/_app';
import { useAuth } from '@/hooks/useAuth';
import {
  AdvertisementPosition,
  VendorWeightConfig
} from '@/types/advertisements';
import { AdManagerProvider, TopBanner, SideBanner, AD_DIMENSIONS } from './ads';
import {
  TOP_BANNER_AD_WEIGHTS,
  LEFT_BANNER_AD_WEIGHTS,
  RIGHT_BANNER_AD_WEIGHTS
} from '@/lib/ad-weights';
import { PositionVendorWeights } from './ads/AdManager';

type Props = {
  width?: 'md' | 'xl';
  usesSideBanners: boolean;
};

export default function MainLayout({
  children,
  usesSideBanners = true
}: React.PropsWithChildren<Props>) {
  const { showAds } = useAdContext();
  const { hasActiveSubscription } = useAuth();
  const [hydrated, setHydrated] = useState(false);

  // Use position-specific vendor weights from the ad-weights.ts file
  // Note: FEED_AD_WEIGHTS are now derived from vendor.tier in AdManager
  const positionVendorWeights: PositionVendorWeights = useMemo(
    () => ({
      [AdvertisementPosition.TOP_BANNER]: TOP_BANNER_AD_WEIGHTS,
      [AdvertisementPosition.LEFT_BANNER]: LEFT_BANNER_AD_WEIGHTS,
      [AdvertisementPosition.RIGHT_BANNER]: RIGHT_BANNER_AD_WEIGHTS
      // Feed weights are now derived from vendor tiers
    }),
    []
  );

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return <div className="mt-4">{children}</div>;
  }

  const shouldShowAds = showAds && !hasActiveSubscription && hydrated;

  // The width of the side ad banners
  const sideAdWidth = AD_DIMENSIONS.sideBanner.width;

  return (
    <AdManagerProvider positionVendorWeights={positionVendorWeights}>
      <div className="flex min-h-svh justify-center smlaptop:justify-between">
        {/* Left Banner */}
        <div
          className={`hidden smlaptop:block`}
          style={{ width: sideAdWidth, flexShrink: 0 }}
        >
          {shouldShowAds && usesSideBanners && (
            <div className="sticky top-1/3">
              <SideBanner position={AdvertisementPosition.LEFT_BANNER} />
            </div>
          )}
        </div>

        {/* Top Banner & Content */}
        <div className="w-full max-w-4xl items-center px-4 below1550:max-w-6xl">
          {shouldShowAds && (
            <>
              <TopBanner className="w-full" />
            </>
          )}
          {/* Page Content */}
          <main>{children}</main>
        </div>

        {/* Right Banner */}
        <div
          className={`hidden smlaptop:block`}
          style={{ width: sideAdWidth, flexShrink: 0 }}
        >
          {shouldShowAds && usesSideBanners && (
            <div className="sticky top-1/3">
              <SideBanner position={AdvertisementPosition.RIGHT_BANNER} />
            </div>
          )}
        </div>
      </div>
    </AdManagerProvider>
  );
}
