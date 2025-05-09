import React, { useMemo } from 'react';

import { TopBanner, SideBanner } from './ads';

import { useAuth } from '@/hooks/useAuth';
import { useAdContext } from '@/pages/_app';
import { AdvertisementPosition } from '@/types/advertisements';

type Props = {
  width?: 'md' | 'xl';
  usesSideBanners?: boolean;
};

function MainLayout({
  children,
  usesSideBanners = true
}: React.PropsWithChildren<Props>) {
  const { showAds } = useAdContext();
  const { hasActiveSubscription } = useAuth();

  const shouldShowAds = useMemo(
    () => showAds && !hasActiveSubscription,
    [showAds, hasActiveSubscription]
  );

  return (
    <div className="relative flex justify-center">
      {shouldShowAds && usesSideBanners && (
        <>
          <SideBanner
            position={AdvertisementPosition.LEFT_BANNER}
            intervalMs={15000}
          />
          <SideBanner
            position={AdvertisementPosition.RIGHT_BANNER}
            intervalMs={15000}
          />
        </>
      )}

      {/* Top Banner & Content */}
      <div className="w-full max-w-4xl items-center px-4 below1550:max-w-6xl">
        {shouldShowAds && (
          <div className="pt-4">
            <TopBanner className="w-full" intervalMs={15000} />
          </div>
        )}
        {/* Page Content */}
        <main className="py-4">{children}</main>
      </div>
    </div>
  );
}

export default React.memo(MainLayout);
