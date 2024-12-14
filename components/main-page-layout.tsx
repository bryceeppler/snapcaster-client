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

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!ads.position || Object.keys(ads.position).length === 0 || !hydrated) {
    return null;
  }

  const topBannerAds = ads.position['1']?.ads || [];
  const leftCarouselAds = ads.position['2']?.ads || [];
  const rightCarouselAds = ads.position['3']?.ads || [];
  return (
    <div
      className={`container w-full max-w-4xl flex-1 flex-col items-center justify-center px-0  py-8 below1550:max-w-6xl`}
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
          <Carousel
            className={`fixed left-5 top-1/4 hidden max-h-[480px] max-w-[160px] items-center justify-center overflow-hidden rounded-lg smlaptop:flex smlaptop:flex-col`}
            plugins={[leftAutoplayPlugin.current]}
          >
            <CarouselContent>
              {leftCarouselAds.map((ad, index) => (
                <CarouselItem key={index}>
                  <CarouselAd ad={ad} forceMobile={true} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}

        {/* Right ad : position 3 */}
        {showAds && !hasActiveSubscription && rightCarouselAds.length > 0 && (
          <Carousel
            className={`fixed right-5 top-1/4 hidden max-h-[480px] max-w-[160px] items-center justify-center overflow-hidden rounded-lg smlaptop:flex smlaptop:flex-col`}
            plugins={[rightAutoplayPlugin.current]}
          >
            <CarouselContent>
              {rightCarouselAds.map((ad, index) => (
                <CarouselItem key={index}>
                  <CarouselAd ad={ad} forceMobile={true} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
      </>

      <div className="mt-8">{children}</div>
    </div>
  );
}
