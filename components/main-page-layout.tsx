// components/MainLayout.tsx
import React, { useRef } from 'react';
import { useAdContext } from '@/pages/_app';
import useGlobalStore from '@/stores/globalStore';
import Link from 'next/link';
import Autoplay from 'embla-carousel-autoplay';
import { trackAdClick, trackAdVisible } from '@/utils/analytics';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

import CarouselAd from './carousel-ad';
import { useInView } from 'react-intersection-observer';
import useAuthStore from '@/stores/authStore';

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
  const leftAutoplayPlugin = React.useRef(
    Autoplay({
      delay: 20000,
      stopOnInteraction: true
    }) as any
  );
  const rightAutoplayPlugin = React.useRef(
    Autoplay({
      delay: 20000,
      stopOnInteraction: true
    }) as any
  );

  const topAutoPlayPlugin = React.useRef(
    Autoplay({
      delay: 20000,
      stopOnInteraction: true
    }) as any
  );
  const {
    ref: bannerRef,
    inView: bannerInView,
    entry: bannerEntry
  } = useInView({
    threshold: 0.5,
    triggerOnce: false,
    onChange: (inView, entry) => {
      if (inView) {
        const adId = entry.target.getAttribute('data-ad-id');
        if (adId) {
          trackAdVisible(adId);
        }
      }
    }
  });

  const {
    ref: leftBannerRef,
    inView: leftBannerInView,
    entry: leftBannerEntry
  } = useInView({
    threshold: 0.5,
    triggerOnce: false,
    onChange: (inView, entry) => {
      if (inView) {
        const adId = entry.target.getAttribute('data-ad-id');
        if (adId) {
          trackAdVisible(adId);
        }
      }
    }
  });
  if (!ads.position || Object.keys(ads.position).length === 0) {
    return null; // or a loading spinner
  }

  const topBannerAds = ads.position['1']?.ads || [];
  const leftCarouselAds = ads.position['2']?.ads || [];
  const rightCarouselAds = ads.position['3']?.ads || [];

  return (
    <div
      className={`container w-full ${
        width === 'md' ? 'max-w-6xl' : ''
      } flex-1 flex-col items-center justify-center px-2 py-8`}
    >
      <>
        {/* Header : position 1 */}
        {topBannerAds && (
          <Carousel
            className="w-full rounded-lg overflow-hidden "
            plugins={[topAutoPlayPlugin.current]}
          >
            <CarouselContent>
              {topBannerAds.map((ad, index) => (
                <CarouselItem key={index}>
                  <CarouselAd ad={ad} forceMobile={false}/>     

                </CarouselItem>
              ))}

            </CarouselContent>
            {/* <CarouselPrevious /> */}
              {/* <CarouselNext /> */}
          </Carousel>
        )}

        {/* Left ad : position 2 */}
        {showAds && !hasActiveSubscription && leftCarouselAds.length > 0 && (
          <Carousel
          className={`fixed left-10 top-1/4 hidden max-h-[480px] max-w-[160px] items-center justify-center rounded-lg overflow-hidden xxl:flex xxl:flex-col`}
          plugins={[leftAutoplayPlugin.current]}
        >
          <CarouselContent>
            {leftCarouselAds.map((ad, index) => (
              <CarouselItem key={index}>
                <CarouselAd ad={ad} forceMobile={true} />
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* <CarouselPrevious /> */}
          {/* <CarouselNext /> */}
        </Carousel>
        )}

        {/* Right ad : position 3 */}
        {showAds && !hasActiveSubscription && rightCarouselAds.length > 0 && (
          <Carousel
            className={`fixed right-10 top-1/4 hidden max-h-[480px] max-w-[160px] items-center justify-center rounded-lg overflow-hidden xxl:flex xxl:flex-col`}
            plugins={[rightAutoplayPlugin.current]}
          >
            <CarouselContent>
              {rightCarouselAds.map((ad, index) => (
                <CarouselItem key={index}>
                  <CarouselAd ad={ad} forceMobile={true} />
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* <CarouselPrevious /> */}
            {/* <CarouselNext /> */}
          </Carousel>
        )}
      </>

      <div className="mt-8">{children}</div>
    </div>
  );
}
