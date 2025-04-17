import { useSingleSearchStore } from '@/stores/useSingleSearchStore';
import BackToTopButton from '../ui/back-to-top-btn';
import SingleCatalogItem from './single-catalog-item';
import FilterSection from '@/components/search-ui/search-filter-container';
import { useAuth } from '@/hooks/useAuth';
import AdComponent from '../ad';
import type { AdvertisementWithImages } from '@/types/advertisements';
import { AdvertisementPosition } from '@/types/advertisements';
import React, { useState, useEffect, useMemo } from 'react';
import SearchPagination from '../search-ui/search-pagination';
import SearchSortBy from '../search-ui/search-sort-by';
import { useAdManager } from '@/components/ads/AdManager';

// Constant defining how often ads should appear in search results
const AD_INTERVAL = 10;

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
  const { getInitialFeedAd, getIntervalAds } = useAdManager();

  const [initialAd, setInitialAd] = useState<AdvertisementWithImages | null>(
    null
  );
  const [interleaveAds, setInterleaveAds] = useState<AdvertisementWithImages[]>(
    []
  );

  // Get ads when search results change
  useEffect(() => {
    if (!hasActiveSubscription && searchResults) {
      // Get initial ad
      setInitialAd(getInitialFeedAd());

      // Get ads to interleave into search results
      const resultCount = searchResults.length;
      setInterleaveAds(getIntervalAds(resultCount, AD_INTERVAL));
    }
  }, [searchResults, hasActiveSubscription, getInitialFeedAd, getIntervalAds]);

  // Calculate positions where ads should be shown
  const adPositions = useMemo(() => {
    if (!searchResults || hasActiveSubscription) return [];

    // Create an array of positions where ads should appear
    const positions: number[] = [];
    for (let i = AD_INTERVAL - 1; i < searchResults.length; i += AD_INTERVAL) {
      positions.push(i);
    }

    return positions;
  }, [searchResults, hasActiveSubscription]);

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
              {/* Initial ad at the top */}
              {!hasActiveSubscription && initialAd && (
                <AdComponent
                  ad={initialAd}
                  position={AdvertisementPosition.FEED}
                  key={`initial-${initialAd.id}`}
                />
              )}

              {/* Promoted results */}
              {promotedResults &&
                !hasActiveSubscription &&
                promotedResults.map((item, index) => {
                  return <SingleCatalogItem product={item} key={index} />;
                })}

              {/* Regular results with interleaved ads */}
              {searchResults.map((item, index) => {
                // Check if an ad should appear after this item
                const shouldShowAd =
                  !hasActiveSubscription &&
                  adPositions.includes(index) &&
                  interleaveAds.length > 0;

                // Calculate which ad to show (handles repeated ads if necessary)
                const adIndex = Math.floor(
                  adPositions.indexOf(index) % interleaveAds.length
                );

                return (
                  <React.Fragment key={index}>
                    <SingleCatalogItem product={item} />

                    {shouldShowAd && interleaveAds[adIndex] && (
                      <AdComponent
                        ad={interleaveAds[adIndex]}
                        position={AdvertisementPosition.FEED}
                        key={`feed-${interleaveAds[adIndex].id}-pos-${index}`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>
      )}
      <BackToTopButton />
    </div>
  );
}
