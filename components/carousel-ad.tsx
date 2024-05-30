import React from 'react';
import { useInView } from 'react-intersection-observer';
import type { Ad } from '@/types/ads';
import { handleAdClick, trackAdVisible } from '@/utils/analytics';
import Link from 'next/link';

type AdProps = {
  ad: Ad;
};

const CarouselAd: React.FC<AdProps> = ({ ad }) => {
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
      onClick={() => handleAdClick(ad.id.toString())}
      className="ad"
    >
      <img src={ad.mobile_image} alt="ad" />
    </Link>
  );
};

export default CarouselAd;
