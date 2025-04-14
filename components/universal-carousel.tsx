import React, { useState, useEffect, useMemo } from 'react';
import {
  AdvertisementWithImages,
  AdvertisementPosition,
  AdvertisementImage,
  VendorWeightConfig
} from '@/types/advertisements';
import Link from 'next/link';
import { AdvertisementImageType } from '@/types/advertisements';
import { cn } from '@/lib/utils';

// Common dimensions config for all ad types
export const AD_DIMENSIONS = {
  topBanner: {
    mobile: {
      width: 382,
      height: 160,
      aspectRatio: '382/160'
    },
    desktop: {
      width: 1008,
      height: 160,
      aspectRatio: '1008/160'
    }
  },
  sideBanner: {
    width: 160,
    height: 480,
    aspectRatio: '160/480'
  }
} as const;

// Define a type for our responsive image pair
interface ResponsiveImagePair {
  isResponsivePair: true;
  mobile?: AdvertisementImage;
  desktop?: AdvertisementImage;
  id: string;
}

// Extend types to support responsive image pairs
type ExtendedAdImageInfo = {
  image: AdvertisementImage | ResponsiveImagePair;
  parentAd: AdvertisementWithImages;
};

interface UniversalCarouselProps {
  ads: AdvertisementWithImages[];
  position: AdvertisementPosition;
  vendorWeights?: VendorWeightConfig;
  className?: string;
}

