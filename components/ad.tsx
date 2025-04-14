// ad.tsx
import React from 'react';
import { useInView } from 'react-intersection-observer';
import { trackAdClick, trackAdVisible } from '@/utils/analytics';
import {
  AdvertisementWithImages,
  AdvertisementImageType
} from '@/types/advertisements';
import Link from 'next/link';

type AdComponentProps = {
  ad: AdvertisementWithImages;
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

  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  return (
    <Link
      href={ad.target_url}
      ref={ref}
      target="_blank"
      data-position-id="4"
      data-ad-id={ad.id.toString()}
      onClick={() => handleAdClick(ad.id.toString())}
      className="ad mx-auto my-auto flex h-fit max-w-5xl items-center justify-center rounded-lg border border-border bg-black"
    >
      {!hasError ? (
        <div className="relative w-full overflow-hidden rounded-lg">
          <div
            className={`absolute inset-0 flex items-center justify-center bg-gradient-to-b from-zinc-800 to-zinc-900 transition-opacity duration-500 ${
              isLoaded ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <div className="h-full w-full bg-accent"></div>
          </div>

          <img
            src={
              ad.images.find(
                (image) => image.image_type === AdvertisementImageType.DESKTOP
              )?.image_url || ''
            }
            alt={`ad-${ad.id}`}
            onError={handleError}
            onLoad={handleLoad}
            className={`hidden w-full object-cover transition-opacity duration-500 sm:flex ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <img
            src={
              ad.images.find(
                (image) => image.image_type === AdvertisementImageType.MOBILE
              )?.image_url || ''
            }
            alt={`ad-${ad.id}`}
            onError={handleError}
            onLoad={handleLoad}
            className={`flex w-full object-cover transition-opacity duration-500 sm:hidden ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>
      ) : (
        <div className="flex w-full items-center justify-center rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-900">
          <div className="h-full w-full bg-accent"></div>
        </div>
      )}
    </Link>
  );
};

export default React.memo(AdComponent);
