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
  const {
    hasActiveSubscription,
    isLoadingProfile,
    isAuthenticated,
    isInitializing
  } = useAuth();

  // Wait for profile to load if user is authenticated to prevent layout shifts
  const isProfileLoading =
    isInitializing || (isAuthenticated && isLoadingProfile);

  const shouldShowAds = useMemo(() => {
    // Don't show ads while profile is loading to prevent flash
    if (isProfileLoading) {
      return false;
    }
    // Only show ads if showAds is true AND user doesn't have active subscription
    return showAds && !hasActiveSubscription;
  }, [showAds, hasActiveSubscription, isProfileLoading]);

  // Don't render layout until profile is loaded (if user is authenticated)
  // This prevents layout shifts when components render differently based on auth state
  if (isProfileLoading) {
    return null;
  }

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