const appendUtmParams = (url: string): string => {
  const utmParams =
    'utm_source=sc&utm_medium=referral&utm_campaign=referral_advertisement'.trim();

  if (url.includes(utmParams)) {
    return url;
  }

  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${utmParams}`;
};

// Type guard to check if an image is a responsive pair
const isResponsiveImagePair = (image: any): image is ResponsiveImagePair => {
  return image && image.isResponsivePair === true;
};

// Function to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

/**
 * Weighted random selection algorithm that considers vendor weights
 * Works for both top banners and side banners
 */
const getWeightedAdImages = (
  ads: AdvertisementWithImages[],
  vendorWeights: VendorWeightConfig = {},
  position: AdvertisementPosition
): ExtendedAdImageInfo[] => {
  // Collect all ad images with their parent ad info
  const allAdImages: ExtendedAdImageInfo[] = [];
  const defaultWeight = 1;

  // Group ads by vendor_slug
  const adsByVendor: { [vendorSlug: string]: AdvertisementWithImages[] } = {};

  // Group ads by vendor
  ads.forEach((ad) => {
    const vendorSlug = ad.vendor_slug || `vendor_${ad.vendor_id}`;
    if (!adsByVendor[vendorSlug]) {
      adsByVendor[vendorSlug] = [];
    }
    adsByVendor[vendorSlug].push(ad);
  });

  // For TOP_BANNER, create paired mobile/desktop images
  if (position === AdvertisementPosition.TOP_BANNER) {
    const adPairs: {
      parentAd: AdvertisementWithImages;
      mobileImage?: AdvertisementImage;
      desktopImage?: AdvertisementImage;
      weight: number;
    }[] = [];

    // First, group ads and find mobile/desktop pairs
    Object.entries(adsByVendor).forEach(([vendorSlug, vendorAds]) => {
      const weight = vendorWeights[vendorSlug] || defaultWeight;

      vendorAds.forEach((ad) => {
        const mobileImage = ad.images.find(
          (img) => img.image_type === AdvertisementImageType.MOBILE
        );
        const desktopImage = ad.images.find(
          (img) => img.image_type === AdvertisementImageType.DESKTOP
        );

        // Only include ads that have at least one of mobile or desktop images
        if (mobileImage || desktopImage) {
          adPairs.push({
            parentAd: ad,
            mobileImage,
            desktopImage,
            weight
          });
        }
      });
    });

    // Then, create entries with both mobile and desktop images
    adPairs.forEach((pair) => {
      for (let i = 0; i < pair.weight; i++) {
        // For top banner, we include both mobile and desktop in the same entry
        allAdImages.push({
          image: {
            isResponsivePair: true,
            mobile: pair.mobileImage,
            desktop: pair.desktopImage,
            id: `${pair.parentAd.id}-responsive-${i}`
          } as ResponsiveImagePair,
          parentAd: pair.parentAd
        });
      }
    });
  } else {
    // For side banners, use all images with their respective weights
    Object.entries(adsByVendor).forEach(([vendorSlug, vendorAds]) => {
      const weight = vendorWeights[vendorSlug] || defaultWeight;

      // Process each ad from this vendor
      vendorAds.forEach((ad) => {
        // Get all images for this ad
        ad.images.forEach((image) => {
          // Add this image-ad pair to our collection, repeated by its weight
          for (let i = 0; i < weight; i++) {
            allAdImages.push({
              image,
              parentAd: ad
            });
          }
        });
      });
    });
  }

  // Shuffle the weighted array
  return shuffleArray(allAdImages);
};

/**
 * Get dimensions and styling for different ad positions
 */
const getAdDimensions = (position: AdvertisementPosition) => {
  switch (position) {
    case AdvertisementPosition.TOP_BANNER:
      return {
        containerClass: 'w-full overflow-hidden rounded-lg',
        containerStyle: {},
        mobile: {
          className: 'block w-full sm:hidden',
          style: { aspectRatio: AD_DIMENSIONS.topBanner.mobile.aspectRatio }
        },
        desktop: {
          className: 'hidden w-full sm:block',
          style: { aspectRatio: AD_DIMENSIONS.topBanner.desktop.aspectRatio }
        },
        placeholderStyle: {
          aspectRatio: AD_DIMENSIONS.topBanner.desktop.aspectRatio
        }
      };
    case AdvertisementPosition.LEFT_BANNER:
    case AdvertisementPosition.RIGHT_BANNER:
      return {
        containerClass: 'relative overflow-hidden rounded-lg',
        containerStyle: {
          width: AD_DIMENSIONS.sideBanner.width,
          height: AD_DIMENSIONS.sideBanner.height
        },
        placeholderStyle: {
          width: AD_DIMENSIONS.sideBanner.width,
          height: AD_DIMENSIONS.sideBanner.height
        }
      };
    default:
      return {
        containerClass: 'w-full',
        containerStyle: {},
        placeholderStyle: {}
      };
  }
};

const UniversalCarousel: React.FC<UniversalCarouselProps> = ({
  ads,
  position,
  vendorWeights = {},
  className
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Generate weighted ad images based on vendor weights
  const weightedAdImages = useMemo(() => {
    return getWeightedAdImages(ads, vendorWeights, position);
  }, [ads, vendorWeights, position]);

  useEffect(() => {
    if (weightedAdImages.length === 0) return;

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % weightedAdImages.length);
    }, 20000); // 20 seconds

    return () => clearInterval(interval);
  }, [weightedAdImages.length]);

  if (weightedAdImages.length === 0) {
    return null;
  }

  const dimensions = getAdDimensions(position);

  return (
    <div
      className={cn(dimensions.containerClass, className)}
      style={dimensions.containerStyle}
    >
      {weightedAdImages.map((adImageInfo, index) => {
        const { image, parentAd } = adImageInfo;
        const responsivePair = isResponsiveImagePair(image) ? image : null;

        return (
          <div
            key={
              responsivePair
                ? `${parentAd.id}-responsive-${index}`
                : `${parentAd.id}-${(image as AdvertisementImage).id}-${index}`
            }
            className={`${
              index === activeIndex ? 'active' : 'inactive'
            } w-full`}
            style={{
              visibility: index === activeIndex ? 'visible' : 'hidden',
              zIndex: index === activeIndex ? 1 : 0,
              transition:
                index === activeIndex
                  ? 'visibility 0s, z-index 0s, opacity 1s ease-in-out'
                  : 'visibility 0s 1s, z-index 0s 1s, opacity 1s ease-in-out',
              opacity: index === activeIndex ? 1 : 0,
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%'
            }}
          >
            <Link
              href={appendUtmParams(parentAd.target_url)}
              target="_blank"
              rel="noopener noreferrer"
              passHref
              legacyBehavior
            >
              <a className="block h-full w-full cursor-pointer">
                {responsivePair ? (
                  // Responsive pair logic for TOP_BANNER position
                  <>
                    {/* Mobile Image */}
                    {responsivePair.mobile && (
                      <div
                        className={
                          dimensions.mobile?.className ||
                          'block w-full sm:hidden'
                        }
                      >
                        <img
                          src={responsivePair.mobile.image_url}
                          className="border-1 w-full overflow-hidden rounded-lg border border-border"
                          alt={parentAd.alt_text}
                          style={
                            dimensions.mobile?.style || {
                              aspectRatio: '382/160'
                            }
                          }
                        />
                      </div>
                    )}

                    {/* Desktop Image */}
                    {responsivePair.desktop && (
                      <div
                        className={
                          dimensions.desktop?.className ||
                          'hidden w-full sm:block'
                        }
                      >
                        <img
                          src={responsivePair.desktop.image_url}
                          className="border-1 w-full overflow-hidden rounded-lg border border-border"
                          alt={parentAd.alt_text}
                          style={
                            dimensions.desktop?.style || {
                              aspectRatio: '1008/160'
                            }
                          }
                        />
                      </div>
                    )}
                  </>
                ) : (
                  // Regular image logic for other positions
                  <div className="h-full w-full">
                    <img
                      src={(image as AdvertisementImage).image_url}
                      className="border-1 h-full w-full overflow-hidden rounded-lg border border-border object-cover"
                      alt={parentAd.alt_text}
                    />
                  </div>
                )}
              </a>
            </Link>
          </div>
        );
      })}

      {/* Add a container div with proper dimensions so the parent knows how tall this will be */}
      <div
        className="w-full"
        style={{
          ...dimensions.placeholderStyle,
          visibility: 'hidden',
          pointerEvents: 'none'
        }}
      ></div>
    </div>
  );
};

export default UniversalCarousel;
