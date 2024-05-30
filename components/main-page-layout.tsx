import React, { useEffect, useRef } from 'react';
import useGlobalStore from '@/stores/globalStore';
import Link from 'next/link';
import { handleAdClick } from '@/utils/analytics';
import { Button } from './ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { trackAdVisible } from '@/utils/analytics';
import CarouselAd from './carousel-ad';
import { useInView } from 'react-intersection-observer';

type Props = {};

export default function MainLayout({
  children
}: React.PropsWithChildren<Props>) {
  const { adsEnabled, ads } = useGlobalStore();
  const [currentAdIndex, setCurrentAdIndex] = React.useState(0);
  const {
    ref: bannerRef,
    inView: bannerInView,
    entry: bannerEntry
  } = useInView({
    threshold: 0.5,
    triggerOnce: false, // Track visibility only once per ad
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

  const topBannerAd = ads.position['1'].ads[0];
  const leftBannerAd = ads.position['2']?.ads[0]; // Assuming there's only one ad in position 2
  const carouselAds = ads.position['3']?.ads || [];

  return (
    <main className="container w-full max-w-5xl flex-1 flex-col items-center justify-center px-2 py-8">
      {adsEnabled && (
        <>
          {/* Header : position 1 */}
          <Link
            href={topBannerAd.url}
            ref={bannerRef}
            target="_blank"
            data-position-id="1"
            data-ad-id={topBannerAd.id.toString()}
            className="ad flex items-center justify-center rounded border border-zinc-600 bg-black"
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

          {/* Left ad : position 2 */}
          {leftBannerAd && (
            <Link
              href={leftBannerAd.url}
              ref={leftBannerRef}
              target="_blank"
              data-position-id="2"
              data-ad-id={leftBannerAd.id.toString()}
              className="ad fixed left-10 top-1/4 hidden w-40 items-center justify-center rounded border border-zinc-600 bg-zinc-700 xl:flex xl:flex-col"
            >
              <img
                src={leftBannerAd.mobile_image}
                alt="ad"
                className="h-full"
              />
            </Link>
          )}

          {/* right ad : position 3 */}
          {carouselAds.length > 0 && (
            <Carousel
              className={`fixed right-10 top-1/4 hidden max-h-[480px] w-40 items-center justify-center rounded border border-zinc-600 bg-zinc-700 xl:flex xl:flex-col`}
            >
              <CarouselContent>
                {carouselAds.map((ad, index) => (
                  <CarouselItem
                    key={index}
                    data-position-id="3"
                    data-ad-id={carouselAds[currentAdIndex].id.toString()}
                    onClick={() =>
                      handleAdClick(carouselAds[currentAdIndex].id.toString())
                    }
                    className="ad"
                  >
                    <CarouselAd ad={ad} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="" />
              <CarouselNext className="" />
            </Carousel>
          )}
        </>
      )}

      <div className="mt-8">{children}</div>
    </main>
  );
}
