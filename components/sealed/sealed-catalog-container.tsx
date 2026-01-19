import type { QueryObserverResult } from '@tanstack/react-query';
import { SlidersHorizontal } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import BackToTopButton from '../ui/back-to-top-btn';

import FilterSheet from './filter-sheet';
import SealedCatalogItem from './sealed-catalog-item';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { useAdvertisements } from '@/hooks/queries/useAdvertisements';
import { useAuth } from '@/hooks/useAuth';
import { useSealedSearchStore } from '@/stores/useSealedSearchStore';
import type { SealedProduct } from '@/types';
import type { AdvertisementWithImages } from '@/types/advertisements';
import { AdvertisementPosition } from '@/types/advertisements';
import { sealedSortByLabel } from '@/types/query';
import type { SealedSortOptions } from '@/types/query';
import { appendUtmParameters } from '@/utils/adUrlBuilder';
import { createWeightedSelectionManager } from '@/utils/weightedSelection';

const AD_INTERVAL = 35;

// Helper function to get a random image from the advertisement pool
const getRandomAd = <T,>(items: T[]): T | undefined => {
  if (!items || !items.length) return undefined;
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
};

// Feed Ad Component to be inserted in search results
const FeedAd = ({
  ad,
  isFeatured = false
}: {
  ad: AdvertisementWithImages;
  isFeatured?: boolean;
}) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>();

  // Select a random image for the ad when it first renders
  useEffect(() => {
    if (!ad || !ad.images || !ad.images.length) return;

    // Get all active images
    const activeImages = ad.images.filter(
      (img) => img.isApproved && img.isEnabled
    );
    if (!activeImages.length) return;

    // Select a random image from the active images
    const randomImage = getRandomAd(activeImages);
    setImageUrl(randomImage?.imageUrl);
  }, [ad]);

  if (!imageUrl) return null;

  // Append UTM parameters to the URL
  const adUrl = appendUtmParameters(ad.targetUrl || '', {
    content: isFeatured ? 'feed_featured' : 'feed_inline'
  });

  return (
    <a
      href={adUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-fit flex-col overflow-hidden rounded-lg border border-border transition-shadow duration-200 hover:shadow-md"
    >
      <div className="relative">
        <img
          src={imageUrl}
          alt={ad.altText || 'Advertisement'}
          className="h-auto w-full rounded-lg object-cover"
        />
      </div>
    </a>
  );
};

interface SealedCatalogContainerProps {
  clearFilters: () => void;
  searchResults?: SealedProduct[];
  promotedResults?: SealedProduct[];
  isLoading: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  refetch: () => Promise<QueryObserverResult<unknown, Error>>;
}

