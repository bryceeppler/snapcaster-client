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

  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<{
    imageUrl: string | undefined;
    alt: string | undefined;
    url: string | undefined;
  }>({
    imageUrl: undefined,
    alt: undefined,
    url: undefined
  });

  // Create a weighted selection manager for the ads
  const selectionManager = useMemo(() => {
    const manager = createWeightedSelectionManager<AdvertisementWithImages>();
    manager.setItems(bannerAds);
    return manager;
  }, [bannerAds]);

  // Keep track of whether it's the first render
  const isFirstRender = useRef(true);

  // Function to select a random image for the current ad
  const selectRandomImage = (ad: AdvertisementWithImages) => {
    // Get all active images for this ad
    const activeImages = ad.images.filter((img) => img.isActive);

    // Select a random image from the active images
    const randomImage = getRandomItem(activeImages);

    setSelectedImage({
      imageUrl: randomImage?.imageUrl,
      alt: ad.alt_text,
      url: ad.target_url
    });
  };

  // Select an initial ad based on weights on component mount
  useEffect(() => {
    if (!bannerAds || !bannerAds.length) return;

    if (isFirstRender.current) {
      // First render - select any ad using weights
      const initialIndex = selectionManager.selectRandom();
      if (initialIndex >= 0) {
        setCurrentAdIndex(initialIndex);
        // Store this as the previous selection to avoid showing it again next
        selectionManager.setPreviousSelection(initialIndex);
        // Select random image for this ad
        const ad = bannerAds[initialIndex];
        if (ad) selectRandomImage(ad);
      }
      isFirstRender.current = false;
    } else if (bannerAds.length > 1) {
      // Data changed - make sure we don't show the same ad again
      selectionManager.setPreviousSelection(currentAdIndex);
      const nextIndex = selectionManager.selectDifferentRandom();
      if (nextIndex >= 0) {
        setCurrentAdIndex(nextIndex);
        // Select random image for this ad
        const ad = bannerAds[nextIndex];
        if (ad) selectRandomImage(ad);
      }
    }
  }, [bannerAds, selectionManager]);

  // Set up rotation effect for interval timer
  useEffect(() => {
    if (bannerAds.length <= 1) return; // No need for rotation with 0 or 1 ads

    const rotationTimer = setInterval(() => {
      // Always select a different ad than the current one
      selectionManager.setPreviousSelection(currentAdIndex);
      const nextIndex = selectionManager.selectDifferentRandom();
      if (nextIndex >= 0) {
        setCurrentAdIndex(nextIndex);
        // Select random image for this ad
        const ad = bannerAds[nextIndex];
        if (ad) selectRandomImage(ad);
      }
    }, intervalMs);

    // Cleanup timer on component unmount
    return () => clearInterval(rotationTimer);
  }, [bannerAds, intervalMs, selectionManager, currentAdIndex]);

  // Handle case when there are no ads or no selected image
  if (!bannerAds.length || !selectedImage.imageUrl) {
    return null;
  }

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
