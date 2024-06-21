// ad.tsx
import React from 'react';
import { useInView } from 'react-intersection-observer';
import { trackAdClick, trackAdVisible } from '@/utils/analytics';
import { Ad } from '@/types/ads';
import Link from 'next/link';

type AdComponentProps = {
  ad: Ad;
};

const AdComponent: React.FC<AdComponentProps> = ({ ad }) => {
  const { ref, entry } = useInView({
    threshold: 0.5,
    triggerOnce: false, // Allow multiple triggers
    onChange: (inView, entry) => {
      const adId = entry.target.getAttribute('data-ad-id');
      if (adId && inView && entry.intersectionRatio >= 0.5) {
        trackAdVisible(adId);
      }
    }
  });

  const handleAdClick = (adId: string) => {
    trackAdClick(adId);
  };

  return (
    <Link
      href={ad.url}
      ref={ref}
      target="_blank"
      data-position-id="4" // 4 is horizontal feed ad
      data-ad-id={ad.id.toString()}
      onClick={() => handleAdClick(ad.id.toString())}
      className="ad mx-auto flex max-w-5xl items-center justify-center rounded border border-zinc-600 bg-black"
    >
      <img
        src={ad.desktop_image}
        alt={`ad-${ad.id}`}
        className="hidden w-fit sm:flex"
      />
      <img
        src={ad.mobile_image}
        alt={`ad-${ad.id}`}
        className="w-fill flex sm:hidden"
      />
    </Link>
  );
};

export default React.memo(AdComponent);
