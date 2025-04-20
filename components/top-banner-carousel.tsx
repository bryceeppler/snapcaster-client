import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback
} from 'react';
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

// Function to append UTM parameters to ad URLs - memoized helper for consistency
const appendUtmParams = (url: string): string => {
  const utmParams =
    'utm_source=sc&utm_medium=referral&utm_campaign=referral_advertisement'.trim();

  if (url.includes(utmParams)) {
    return url;
  }

  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${utmParams}`;
};

// Function to shuffle an array - memoized helper for consistency
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
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isResizingRef = useRef(false);

  // Handle window resize events to prevent multiple re-renders
  useEffect(() => {
    const handleResize = () => {
      if (!isResizingRef.current) {
        isResizingRef.current = true;
      }

      // Clear any existing timeout
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      // Set a timeout to mark the end of resize event
      resizeTimeoutRef.current = setTimeout(() => {
        isResizingRef.current = false;
      }, 200);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);

  // Generate weighted ad pairs based on vendor weights
  const weightedAdPairs = useMemo(() => {
    return getWeightedTopBannerAds(ads, vendorWeights);
  }, [ads, vendorWeights]);

  useEffect(() => {
    if (weightedAdPairs.length === 0) return;

    const interval = setInterval(() => {
      if (!isResizingRef.current) {
        setActiveIndex((prevIndex) => (prevIndex + 1) % weightedAdPairs.length);
      }
    }, 20000); // 20 seconds

    return () => clearInterval(interval);
  }, [weightedAdPairs.length]);

  if (weightedAdPairs.length === 0) {
    return null;
  }

  // Memoize the desktop carousel items
  const desktopCarouselItems = useMemo(() => {
    return weightedAdPairs.map((adPair, index) => {
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
            transition: 'opacity 0.5s ease-in-out, visibility 0.5s ease-in-out',
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
    });
  }, [weightedAdPairs, activeIndex]);

  // Memoize the mobile carousel items
  const mobileCarouselItems = useMemo(() => {
    return weightedAdPairs.map((adPair, index) => {
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
            transition: 'opacity 0.5s ease-in-out, visibility 0.5s ease-in-out',
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
    });
  }, [weightedAdPairs, activeIndex]);

  // Create separate aspect ratio containers for mobile and desktop
  return (
    <div
      ref={carouselRef}
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
          {desktopCarouselItems}
        </div>
      </div>

      {/* Mobile Banner Container */}
      <div className="block w-full sm:hidden" style={{ position: 'relative' }}>
        <div
          style={{ aspectRatio: AD_DIMENSIONS.topBanner.mobile.aspectRatio }}
        >
          {mobileCarouselItems}
        </div>
      </div>
    </div>
  );
};

// Use React.memo with custom comparison to prevent unnecessary re-renders
export default React.memo(TopBannerCarousel, (prevProps, nextProps) => {
  // Only re-render if ads or vendorWeights have changed by reference
  // or if className has changed
  return (
    prevProps.ads === nextProps.ads &&
    prevProps.vendorWeights === nextProps.vendorWeights &&
    prevProps.className === nextProps.className
  );
});
