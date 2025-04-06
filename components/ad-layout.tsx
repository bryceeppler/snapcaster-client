import React, { useState, useEffect, useRef, memo } from 'react';
import { useAdContext } from '@/pages/_app';
import useGlobalStore from '@/stores/globalStore';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import CarouselAd from './carousel-ad';
import { AdSelector } from '@/utils/adSelector';
import VerticalCarousel from './vertical-carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Ad } from '@/types/ads';
// Constants for ad dimensions and layout
const AD_DIMENSIONS = {
  topBanner: {
    mobile: {
      width: 382,
      height: 160,
      aspectRatio: '382/160'
    },
    desktop: {
      width: 1008,
      height: 160,
      aspectRatio: '1008/160'
    }
  },
  sideBanner: {
    width: 160,
    height: 480,
    aspectRatio: '160/480'
  }
};

// Skeleton components
const TopBannerSkeleton = () => (
  <div className="w-full overflow-hidden rounded-lg">
    <div className="relative mx-auto flex w-full justify-center">
      <div className="block w-full sm:hidden">
        <div
          className="relative w-full"
          style={{ aspectRatio: AD_DIMENSIONS.topBanner.mobile.aspectRatio }}
        >
          <Skeleton className="absolute inset-0" />
        </div>
      </div>
      <div className="hidden w-full sm:block">
        <div
          className="relative mx-auto"
          style={{
            width: '100%',
            maxWidth: AD_DIMENSIONS.topBanner.desktop.width,
            aspectRatio: AD_DIMENSIONS.topBanner.desktop.aspectRatio
          }}
        >
          <Skeleton className="absolute inset-0" />
        </div>
      </div>
    </div>
  </div>
);

