import React from 'react';
import { useInView } from 'react-intersection-observer';
import type { Ad } from '@/types/ads';
import { trackAdClick, trackAdVisible } from '@/utils/analytics';
import Link from 'next/link';

type AdProps = {
  ad: Ad;
  forceMobile?: boolean;
};

const CarouselAd: React.FC<AdProps> = ({ ad, forceMobile }) => {
  const { ref, inView, entry } = useInView({
    threshold: 0.5,
    triggerOnce: false,
    onChange: (inView, entry) => {
      if (inView) {
        const adId = entry?.target?.getAttribute('data-ad-id');
        if (adId) {
          trackAdVisible(adId);
        }
      }
    }
  });

  return (
    <Link
      href={ad.url}
      target="_blank"
      ref={ref}
      data-position-id="3"
      data-ad-id={ad.id.toString()}
      onClick={() => trackAdClick(ad.id.toString())}
      className="ad"
    >
      {
        forceMobile ? (<img src={ad.mobile_image} className="rounded overflow-hidden border border-1 border-border" alt="ad" />) : (
          <>
          <img src={ad.mobile_image} className="flex h-full w-full object-cover md:hidden rounded overflow-hidden border border-1 border-border" alt="ad" />
          <img src={ad.desktop_image} className="hidden w-full md:flex" alt="ad" />
          </>
        )
      }
    </Link>
  );
};

export default CarouselAd;
