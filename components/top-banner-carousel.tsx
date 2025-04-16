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

interface TopBannerCarouselProps {
  ads: AdvertisementWithImages[];
  vendorWeights?: VendorWeightConfig;
  className?: string;
}

// Function to append UTM parameters to ad URLs
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
 * Group of mobile and desktop images for a single ad
 */
interface BannerAdPair {
  parentAd: AdvertisementWithImages;
  mobileImage?: AdvertisementImage;
  desktopImage?: AdvertisementImage;
}

/**
 * Weighted random selection algorithm that considers vendor weights specifically for top banners
 */
const getWeightedTopBannerAds = (
  ads: AdvertisementWithImages[],
  vendorWeights: VendorWeightConfig = {}
): BannerAdPair[] => {
  // Group ads by vendor_slug for vendor-based weighting
  const adsByVendor: { [vendorSlug: string]: AdvertisementWithImages[] } = {};
  const defaultWeight = 1;
  const weightedAdPairs: BannerAdPair[] = [];

  // Group ads by vendor
  ads.forEach((ad) => {
    const vendorSlug = ad.vendor_slug || `vendor_${ad.vendor_id}`;
    if (!adsByVendor[vendorSlug]) {
      adsByVendor[vendorSlug] = [];
    }
    adsByVendor[vendorSlug].push(ad);
  });

  // Create weighted pairs by vendor
  Object.entries(adsByVendor).forEach(([vendorSlug, vendorAds]) => {
    const weight = vendorWeights[vendorSlug] || defaultWeight;

    // Process each ad from this vendor
    vendorAds.forEach((ad) => {
      const mobileImage = ad.images.find(
        (img) => img.image_type === AdvertisementImageType.MOBILE
      );
      const desktopImage = ad.images.find(
        (img) => img.image_type === AdvertisementImageType.DESKTOP
      );

      // Only include ads that have at least one of mobile or desktop images
      if (mobileImage || desktopImage) {
        // Add this ad pair based on its weight
        for (let i = 0; i < weight; i++) {
          weightedAdPairs.push({
            parentAd: ad,
            mobileImage,
            desktopImage
          });
        }
      }
    });
  });

  // Shuffle the weighted array
  return shuffleArray(weightedAdPairs);
};

const TopBannerCarousel: React.FC<TopBannerCarouselProps> = ({
  ads,
  vendorWeights = {},
  className
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Generate weighted ad pairs based on vendor weights
  const weightedAdPairs = useMemo(() => {
    return getWeightedTopBannerAds(ads, vendorWeights);
  }, [ads, vendorWeights]);

  useEffect(() => {
    if (weightedAdPairs.length === 0) return;

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % weightedAdPairs.length);
    }, 20000); // 20 seconds

    return () => clearInterval(interval);
  }, [weightedAdPairs.length]);

  if (weightedAdPairs.length === 0) {
    return null;
  }

  // Create separate aspect ratio containers for mobile and desktop
  return (
    <div
      className={cn(
        'top-banner-carousel-container relative w-full overflow-hidden rounded-lg',
        className
      )}
    >
      {/* Desktop Banner Container */}
      <div className="hidden w-full sm:block" style={{ position: 'relative' }}>
        <div
          style={{ aspectRatio: AD_DIMENSIONS.topBanner.desktop.aspectRatio }}
        >
          {weightedAdPairs.map((adPair, index) => {
            const { parentAd, desktopImage, mobileImage } = adPair;
            const imageToShow = desktopImage || mobileImage; // Use mobile as fallback

            if (!imageToShow) return null;

            return (
              <div
                key={`desktop-${parentAd.id}-${index}`}
                className="absolute left-0 top-0 h-full w-full"
                style={{
                  visibility: index === activeIndex ? 'visible' : 'hidden',
                  opacity: index === activeIndex ? 1 : 0,
                  transition:
                    'opacity 0.5s ease-in-out, visibility 0.5s ease-in-out',
                  zIndex: index === activeIndex ? 1 : 0
                }}
              >
                <Link
                  href={appendUtmParams(parentAd.target_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full w-full"
                >
                  <img
                    src={imageToShow.image_url}
                    className="border-1 h-full w-full overflow-hidden rounded-lg border border-border object-cover"
                    alt={parentAd.alt_text || 'Advertisement'}
                  />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Banner Container */}
      <div className="block w-full sm:hidden" style={{ position: 'relative' }}>
        <div
          style={{ aspectRatio: AD_DIMENSIONS.topBanner.mobile.aspectRatio }}
        >
          {weightedAdPairs.map((adPair, index) => {
            const { parentAd, mobileImage, desktopImage } = adPair;
            const imageToShow = mobileImage || desktopImage; // Use desktop as fallback

            if (!imageToShow) return null;

            return (
              <div
                key={`mobile-${parentAd.id}-${index}`}
                className="absolute left-0 top-0 h-full w-full"
                style={{
                  visibility: index === activeIndex ? 'visible' : 'hidden',
                  opacity: index === activeIndex ? 1 : 0,
                  transition:
                    'opacity 0.5s ease-in-out, visibility 0.5s ease-in-out',
                  zIndex: index === activeIndex ? 1 : 0
                }}
              >
                <Link
                  href={appendUtmParams(parentAd.target_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full w-full"
                >
                  <img
                    src={imageToShow.image_url}
                    className="border-1 h-full w-full overflow-hidden rounded-lg border border-border object-cover"
                    alt={parentAd.alt_text || 'Advertisement'}
                  />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TopBannerCarousel;
