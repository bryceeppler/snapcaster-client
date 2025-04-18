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
import { AD_DIMENSIONS } from './ads/AdManager';

// Extend types to support responsive image pairs
type ExtendedAdImageInfo = {
  image: AdvertisementImage;
  parentAd: AdvertisementWithImages;
};

interface SideBannerCarouselProps {
  ads: AdvertisementWithImages[];
  position:
    | AdvertisementPosition.LEFT_BANNER
    | AdvertisementPosition.RIGHT_BANNER;
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
 * Works for side banners
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

  // Shuffle the weighted array
  return shuffleArray(allAdImages);
};

const SideBannerCarousel: React.FC<SideBannerCarouselProps> = ({
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

  const isLeftBanner = position === AdvertisementPosition.LEFT_BANNER;

  return (
    <div
      className={cn(
        'vertical-carousel-container fixed z-10 hidden overflow-hidden rounded-lg smlaptop:block',
        isLeftBanner ? 'left-4' : 'right-4',
        className
      )}
      style={{
        width: AD_DIMENSIONS.sideBanner.width,
        height: AD_DIMENSIONS.sideBanner.height,
        top: '50%',
        transform: 'translateY(-50%)'
      }}
    >
      {weightedAdImages.map((adImageInfo, index) => {
        const { image, parentAd } = adImageInfo;

        return (
          <div
            key={`${parentAd.id}-${image.id}-${index}`}
            className="absolute left-0 top-0 h-full w-full"
            style={{
              visibility: index === activeIndex ? 'visible' : 'hidden',
              zIndex: index === activeIndex ? 1 : 0,
              opacity: index === activeIndex ? 1 : 0,
              transition:
                'opacity 0.5s ease-in-out, visibility 0.5s ease-in-out'
            }}
          >
            <Link
              href={appendUtmParams(parentAd.target_url)}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full w-full"
            >
              <img
                src={image.image_url}
                className="border-1 h-full w-full overflow-hidden rounded-lg border border-border object-cover"
                alt={parentAd.alt_text || 'Advertisement'}
              />
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default SideBannerCarousel;
