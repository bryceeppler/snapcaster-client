import React, { useEffect, useRef } from 'react';
import useGlobalStore from '@/stores/globalStore';
import Link from 'next/link';
import { handleAdClick } from '@/utils/analytics';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { trackAdVisible } from '@/utils/analytics';

type Props = {};

export default function MainLayout({
  children
}: React.PropsWithChildren<Props>) {
  const { adsEnabled, ads } = useGlobalStore();
  const [currentAdIndex, setCurrentAdIndex] = React.useState(0);
  const observerRefs = useRef<Record<string, IntersectionObserver>>({});

  const setupObserver = (
    element: HTMLElement,
    adId: string,
    positionId: string
  ) => {
    if (!element || observerRefs.current[adId]) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio > 0.5) {
            trackAdVisible(adId, positionId);
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
          setupObserver(el as HTMLElement, adId, positionId);
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

  return (
    <main className="container w-full max-w-5xl flex-1 flex-col items-center justify-center px-2 py-8">
      {adsEnabled && (
        <>
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
        </>
      )}
      <div className="mt-8">{children}</div>
    </main>
  );
}
