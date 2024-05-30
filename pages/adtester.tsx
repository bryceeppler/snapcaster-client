import { useState } from 'react';
import { SingleSearchResult } from '@/stores/store';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { trackAdVisible } from '@/utils/analytics';
import { useEffect, useRef } from 'react';

import useGlobalStore from '@/stores/globalStore';
import { handleAdClick } from '@/utils/analytics';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';

export default function Component() {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const { ads } = useGlobalStore();
  const adsEnabled = true;
  if (!ads.position || Object.keys(ads.position).length === 0) {
    return null; // or a loading spinner
  }
  const observerRefs = useRef<Record<string, IntersectionObserver>>({});

  const setupObserver = (element: HTMLElement, adId: string) => {
    if (!element || observerRefs.current[adId]) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio > 0.5) {
            trackAdVisible(adId);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: [0.5] }
    );

    observer.observe(element);
    observerRefs.current[adId] = observer;
  };

  useEffect(() => {
    if (adsEnabled) {
      const adElements = document.querySelectorAll('.ad');
      adElements.forEach((el) => {
        const adId = el.getAttribute('data-ad-id');
        const positionId = el.getAttribute('data-position-id');
        if (adId && positionId) {
          setupObserver(el as HTMLElement, adId);
        }
      });
    }

    return () => {
      Object.values(observerRefs.current).forEach((observer) =>
        observer.disconnect()
      );
    };
  }, [adsEnabled, currentAdIndex, ads]);

  if (!ads.position || Object.keys(ads.position).length === 0) {
    return null; // or a loading spinner
  }
  const topBannerAd = ads.position['1'].ads[0];
  const leftBannerAd = ads.position['2']?.ads[0]; // Assuming there's only one ad in position 2
  const carouselAds = ads.position['3']?.ads || [];
  const cardData = {
    name: 'test',
    price: 10,
    condition: 'NM',
    foil: false,
    link: 'https://www.testwebsite.com/dockside-extortionist-360-borderless-double-masters-2022/',
    website: 'testwebsite'
  } as SingleSearchResult;

  return (
    <section className="mx-auto flex h-screen w-full max-w-5xl flex-col items-center space-y-8 text-center">
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
          target="_blank"
          data-position-id="2"
          data-ad-id={leftBannerAd.id.toString()}
          className="ad fixed left-10 top-1/4 hidden w-40 items-center justify-center rounded border border-zinc-600 bg-zinc-700 xl:flex xl:flex-col"
        >
          <img src={leftBannerAd.mobile_image} alt="ad" className="h-full" />
        </Link>
      )}

      {/* right ad : position 3 */}
      {carouselAds.length > 0 && (
        <Carousel
          className={`ad fixed right-10 top-1/4 hidden max-h-[480px] w-40 items-center justify-center rounded border border-zinc-600 bg-zinc-700 xl:flex xl:flex-col`}
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
              >
                <img src={ad.mobile_image} alt="ad" />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="" />
          <CarouselNext className="" />
        </Carousel>
      )}
    </section>
  );
}
