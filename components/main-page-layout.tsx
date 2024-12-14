import React, { useState, useEffect, useRef } from 'react';
import { useAdContext } from '@/pages/_app';
import useGlobalStore from '@/stores/globalStore';
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import useAuthStore from '@/stores/authStore';
import CarouselAd from './carousel-ad';
import { AdSelector } from '@/utils/adSelector';
import { Ad, AdWeight } from '@/types/ads';
import VerticalCarousel from './vertical-carousel';

type Props = {
  width?: 'md' | 'xl';
};
export default function MainLayout({
  children,
  width = 'md'
}: React.PropsWithChildren<Props>) {
  const { ads } = useGlobalStore();
  const { showAds } = useAdContext();
  const { hasActiveSubscription } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  const topBannerStoreWeights: AdWeight[] = [
    { store_id: 2, weight: 1 }, // obsidian
    { store_id: 5, weight: 1 }, // exorgames
    { store_id: 4, weight: 1 }, // chimera
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

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!ads.position || Object.keys(ads.position).length === 0) return;

    // Initialize AdSelectors for each position
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

    // Get all ads for each position using the selector
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
    return null;
  }

  return (
    <div
      className={`container w-full max-w-4xl flex-1 flex-col items-center justify-center px-0  below1550:max-w-6xl`}
    >
      <>
        {/* Header : position 1 */}
        {topBannerAds.length > 0 && (
          <Carousel
            className="w-full overflow-hidden rounded-lg "
            plugins={[topAutoPlayPlugin.current]}
          >
            <CarouselContent>
              {topBannerAds.map((ad, index) => (
                <CarouselItem key={index}>
                  <CarouselAd ad={ad} forceMobile={false} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}

        {/* Left ad : position 2 */}
        {showAds && !hasActiveSubscription && leftCarouselAds.length > 0 && (
          <div className="fixed left-5 top-1/3 hidden max-h-[480px] max-w-[160px] items-center justify-center overflow-hidden rounded-lg smlaptop:flex smlaptop:flex-col">
            <VerticalCarousel ads={leftCarouselAds} />
          </div>
        )}

        {/* Right ad : position 3 */}
        {showAds && !hasActiveSubscription && rightCarouselAds.length > 0 && (
          <div className="fixed right-5 top-1/3 hidden max-h-[480px] max-w-[160px] items-center justify-center overflow-hidden rounded-lg smlaptop:flex smlaptop:flex-col">
            <VerticalCarousel ads={rightCarouselAds} />
          </div>
        )}
      </>

      <div className="mt-8">{children}</div>
    </div>
  );
}
