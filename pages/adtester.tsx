import { useState } from 'react';
import Link from 'next/link';
import useGlobalStore from '@/stores/globalStore';
import { handleAdClick, trackAdVisible } from '@/utils/analytics';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import type { Ad } from '@/types/ads';
import { useInView } from 'react-intersection-observer';
import CarouselAd from '@/components/carousel-ad';

export default function Component() {
  const { ads } = useGlobalStore();
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

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

  if (!ads.position || Object.keys(ads.position).length === 0) {
    return null; // or a loading spinner
  }

  const topBannerAd = ads.position['1'].ads[0];
  const leftBannerAd = ads.position['2']?.ads[0]; // Assuming there's only one ad in position 2
  const carouselAds = ads.position['3']?.ads || [];

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col items-center space-y-8 text-center">
      <p>This is for testing analytics on prod</p>
      <h1 className="text-3xl font-bold">Ad Tester</h1>

      <Button
        onClick={() => {
          trackAdVisible('3182');
        }}
      >
        trigger ad impression
      </Button>

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
          <img src={leftBannerAd.mobile_image} alt="ad" className="h-full" />
        </Link>
      )}

      {/* Right ad : position 3 */}
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
      <div className="flex h-96 w-full bg-zinc-300"></div>
      <div className="flex h-96 w-full bg-slate-200"></div>
    </section>
  );
}