export default function SealedCatalogContainer({
  searchResults,
  promotedResults,
  isLoading,
  clearFilters,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  refetch
}: SealedCatalogContainerProps) {
  const {
    sortBy,
    setSortBy: setStoreSortBy,
    selectedFilters
  } = useSealedSearchStore();

  const { hasActiveSubscription } = useAuth();
  const { getAdsByPosition } = useAdvertisements();

  // Get feed ads and manage selection
  const feedAds = useMemo(
    () => getAdsByPosition(AdvertisementPosition.FEED),
    [getAdsByPosition]
  );

  // Set up weighted selection for feed ads
  const feedAdManager = useMemo(() => {
    const manager = createWeightedSelectionManager<AdvertisementWithImages>();
    manager.setItems(feedAds);
    return manager;
  }, [feedAds]);

  // Keep track of which ad is displayed at each position and the featured ad
  const [adMap, setAdMap] = useState<Record<number, AdvertisementWithImages>>(
    {}
  );
  const [featuredAd, setFeaturedAd] = useState<AdvertisementWithImages | null>(
    null
  );

  // Generate the featured ad and interleaved ads whenever search results change
  useEffect(() => {
    if (!searchResults || hasActiveSubscription || !feedAds.length) {
      setFeaturedAd(null);
      setAdMap({});
      return;
    }

    // Select a featured ad based on weights
    const featuredAdIndex = feedAdManager.selectRandom();
    if (featuredAdIndex >= 0) {
      const featuredAd = feedAds[featuredAdIndex];
      if (featuredAd) {
        setFeaturedAd(featuredAd);
        // Set as previous selection to avoid showing the same ad in the results
        feedAdManager.setPreviousSelection(featuredAdIndex);
      }
    } else {
      setFeaturedAd(null);
    }

    // Now select ads for interleaving in the results
    const newAdMap: Record<number, AdvertisementWithImages> = {};

    // Calculate positions for the interleaved ads
    for (let i = AD_INTERVAL - 1; i < searchResults.length; i += AD_INTERVAL) {
      // Select a random ad based on weights that's different from previous selections
      const adIndex = feedAdManager.selectDifferentRandom();

      if (adIndex >= 0) {
        // Store the selected ad, then set it as previous to avoid repeats
        const ad = feedAds[adIndex];
        if (ad) {
          newAdMap[i] = ad;
          feedAdManager.setPreviousSelection(adIndex);
        }
      }
    }

    setAdMap(newAdMap);
  }, [searchResults, hasActiveSubscription, feedAds, feedAdManager]);

  // Calculate positions where ads should be shown
  const adPositions = useMemo(() => {
    if (!searchResults || hasActiveSubscription || !feedAds.length) return [];

    // Create an array of positions where ads should appear
    const positions: number[] = [];
    for (let i = AD_INTERVAL - 1; i < searchResults.length; i += AD_INTERVAL) {
      positions.push(i);
    }

    return positions;
  }, [searchResults, hasActiveSubscription, feedAds]);

  const loadMoreRef = useRef<HTMLDivElement>(null);
  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const firstEntry = entries[0];
        if (firstEntry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSortChange = async (newSortBy: SealedSortOptions) => {
    setStoreSortBy(newSortBy);
    await refetch();
  };

  return (
    <div className="mb-8 min-h-svh gap-1">
      {/* Show results section when not loading */}
      <div className="grid h-min gap-1">
        {/* #2.1 Single Search Top Bar Section (# Results, Pagination, Sort By) */}
        <div className="z-30 bg-background pt-1">
          <div className="flex flex-row items-center justify-between rounded-lg border bg-popover px-4 py-2">
            <div className="flex flex-col">
              <span className="text-center text-sm font-normal text-secondary-foreground">
                {searchResults?.length} results
              </span>
            </div>
            <Sheet>
              <SheetTitle hidden>Filters</SheetTitle>
              <SheetDescription hidden>
                Filter and sort the results
              </SheetDescription>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative h-9 gap-2 text-sm font-medium"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {selectedFilters.length > 0 && (
                    <Badge className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs">
                      {selectedFilters.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-sm">
                <FilterSheet
                  sortBy={sortBy}
                  setSortBy={(sortByValue: string | null) => {
                    if (sortByValue)
                      handleSortChange(sortByValue as SealedSortOptions);
                  }}
                  sortByLabel={sealedSortByLabel}
                  clearFilters={clearFilters}
                />
              </SheetContent>
            </Sheet>
          </div>
          <div className="bg-background pb-1"></div>
        </div>

        {/* Initial Loading State */}
        {isLoading && !searchResults && (
          <div className="grid grid-cols-2 gap-1 md:grid-cols-4 lg:grid-cols-5">
            {[...Array(24)].map((_, index) => (
              <div
                key={index}
                className="h-48 w-full animate-pulse rounded-lg bg-accent"
              ></div>
            ))}
          </div>
        )}

        {/* Results Grid */}
        {Array.isArray(searchResults) && searchResults.length > 0 && (
          <div className="grid grid-cols-2 gap-1 md:grid-cols-4 lg:grid-cols-5">
            {/* Featured Ad - displayed as first item in the grid */}
            {!hasActiveSubscription && featuredAd && (
              <FeedAd ad={featuredAd} isFeatured />
            )}

            {promotedResults &&
              !hasActiveSubscription &&
              promotedResults.map((item, index) => (
                <SealedCatalogItem product={item} key={`promoted-${index}`} />
              ))}

            {/* Regular results with interleaved ads */}
            {searchResults.map((item, index) => (
              <React.Fragment key={`result-${index}`}>
                <SealedCatalogItem product={item} />

                {/* Insert ad at specified intervals if user doesn't have a subscription */}
                {!hasActiveSubscription &&
                  adPositions.includes(index) &&
                  adMap[index] && <FeedAd ad={adMap[index]} />}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Loading Spinner for Infinite Scroll */}
        <div ref={loadMoreRef} className="h-10 w-full">
          {(isFetchingNextPage ||
            (isLoading &&
              Array.isArray(searchResults) &&
              searchResults.length > 0)) && (
            <div className="flex items-center justify-center py-4">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            </div>
          )}
        </div>
      </div>
      <BackToTopButton />
    </div>
  );
}
