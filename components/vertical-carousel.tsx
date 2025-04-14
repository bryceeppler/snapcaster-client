import React, { useState, useEffect, useMemo } from 'react';
import {
  AdvertisementWithImages,
  AdvertisementImage
} from '@/types/advertisements';
import Link from 'next/link';

type VerticalCarouselProps = {
  ads: AdvertisementWithImages[];
};

// Type for combined ad image with its parent ad info
type AdImageWithParentInfo = {
  image: AdvertisementImage;
  parentAd: AdvertisementWithImages;
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

// Helper function to add UTM parameters
const appendUtmParams = (url: string): string => {
  const utmParams =
    'utm_source=sc&utm_medium=referral&utm_campaign=referral_advertisement'.trim();

  if (url.includes(utmParams)) {
    return url;
  }

  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${utmParams}`;
};

const VerticalCarousel: React.FC<VerticalCarouselProps> = ({ ads }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Combine all images from all ads and shuffle them
  const allAdImages = useMemo(() => {
    const images: AdImageWithParentInfo[] = [];

    ads.forEach((ad) => {
      ad.images.forEach((image) => {
        images.push({
          image,
          parentAd: ad
        });
      });
    });

    return shuffleArray(images);
  }, [ads]);

  useEffect(() => {
    if (allAdImages.length === 0) return;

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % allAdImages.length);
    }, 20000); // 20 seconds

    return () => clearInterval(interval);
  }, [allAdImages.length]);

  if (allAdImages.length === 0) {
    return <div className="relative h-[480px] w-[160px]"></div>;
  }

  return (
    <div className="relative z-20 h-[480px] w-[160px]">
      {allAdImages.map((adImageInfo, index) => {
        const { image, parentAd } = adImageInfo;

        return (
          <div
            key={`${parentAd.id}-${image.id}`}
            className={`${index === activeIndex ? 'active' : 'inactive'}`}
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
            <Link href={appendUtmParams(parentAd.target_url)} target="_blank">
              <img
                src={image.image_url}
                className="border-1 overflow-hidden rounded-lg border border-border"
                alt={parentAd.alt_text}
              />
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default VerticalCarousel;