const SideBannerSkeleton = () => (
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

// Main AdLayout component
const AdLayout = function AdLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { ads } = useGlobalStore();
  const { showAds } = useAdContext();
  const { hasActiveSubscription } = useAuth();

  // Ad state
  const [topBannerAds, setTopBannerAds] = useState<Ad[]>([]);
  const [leftCarouselAds, setLeftCarouselAds] = useState<Ad[]>([]);
  const [rightCarouselAds, setRightCarouselAds] = useState<Ad[]>([]);

  // Loading state
  const [isTopBannerLoading, setIsTopBannerLoading] = useState(true);
  const [isLeftCarouselLoading, setIsLeftCarouselLoading] = useState(true);
  const [isRightCarouselLoading, setIsRightCarouselLoading] = useState(true);

  // Autoplay plugins
  const topAutoPlayPlugin = useRef(
    Autoplay({
      delay: 20000,
      stopOnInteraction: true
    })
  );

  const leftAutoPlayPlugin = useRef(
    Autoplay({
      delay: 20000,
      stopOnInteraction: true
    })
  );

  const rightAutoPlayPlugin = useRef(
    Autoplay({
      delay: 20000,
      stopOnInteraction: true
    })
  );

  // Store weights
  const topBannerStoreWeights = [
    { store_id: 2, weight: 3 }, // obsidian
    { store_id: 5, weight: 3 }, // exorgames
    { store_id: 4, weight: 3 }, // chimera
    { store_id: 3, weight: 1 }, // levelup
    { store_id: 8, weight: 1 }, // houseofcards
    { store_id: 9, weight: 1 } // mythicstore
  ];

  const leftCarouselStoreWeights = [
    { store_id: 2, weight: 1 }, // obsidian
    { store_id: 5, weight: 1 }, // exorgames
    { store_id: 4, weight: 1 }, // chimera
    { store_id: 3, weight: 1 }, // levelup
    { store_id: 8, weight: 1 }, // houseofcards
    { store_id: 9, weight: 1 } // mythicstore
  ];

  const rightCarouselStoreWeights = [
    { store_id: 2, weight: 1 }, // obsidian
    { store_id: 5, weight: 1 }, // exorgames
    { store_id: 4, weight: 1 }, // chimera
    { store_id: 3, weight: 1 }, // levelup
    { store_id: 8, weight: 1 }, // houseofcards
    { store_id: 9, weight: 1 } // mythicstore
  ];

  // Load ads
  useEffect(() => {
    if (!ads.position || Object.keys(ads.position).length === 0) return;

    // Initialize AdSelectors
    const topSelector = new AdSelector(
      ads.position['1']?.ads || [],
      topBannerStoreWeights
    );

    const leftSelector = new AdSelector(
      ads.position['2']?.ads || [],
      leftCarouselStoreWeights
    );

    const rightSelector = new AdSelector(
      ads.position['3']?.ads || [],
      rightCarouselStoreWeights
    );

    // Get ads
    const getPositionAds = (selector: AdSelector, count: number) => {
      const selectedAds = [];
      for (let i = 0; i < count; i++) {
        try {
          selectedAds.push(selector.getNextAd());
        } catch (error) {
          break;
        }
      }
      return selectedAds;
    };

    const topAds: Ad[] = getPositionAds(
      topSelector,
      ads.position['1']?.ads.length * 2 || 0
    );
    const leftAds: Ad[] = getPositionAds(
      leftSelector,
      ads.position['2']?.ads.length * 2 || 0
    );
    const rightAds: Ad[] = getPositionAds(
      rightSelector,
      ads.position['3']?.ads.length * 2 || 0
    );

    setTopBannerAds(topAds);
    setLeftCarouselAds(leftAds);
    setRightCarouselAds(rightAds);

    // Preload images
    const preloadImages = (
      ads: Ad[],
      setLoading: (loading: boolean) => void
    ) => {
      if (ads.length === 0) {
        setLoading(false);
        return;
      }

      const imagePromises = ads.map((ad) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = ad.mobile_image;
        });
      });

      Promise.all(imagePromises)
        .then(() => setLoading(false))
        .catch(() => setLoading(false));
    };

    preloadImages(topAds, setIsTopBannerLoading);
    preloadImages(leftAds, setIsLeftCarouselLoading);
    preloadImages(rightAds, setIsRightCarouselLoading);
  }, [ads.position]);

  // Always show the ad layout, even if ads aren't loaded yet
  const shouldShowAdLayout = showAds && !hasActiveSubscription;

  return (
    <div className="flex min-h-svh">
      {/* Left Banner */}
      <div className="hidden w-[200px] flex-shrink-0 smlaptop:block">
        {shouldShowAdLayout && (
          <div className="sticky top-1/3 p-4">
            <SideBannerSkeleton />
            {leftCarouselAds.length > 0 && !isLeftCarouselLoading && (
              <div
                className="absolute inset-0 p-4"
                style={{ opacity: isLeftCarouselLoading ? 0 : 1 }}
              >
                <div
                  className="relative overflow-hidden rounded-lg"
                  style={{
                    width: AD_DIMENSIONS.sideBanner.width,
                    height: AD_DIMENSIONS.sideBanner.height
                  }}
                >
                  <VerticalCarousel ads={leftCarouselAds} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Top Banner & Content */}
      <div className="mx-auto w-full max-w-4xl items-center p-4 below1550:max-w-6xl">
        {shouldShowAdLayout && (
          <div className="relative mb-4 w-full">
            <div className="relative w-full">
              <TopBannerSkeleton />
              {topBannerAds.length > 0 && !isTopBannerLoading && (
                <div
                  className="absolute inset-0 w-full"
                  style={{ opacity: isTopBannerLoading ? 0 : 1 }}
                >
                  <Carousel
                    className="w-full overflow-hidden rounded-lg"
                    plugins={[topAutoPlayPlugin.current]}
                  >
                    <CarouselContent>
                      {topBannerAds.map((ad, index) => (
                        <CarouselItem
                          key={index}
                          className="flex justify-center"
                        >
                          {/* Mobile Banner */}
                          <div className="block w-full sm:hidden">
                            <div
                              className="relative w-full"
                              style={{
                                aspectRatio:
                                  AD_DIMENSIONS.topBanner.mobile.aspectRatio
                              }}
                            >
                              <CarouselAd ad={ad} forceMobile={false} />
                            </div>
                          </div>
                          {/* Desktop Banner */}
                          <div className="hidden w-full sm:block">
                            <div
                              className="relative mx-auto"
                              style={{
                                width: '100%',
                                maxWidth: AD_DIMENSIONS.topBanner.desktop.width,
                                aspectRatio:
                                  AD_DIMENSIONS.topBanner.desktop.aspectRatio
                              }}
                            >
                              <CarouselAd ad={ad} forceMobile={false} />
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Page Content - use key to force update when route changes */}
        <main className="z-10" key={router.asPath}>
          {children}
        </main>
      </div>

      {/* Right Banner */}
      <div className="hidden w-[200px] flex-shrink-0 smlaptop:block">
        {shouldShowAdLayout && (
          <div className="sticky top-1/3 p-4">
            <div className="flex w-full justify-end">
              <SideBannerSkeleton />
              {rightCarouselAds.length > 0 && !isRightCarouselLoading && (
                <div
                  className="absolute inset-0 p-4"
                  style={{ opacity: isRightCarouselLoading ? 0 : 1 }}
                >
                  <div className="flex w-full justify-end">
                    <div
                      className="relative overflow-hidden rounded-lg"
                      style={{
                        width: AD_DIMENSIONS.sideBanner.width,
                        height: AD_DIMENSIONS.sideBanner.height
                      }}
                    >
                      <VerticalCarousel ads={rightCarouselAds} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Export a memoized version to prevent unnecessary re-renders
export default memo(AdLayout);
