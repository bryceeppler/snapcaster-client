import React, { useState, useEffect, useMemo } from 'react';
import { useAdContext } from '@/pages/_app';
import { useAuth } from '@/hooks/useAuth';
import {
  AdvertisementPosition,
  VendorWeightConfig
} from '@/types/advertisements';
import { AdManagerProvider, TopBanner, SideBanner, AD_DIMENSIONS } from './ads';

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

  // Sample vendor weights - in a real app, these might come from an API or config
  const vendorWeights: VendorWeightConfig = useMemo(
    () => ({
      // Example weights for different vendors (vendor slug -> weight)
      // Higher weights mean that vendor's ads will appear more frequently
      obsidian: 5, // Obsidian has weight 5
      chimera: 3, // Chimera has weight 3
      goldfish: 2 // Goldfish has weight 2
      // Other vendors will have default weight of 1
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
    <AdManagerProvider vendorWeights={vendorWeights}>
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
