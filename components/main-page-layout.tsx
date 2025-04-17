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

  return (
    <AdManagerProvider positionVendorWeights={positionVendorWeights}>
      <div className="flex min-h-svh justify-center ">
        {/* Side Banners are now overlays and don't need container divs */}
        {shouldShowAds && usesSideBanners && (
          <>
            <SideBanner position={AdvertisementPosition.LEFT_BANNER} />
            <SideBanner position={AdvertisementPosition.RIGHT_BANNER} />
          </>
        )}

        {/* Top Banner & Content */}
        <div className="w-full max-w-4xl items-center px-4  below1550:max-w-6xl">
          {shouldShowAds && (
            <div className="pt-4">
              <TopBanner className="w-full" />
            </div>
          )}
          {/* Page Content */}
          <main className="pt-4">{children}</main>
        </div>
      </div>
    </AdManagerProvider>
  );
}
