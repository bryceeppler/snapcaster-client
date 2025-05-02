import { useSingleSearchStore } from '@/stores/useSingleSearchStore';
import BackToTopButton from '../ui/back-to-top-btn';
import SingleCatalogItem from './single-catalog-item';
import FilterSection from '@/components/search-ui/search-filter-container';
import { useAuth } from '@/hooks/useAuth';
import {
  AdvertisementPosition,
  AdvertisementWithImages
} from '@/types/advertisements';
import React, { useMemo, useState, useEffect, useRef } from 'react';
import SearchPagination from '../search-ui/search-pagination';
import SearchSortBy from '../search-ui/search-sort-by';
import { useAdvertisements } from '@/hooks/queries/useAdvertisements';
import { createWeightedSelectionManager } from '@/utils/weightedSelection';
import { appendUtmParameters } from '@/utils/adUrlBuilder';

// Constant defining how often ads should appear in search results
const AD_INTERVAL = 10;

/**
 * Helper function to get a random item from an array
 */
const getRandomItem = <T,>(items: T[]): T | undefined => {
  if (!items || !items.length) return undefined;
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
};

/**
 * Feed Ad Component to be inserted in search results
 */
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
    const activeImages = ad.images.filter((img) => img.is_active);
    if (!activeImages.length) return;

    // Select a random image from the active images
    const randomImage = getRandomItem(activeImages);
    setImageUrl(randomImage?.image_url);
  }, [ad]);

  if (!imageUrl) return null;

  // Append UTM parameters to the URL
  const adUrl = appendUtmParameters(ad.target_url || '', {
    content: isFeatured ? 'feed_featured' : 'feed_inline'
  });

  return (
    <a
      href={adUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col overflow-hidden rounded-lg border border-gray-200 transition-shadow duration-200 hover:shadow-md"
    >
      <div className="relative">
        <img
          src={imageUrl}
          alt={ad.alt_text || 'Advertisement'}
          className="h-auto w-full rounded-t-lg object-cover"
        />
      </div>
    </a>
  );
};

export default function SingleCatalog() {
  const {
    searchResults,
    promotedResults,
    numResults,
    currentPage,
    numPages,
    loadingCardResults,
    loadingFilterResults,
    filters,
    filterOptions,
    sortBy,
    setIsLoading,
    fetchCards,
    setCurrentPage,
    setSortBy,
    clearFilters,
    setFilter,
    applyFilters,
    sortByOptions
  } = useSingleSearchStore();

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
      setFeaturedAd(feedAds[featuredAdIndex]);
      // Set as previous selection to avoid showing the same ad in the results
      feedAdManager.setPreviousSelection(featuredAdIndex);
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
        newAdMap[i] = feedAds[adIndex];
        feedAdManager.setPreviousSelection(adIndex);
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

  const handleSortByChange = (value: any) => {
    setSortBy(value);
    setCurrentPage(1);
    fetchCards();
  };
  return (
    <div className="mb-8 grid min-h-svh gap-1 md:grid-cols-[240px_1fr]">
      {/* #1 Single Search Filter Section */}

      <div className="flex flex-col gap-1 ">
        <div className="grid h-full gap-1">
          {loadingFilterResults && (
            <div className="h-full w-full animate-pulse rounded-lg bg-accent"></div>
          )}
          {!loadingFilterResults && filters && (
            <div className="relative  hidden w-full flex-col gap-1 md:flex">
              <div className="child-1 mt-1 w-full md:sticky md:top-[118px]">
                <div className="rounded-lg bg-popover px-3 py-2 text-left shadow-md md:max-w-sm">
                  <div className="mx-auto w-full bg-red-200">
                    <div className="sm:hidden">
                      <SearchSortBy
                        sortBy={sortBy || ''}
                        sortByOptions={sortByOptions}
                        setSortBy={setSortBy}
                        fetchCards={fetchCards}
                        setCurrentPage={setCurrentPage}
                      />
                    </div>
                  </div>

                  <FilterSection
                    filterOptions={filterOptions}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    fetchCards={fetchCards}
                    clearFilters={clearFilters}
                    setFilter={setFilter}
                    setCurrentPage={setCurrentPage}
                    handleSortByChange={handleSortByChange}
                    applyFilters={applyFilters}
                    sortByOptions={sortByOptions}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* #2 Single Search Loading Results Skeleton */}
      {loadingCardResults && (
        <div className="grid h-min gap-1">
          <div className="h-10 w-full animate-pulse rounded-lg bg-accent"></div>
          <div className="grid h-min gap-1">
            {/* Skeleton for Results Grid */}
            <div className="grid gap-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="h-96 w-full animate-pulse rounded-lg bg-accent"
                ></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!loadingCardResults && searchResults && (
        <div className="grid h-min gap-1">
          {/* #2.1 Single Search Top Bar Section (# Results, Pagination, Sort By) */}
          <div className="z-30 hidden bg-background pt-1 md:sticky md:top-[114px] md:block">
            <div className="flex items-center justify-between rounded-lg bg-popover px-4 py-2">
              {/* Empty div to balance the flex space */}
              <div className="w-24" />

              {/* Centered pagination that takes remaining space */}
              <div className="flex flex-1 justify-center">
                <SearchPagination
                  currentPage={currentPage}
                  numPages={numPages}
                  fetchCards={fetchCards}
                  setCurrentPage={setCurrentPage}
                  setIsLoading={setIsLoading}
                />
              </div>

              {/* Results count with minimum width */}
              <div className="w-24 text-right">
                <span className="whitespace-nowrap text-sm font-normal text-secondary-foreground">
                  {numResults} results
                </span>
              </div>
            </div>
            <div className="bg-background pb-1"></div>
          </div>

          {/* #3 Single Search Result Cards Section*/}
          {searchResults && (
            <div className="grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-3 xxl:grid-cols-4">
              {/* Featured Ad - displayed as first item in the grid */}
              {!hasActiveSubscription && featuredAd && (
                <FeedAd ad={featuredAd} />
              )}

              {/* Promoted results */}
              {promotedResults &&
                !hasActiveSubscription &&
                promotedResults.map((item, index) => (
                  <SingleCatalogItem product={item} key={`promoted-${index}`} />
                ))}

              {/* Regular results with interleaved ads */}
              {searchResults.map((item, index) => (
                <React.Fragment key={`result-${index}`}>
                  <SingleCatalogItem product={item} />

                  {/* Insert ad at specified intervals if user doesn't have a subscription */}
                  {!hasActiveSubscription &&
                    adPositions.includes(index) &&
                    adMap[index] && <FeedAd ad={adMap[index]} />}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      )}
      <BackToTopButton />
    </div>
  );
}
