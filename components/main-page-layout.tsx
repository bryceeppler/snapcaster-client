import React, { useState, useEffect, useRef } from 'react';
import { useAdContext } from '@/pages/_app';
import useGlobalStore from '@/stores/globalStore';
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useAuth } from '@/hooks/useAuth';
import CarouselAd from './carousel-ad';
import { AdSelector } from '@/utils/adSelector';
import { Ad, AdWeight } from '@/types/ads';
import VerticalCarousel from './vertical-carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type Props = {
  width?: 'md' | 'xl';
};

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
} as const;

// Improved skeleton components with consistent dimensions
const TopBannerSkeleton = () => (
  <div className="w-full overflow-hidden rounded-lg">
    <div className="relative mx-auto flex w-full justify-center">
      {/* Mobile Banner */}
      <div className="block w-full sm:hidden">
        <div
          className="relative w-full"
          style={{
            aspectRatio: '382/160'
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

// Simplified ad container with better layout stability
const AdContainer = ({
  isLoading,
  children,
  className,
  skeleton
}: {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
  skeleton: React.ReactNode;
}) => {
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setIsTransitioning(false), 500);
      return () => clearTimeout(timer);
    }
    setIsTransitioning(true);
  }, [isLoading]);

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'absolute inset-0 z-10 transition-opacity duration-500',
          !isLoading && !isTransitioning && 'opacity-0'
        )}
      >
        {skeleton}
      </div>
      <div
        className={cn(
          'transition-opacity duration-500',
          isLoading || isTransitioning ? 'opacity-0' : 'opacity-100'
        )}
      >
        {children}
      </div>
    </div>
  );
};

