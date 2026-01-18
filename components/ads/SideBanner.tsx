import React, { useEffect, useMemo, useRef, useState } from 'react';

import { useAdvertisements } from '@/hooks/queries/useAdvertisements';
import type { AdvertisementWithImages } from '@/types/advertisements';
import { AdvertisementPosition } from '@/types/advertisements';
import { appendUtmParameters } from '@/utils/adUrlBuilder';
import { createWeightedSelectionManager } from '@/utils/weightedSelection';

interface SideBannerProps {
  position: AdvertisementPosition;
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

const SideBanner: React.FC<SideBannerProps> = ({
  position,
  className,
  intervalMs = 5000 // Default to 5 seconds rotation
}) => {
  const { getAdsByPosition } = useAdvertisements();
  const bannerAds = useMemo(
    () => getAdsByPosition(position),
    [getAdsByPosition, position]
  );

  // Create a weighted selection manager for the ads
  const selectionManager = useMemo(() => {
    const manager = createWeightedSelectionManager<AdvertisementWithImages>();
    manager.setItems(bannerAds);
    return manager;
  }, [bannerAds]);

  // Helper function for synchronous initialization
  const getInitialAdWithImage = () => {
    if (!bannerAds || !bannerAds.length) {
      return { index: -1, image: null, ad: null };
    }

    const triedIndices = new Set<number>();

    while (triedIndices.size < bannerAds.length) {
      const candidateIndex = selectionManager.selectRandom();

      if (candidateIndex < 0 || triedIndices.has(candidateIndex)) {
        break;
      }

      triedIndices.add(candidateIndex);
      const ad = bannerAds[candidateIndex];

      if (ad) {
        const activeImages = ad.images.filter(
          (img) => img.isApproved && img.isEnabled
        );

        if (activeImages.length > 0) {
          const randomImage = getRandomItem(activeImages);
          if (randomImage) {
            selectionManager.setPreviousSelection(candidateIndex);
            return {
              index: candidateIndex,
              image: randomImage,
              ad
            };
          }
        }
      }
    }

    return { index: -1, image: null, ad: null };
  };

  // Initialize state with lazy initializers to prevent flash
  const [currentAdIndex, setCurrentAdIndex] = useState(() => {
    const initial = getInitialAdWithImage();
    return initial.index >= 0 ? initial.index : 0;
  });

  const [selectedImage, setSelectedImage] = useState<{
    imageUrl: string | undefined;
    alt: string | undefined;
    url: string | undefined;
  }>(() => {
    const initial = getInitialAdWithImage();
    if (initial.image && initial.ad) {
      return {
        imageUrl: initial.image.imageUrl,
        alt: initial.ad.altText,
        url: initial.ad.targetUrl
      };
    }
    return {
      imageUrl: undefined,
      alt: undefined,
      url: undefined
    };
  });

  // Keep track of whether it's the first render
  const isFirstRender = useRef(true);

  // Function to select a random image for the current ad
  // Returns true if successful, false if no active images available
  const selectRandomImage = (ad: AdvertisementWithImages): boolean => {
    // Get all active images for this ad
    const activeImages = ad.images.filter(
      (img) => img.isApproved && img.isEnabled
    );

    // If no active images, return false
    if (!activeImages.length) {
      return false;
    }

    // Select a random image from the active images
    const randomImage = getRandomItem(activeImages);

    if (randomImage) {
      setSelectedImage({
        imageUrl: randomImage.imageUrl,
        alt: ad.altText,
        url: ad.targetUrl
      });
      return true;
    }

    return false;
  };

  // Helper function to find an ad with active images
  const selectAdWithActiveImage = (
    excludeIndices: number[] = [],
    maxAttempts: number = 10
  ): number => {
    let attempts = 0;
    const triedIndices = new Set<number>(excludeIndices);

    while (attempts < maxAttempts && triedIndices.size < bannerAds.length) {
      // Select a random ad index that hasn't been tried yet
      const candidateIndex =
        triedIndices.size === 0
          ? selectionManager.selectRandom()
          : selectionManager.selectDifferentRandom();

      if (candidateIndex < 0 || triedIndices.has(candidateIndex)) {
        attempts++;
        continue;
      }

      triedIndices.add(candidateIndex);
      const ad = bannerAds[candidateIndex];

      if (ad && selectRandomImage(ad)) {
        // Successfully found an ad with active images
        selectionManager.setPreviousSelection(candidateIndex);
        return candidateIndex;
      }

      attempts++;
    }

    return -1; // No ad with active images found
  };

  // Handle data changes after initial mount
  useEffect(() => {
    if (!bannerAds || !bannerAds.length) return;

    // Skip first render only if we already have a valid image
    if (isFirstRender.current) {
      isFirstRender.current = false;
      // If we don't have a valid image yet, try to select one now
      if (!selectedImage.imageUrl) {
        const nextIndex = selectAdWithActiveImage();
        if (nextIndex >= 0) {
          setCurrentAdIndex(nextIndex);
        }
      }
      return;
    }

    // Data changed - select a new ad with active images
    if (bannerAds.length > 0) {
      const nextIndex = selectAdWithActiveImage([currentAdIndex]);
      if (nextIndex >= 0) {
        setCurrentAdIndex(nextIndex);
      }
    }
  }, [bannerAds, selectionManager]);

  // Set up rotation effect for interval timer
  useEffect(() => {
    if (bannerAds.length <= 1) return; // No need for rotation with 0 or 1 ads

    const rotationTimer = setInterval(() => {
      // Find the next ad with active images, excluding the current one
      const nextIndex = selectAdWithActiveImage([currentAdIndex]);
      if (nextIndex >= 0) {
        setCurrentAdIndex(nextIndex);
      }
    }, intervalMs);

    // Cleanup timer on component unmount
    return () => clearInterval(rotationTimer);
  }, [bannerAds, intervalMs, selectionManager, currentAdIndex]);

  // Handle case when there are no ads or no selected image
  if (!bannerAds.length || !selectedImage.imageUrl) {
    return null;
  }

  console.log(bannerAds);
  // Different position and styling based on the banner position
  const positionStyles =
    position === AdvertisementPosition.LEFT_BANNER
      ? 'fixed left-0 top-1/2 transform -translate-y-1/2 ml-4 z-10'
      : 'fixed right-0 top-1/2 transform -translate-y-1/2 mr-4 z-10';

  // Append UTM parameters to the URL
  const adUrl = appendUtmParameters(selectedImage.url || '', {
    content: position.toLowerCase()
  });

  return (
    <a
      href={adUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`hidden xl:block ${positionStyles} ${className || ''}`}
    >
      <img
        src={selectedImage.imageUrl}
        alt={selectedImage.alt || ''}
        className="w-[160px] rounded-lg object-cover"
        width={160}
        height={600}
      />
    </a>
  );
};

// Use React.memo with custom comparison function to prevent unnecessary re-renders
const SideBannerMemo = React.memo(SideBanner, (prevProps, nextProps) => {
  // Only re-render if position, className or intervalMs has changed
  return (
    prevProps.position === nextProps.position &&
    prevProps.className === nextProps.className &&
    prevProps.intervalMs === nextProps.intervalMs
  );
});

export { SideBannerMemo as SideBanner };
