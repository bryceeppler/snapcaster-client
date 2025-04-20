import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef
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

  // Generate weighted ad images based on vendor weights
  const weightedAdImages = useMemo(() => {
    return getWeightedAdImages(ads, vendorWeights, position);
  }, [ads, vendorWeights, position]);

  useEffect(() => {
    if (weightedAdImages.length === 0) return;

    const interval = setInterval(() => {
      if (!isResizingRef.current) {
        setActiveIndex(
          (prevIndex) => (prevIndex + 1) % weightedAdImages.length
        );
      }
    }, 20000); // 20 seconds

    return () => clearInterval(interval);
  }, [weightedAdImages.length]);

  if (weightedAdImages.length === 0) {
    return null;
  }

  const isLeftBanner = position === AdvertisementPosition.LEFT_BANNER;

  // Memoize the carousel items to prevent unnecessary re-renders
  const carouselItems = useMemo(() => {
    return weightedAdImages.map((adImageInfo, index) => {
      const { image, parentAd } = adImageInfo;

      return (
        <div
          key={`${parentAd.id}-${image.id}-${index}`}
          className="absolute left-0 top-0 h-full w-full"
          style={{
            visibility: index === activeIndex ? 'visible' : 'hidden',
            zIndex: index === activeIndex ? 1 : 0,
            opacity: index === activeIndex ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out, visibility 0.5s ease-in-out'
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
    });
  }, [weightedAdImages, activeIndex]);

  return (
    <div
      ref={carouselRef}
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
      {carouselItems}
    </div>
  );
};

// Use React.memo with custom comparison to prevent unnecessary re-renders
export default React.memo(SideBannerCarousel, (prevProps, nextProps) => {
  // Only re-render if ads, vendorWeights, position, or className have changed by reference
  return (
    prevProps.ads === nextProps.ads &&
    prevProps.vendorWeights === nextProps.vendorWeights &&
    prevProps.position === nextProps.position &&
    prevProps.className === nextProps.className
  );
});
