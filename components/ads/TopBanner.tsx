import React, { useState, useEffect, useMemo, useRef } from 'react';

import { useAdvertisements } from '@/hooks/queries/useAdvertisements';
import type {
  AdvertisementWithImages} from '@/types/advertisements';
import {
  AdvertisementImageType,
  AdvertisementPosition
} from '@/types/advertisements';
import { appendUtmParameters } from '@/utils/adUrlBuilder';
import { createWeightedSelectionManager } from '@/utils/weightedSelection';

interface TopBannerProps {
  className?: string;
  intervalMs?: number; // Rotation interval in milliseconds
}

/**
 * Helper function to get a random item from an array
 */
const getRandomItem = <T,>(items: T[]): T | undefined => {
  if (!items || !items.length) return undefined;
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
};

const TopBanner: React.FC<TopBannerProps> = ({
  className,
  intervalMs = 5000 // Default to 5 seconds rotation
}) => {
  const { topBannerAds } = useAdvertisements();
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [selectedImages, setSelectedImages] = useState<{
    mobile?: string;
    desktop?: string;
    alt?: string;
    url?: string;
  }>({});

  // Create a weighted selection manager for the ads
  const selectionManager = useMemo(() => {
    const manager = createWeightedSelectionManager<AdvertisementWithImages>();
    manager.setItems(topBannerAds);
    return manager;
  }, [topBannerAds]);

  // Keep track of whether it's the first render
  const isFirstRender = useRef(true);

  // Function to select random mobile and desktop images for the current ad
  const selectRandomImages = (ad: AdvertisementWithImages) => {
    // Get all mobile images for this ad
    const mobileImages = ad.images.filter(
      (img) => img.image_type === AdvertisementImageType.MOBILE && img.is_active
    );

    // Get all desktop images for this ad
    const desktopImages = ad.images.filter(
      (img) =>
        img.image_type === AdvertisementImageType.DESKTOP && img.is_active
    );

    // Select a random mobile and desktop image
    const randomMobileImage = getRandomItem(mobileImages);
    const randomDesktopImage = getRandomItem(desktopImages);

    setSelectedImages({
      mobile: randomMobileImage?.image_url,
      desktop: randomDesktopImage?.image_url,
      alt: ad.alt_text,
      url: ad.target_url
    });
  };

  // Select an initial ad based on weights on component mount
  useEffect(() => {
    if (!topBannerAds || !topBannerAds.length) return;

    if (isFirstRender.current) {
      // First render - select any ad using weights
      const initialIndex = selectionManager.selectRandom();
      if (initialIndex >= 0) {
        setCurrentAdIndex(initialIndex);
        // Store this as the previous selection to avoid showing it again next
        selectionManager.setPreviousSelection(initialIndex);
        // Select random images for this ad
        selectRandomImages(topBannerAds[initialIndex]);
      }
      isFirstRender.current = false;
    } else if (topBannerAds.length > 1) {
      // Data changed - make sure we don't show the same ad again
      selectionManager.setPreviousSelection(currentAdIndex);
      const nextIndex = selectionManager.selectDifferentRandom();
      if (nextIndex >= 0) {
        setCurrentAdIndex(nextIndex);
        // Select random images for this ad
        selectRandomImages(topBannerAds[nextIndex]);
      }
    }
  }, [topBannerAds, selectionManager]);

  // Set up rotation effect for interval timer
  useEffect(() => {
    if (topBannerAds.length <= 1) return; // No need for rotation with 0 or 1 ads

    const rotationTimer = setInterval(() => {
      // Always select a different ad than the current one
      selectionManager.setPreviousSelection(currentAdIndex);
      const nextIndex = selectionManager.selectDifferentRandom();
      if (nextIndex >= 0) {
        setCurrentAdIndex(nextIndex);
        // Select random images for this ad
        selectRandomImages(topBannerAds[nextIndex]);
      }
    }, intervalMs);

    // Cleanup timer on component unmount
    return () => clearInterval(rotationTimer);
  }, [topBannerAds, intervalMs, selectionManager, currentAdIndex]);

  // Handle case when there are no ads or no images selected
  if (
    !topBannerAds.length ||
    (!selectedImages.mobile && !selectedImages.desktop)
  ) {
    return null;
  }

  // Append UTM parameters to the URL
  const adUrl = appendUtmParameters(selectedImages.url || '', {
    content: AdvertisementPosition.TOP_BANNER.toLowerCase()
  });

  return (
    <a
      href={adUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`block aspect-[382/160] sm:aspect-[1008/160] ${
        className || ''
      }`}
    >
      {/* Mobile image (hidden on larger screens) */}
      {selectedImages.mobile && (
        <img
          src={selectedImages.mobile}
          alt={selectedImages.alt || ''}
          className="h-full w-full rounded-lg object-cover sm:hidden"
          width={382}
          height={160}
        />
      )}

      {/* Desktop image (hidden on small screens) */}
      {selectedImages.desktop && (
        <img
          src={selectedImages.desktop}
          alt={selectedImages.alt || ''}
          className="hidden h-full w-full rounded-lg object-cover sm:block"
          width={1008}
          height={160}
        />
      )}
    </a>
  );
};

export { TopBanner };
