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
  CarouselNext,
  CarouselPrevious
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
  const plugin = React.useRef(
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

  const topBannerAd = ads.position['1'].ads[0];
  const leftBannerAd = ads.position['2']?.ads[0]; // Assuming there's only one ad in position 2
  const carouselAds = ads.position['3']?.ads || [];
  // const shuffledAds = carouselAds.sort(() => Math.random() - 0.5);

  return (
    <main
      className={`container w-full ${
        width === 'md' ? 'max-w-6xl' : ''
      } flex-1 flex-col items-center justify-center px-2 py-8`}
    >
      <>
        {/* Header : position 1 */}
        {topBannerAd && (
          <Link
            href={topBannerAd.url}
            ref={bannerRef}
            target="_blank"
            data-position-id="1"
            onClick={() => trackAdClick(topBannerAd.id.toString())}
            data-ad-id={topBannerAd.id.toString()}
            className="ad mx-auto flex max-w-6xl items-center justify-center rounded border border-zinc-600 bg-black"
          >
            <img
              className="hidden h-fit w-full md:flex"
              src={topBannerAd.desktop_image}
              alt="ad"
            />
            <img
              className="flex h-full w-full object-cover md:hidden"
              src={topBannerAd.mobile_image}
              alt="ad"
            />
          </Link>
        )}

        {/* Left ad : position 2 */}
        {leftBannerAd && (
          <Link
            onClick={() => trackAdClick(leftBannerAd.id.toString())}
            href={leftBannerAd.url}
            ref={leftBannerRef}
            target="_blank"
            data-position-id="2"
            data-ad-id={leftBannerAd.id.toString()}
            className="ad fixed left-10 top-1/4 hidden w-40 items-center justify-center rounded border border-zinc-600 bg-zinc-700 xxl:flex xxl:flex-col"
          >
            <img src={leftBannerAd.mobile_image} alt="ad" className="h-full" />
          </Link>
        )}

        {/* Right ad : position 3 */}
        {showAds && !hasActiveSubscription && carouselAds.length > 0 && (
          <Carousel
            className={`fixed right-10 top-1/4 hidden max-h-[480px] w-40 items-center justify-center rounded border border-zinc-600 bg-zinc-700 xxl:flex xxl:flex-col`}
            plugins={[plugin.current]}
          >
            <CarouselContent>
              {carouselAds.map((ad, index) => (
                <CarouselItem key={index}>
                  <CarouselAd ad={ad} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="" />
            <CarouselNext className="" />
          </Carousel>
        )}
      </>

      <div className="mt-8">{children}</div>
    </main>
  );
}