// Simplified preloader with better error handling
const useAdPreloader = (ads: Ad[]) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!ads.length) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    let mounted = true;

    const imagePromises = ads.map((ad) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = ad.mobile_image;
      });
    });

    Promise.all(imagePromises)
      .then(() => {
        if (mounted) {
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [ads]);

  return isLoading;
};

export default function MainLayout({
  children
}: React.PropsWithChildren<Props>) {
  const { ads } = useGlobalStore();
  const { showAds } = useAdContext();
  const { hasActiveSubscription } = useAuth();
  const [hydrated, setHydrated] = useState(false);

  const topBannerStoreWeights: AdWeight[] = [
    { store_id: 2, weight: 3 }, // obsidian
    { store_id: 5, weight: 3 }, // exorgames
    { store_id: 4, weight: 3 }, // chimera
    { store_id: 3, weight: 1 }, // levelup
    { store_id: 8, weight: 1 }, // houseofcards
    { store_id: 9, weight: 1 } // mythicstore
  ];

  const leftCarouselStoreWeights: AdWeight[] = [
    { store_id: 2, weight: 1 }, // obsidian
    { store_id: 5, weight: 1 }, // exorgames
    { store_id: 4, weight: 1 }, // chimera
    { store_id: 3, weight: 1 }, // levelup
    { store_id: 8, weight: 1 }, // houseofcards
    { store_id: 9, weight: 1 } // mythicstore
  ];

  const rightCarouselStoreWeights: AdWeight[] = [
    { store_id: 2, weight: 1 }, // obsidian
    { store_id: 5, weight: 1 }, // exorgames
    { store_id: 4, weight: 1 }, // chimera
    { store_id: 3, weight: 1 }, // levelup
    { store_id: 8, weight: 1 }, // houseofcards
    { store_id: 9, weight: 1 } // mythicstore
  ];

  const leftAutoplayPlugin = useRef(
    Autoplay({
      delay: 20000,
      stopOnInteraction: true
    }) as any
  );
  const rightAutoplayPlugin = useRef(
    Autoplay({
      delay: 20000,
      stopOnInteraction: true
    }) as any
  );
  const topAutoPlayPlugin = useRef(
    Autoplay({
      delay: 20000,
      stopOnInteraction: true
    }) as any
  );

  const [topBannerAds, setTopBannerAds] = useState<Ad[]>([]);
  const [leftCarouselAds, setLeftCarouselAds] = useState<Ad[]>([]);
  const [rightCarouselAds, setRightCarouselAds] = useState<Ad[]>([]);

  // Simplified loading states
  const isTopBannerLoading = useAdPreloader(topBannerAds);
  const isLeftCarouselLoading = useAdPreloader(leftCarouselAds);
  const isRightCarouselLoading = useAdPreloader(rightCarouselAds);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!ads.position || Object.keys(ads.position).length === 0) return;

    // Initialize AdSelectors and set ads (existing code)
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

    const getPositionAds = (selector: AdSelector, count: number) => {
      const selectedAds: Ad[] = [];
      for (let i = 0; i < count; i++) {
        try {
          selectedAds.push(selector.getNextAd());
        } catch (error) {
          break;
        }
      }
      return selectedAds;
    };

    setTopBannerAds(
      getPositionAds(topSelector, ads.position['1']?.ads.length * 2 || 0)
    );
    setLeftCarouselAds(
      getPositionAds(leftSelector, ads.position['2']?.ads.length * 2 || 0)
    );
    setRightCarouselAds(
      getPositionAds(rightSelector, ads.position['3']?.ads.length * 2 || 0)
    );
  }, [ads.position]);

  if (!ads.position || Object.keys(ads.position).length === 0 || !hydrated) {
    return <div className={`mt-4`}>{children}</div>;
  }

  const shouldShowAds = showAds && !hasActiveSubscription && hydrated;

  return (
    <div className="flex min-h-svh">
      {/* Left Banner */}
      <div className="container hidden w-full max-w-4xl flex-1 p-4 smlaptop:block">
        {shouldShowAds && (
          <div className="sticky top-1/3 hidden smlaptop:block">
            {leftCarouselAds.length > 0 && (
              <div className=" ">
                <AdContainer
                  isLoading={isLeftCarouselLoading}
                  skeleton={<SideBannerSkeleton />}
                >
                  <div
                    className="relative overflow-hidden rounded-lg"
                    style={{
                      width: AD_DIMENSIONS.sideBanner.width,
                      height: AD_DIMENSIONS.sideBanner.height
                    }}
                  >
                    <div className="inset-0">
                      <VerticalCarousel ads={leftCarouselAds} />
                    </div>
                  </div>
                </AdContainer>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Top Banner & Content*/}
      <div className="mx-auto w-full max-w-4xl items-center p-4 below1550:max-w-6xl">
        {shouldShowAds && (
          <>
            {topBannerAds.length > 0 && (
              <AdContainer
                isLoading={isTopBannerLoading}
                skeleton={<TopBannerSkeleton />}
                className="mb-4 w-full"
              >
                <Carousel
                  className="w-full overflow-hidden rounded-lg"
                  plugins={[topAutoPlayPlugin.current]}
                >
                  <CarouselContent>
                    {topBannerAds.map((ad, index) => (
                      <CarouselItem key={index} className="flex justify-center">
                        {/* Mobile Banner */}
                        <div className="block w-full sm:hidden">
                          <div
                            className="relative w-full"
                            style={{
                              aspectRatio:
                                AD_DIMENSIONS.topBanner.mobile.aspectRatio
                            }}
                          >
                            <div className="absolute inset-0">
                              <CarouselAd ad={ad} forceMobile={false} />
                            </div>
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
                            <div className="absolute inset-0">
                              <CarouselAd ad={ad} forceMobile={false} />
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </AdContainer>
            )}
          </>
        )}
        {/* Page Content */}
        <main className="z-10">{children}</main>
      </div>

      {/* Right Banner */}
      <div className="container hidden w-full max-w-4xl flex-1 p-4 smlaptop:block">
        {shouldShowAds && (
          <div className="sticky top-1/3 hidden smlaptop:block">
            {rightCarouselAds.length > 0 && (
              <div className="flex w-full justify-end">
                <AdContainer
                  isLoading={isRightCarouselLoading}
                  skeleton={<SideBannerSkeleton />}
                >
                  <div
                    className="relative overflow-hidden rounded-lg"
                    style={{
                      width: AD_DIMENSIONS.sideBanner.width,
                      height: AD_DIMENSIONS.sideBanner.height
                    }}
                  >
                    <div className="inset-0">
                      <VerticalCarousel ads={rightCarouselAds} />
                    </div>
                  </div>
                </AdContainer>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
