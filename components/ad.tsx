import React from 'react';
import {
  AdvertisementWithImages,
  AdvertisementImageType,
  AdvertisementPosition
} from '@/types/advertisements';
import Link from 'next/link';

type AdComponentProps = {
  ad: AdvertisementWithImages;
  position?: AdvertisementPosition;
};

const AdComponent: React.FC<AdComponentProps> = ({
  ad,
  position = AdvertisementPosition.FEED // Default to FEED position if not specified
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  // Get the appropriate image URL based on the ad position
  const getImageUrl = () => {
    // For feed ads, only use DEFAULT type
    if (position === AdvertisementPosition.FEED) {
      return (
        ad.images.find(
          (image) => image.image_type === AdvertisementImageType.DEFAULT
        )?.image_url || ''
      );
    }

    // For other positions (like banners), use responsive logic
    return {
      desktop:
        ad.images.find(
          (image) =>
            image.image_type === AdvertisementImageType.DESKTOP ||
            image.image_type === AdvertisementImageType.DEFAULT
        )?.image_url || '',
      mobile:
        ad.images.find(
          (image) => image.image_type === AdvertisementImageType.MOBILE
        )?.image_url || ''
    };
  };

  // Get the image URL(s) based on position
  const imageUrl = getImageUrl();

  // Add UTM parameters to the target URL
  const appendUtmParams = (url: string): string => {
    const utmParams =
      'utm_source=sc&utm_medium=referral&utm_campaign=referral_advertisement'.trim();

    if (url.includes(utmParams)) {
      return url;
    }

    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${utmParams}`;
  };

  return (
    <Link
      href={appendUtmParams(ad.target_url)}
      target="_blank"
      data-position-id={ad.position}
      data-ad-id={ad.id.toString()}
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

          {/* For FEED position, use a single image */}
          {position === AdvertisementPosition.FEED ? (
            <img
              src={imageUrl as string}
              alt={ad.alt_text || `Ad for ${ad.vendor_slug}`}
              onError={handleError}
              onLoad={handleLoad}
              className={`w-full rounded-lg object-cover transition-opacity duration-500 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ) : (
            /* For other positions, use responsive images */
            <>
              <img
                src={(imageUrl as { desktop: string; mobile: string }).desktop}
                alt={ad.alt_text || `Ad for ${ad.vendor_slug}`}
                onError={handleError}
                onLoad={handleLoad}
                className={`hidden w-full object-cover transition-opacity duration-500 sm:flex ${
                  isLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
              <img
                src={
                  (imageUrl as { desktop: string; mobile: string }).mobile ||
                  (imageUrl as { desktop: string; mobile: string }).desktop
                }
                alt={ad.alt_text || `Ad for ${ad.vendor_slug}`}
                onError={handleError}
                onLoad={handleLoad}
                className={`flex w-full object-cover transition-opacity duration-500 sm:hidden ${
                  isLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </>
          )}
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
