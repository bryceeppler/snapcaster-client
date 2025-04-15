import { useSingleSearchStore } from '@/stores/useSingleSearchStore';
import BackToTopButton from '../ui/back-to-top-btn';
import SingleCatalogItem from './single-catalog-item';
import FilterSection from '@/components/search-ui/search-filter-container';
import { useAuth } from '@/hooks/useAuth';
import AdComponent from '../ad';
import type {
  AdvertisementWithImages,
  AdvertisementWeight
} from '@/types/advertisements';
import { AdvertisementPosition } from '@/types/advertisements';
import React, { useState, useEffect, useMemo } from 'react';
import { AdSelector } from '@/utils/adSelector';
import { singleSortByLabel } from '@/types/query';
import SearchPagination from '../search-ui/search-pagination';
import SearchSortBy from '../search-ui/search-sort-by';
import { useAdvertisements } from '@/hooks/queries/useAdvertisements';
import { FEED_AD_WEIGHTS } from '@/lib/ad-weights';

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
    applyFilters
  } = useSingleSearchStore();

  const { hasActiveSubscription } = useAuth();
  const { getFeedAds } = useAdvertisements();

  const [ads, setAds] = useState<AdvertisementWithImages[]>([]);
  const [initialAd, setInitialAd] = useState<AdvertisementWithImages | null>(
    null
  );

  // Convert the FEED_AD_WEIGHTS to AdvertisementWeight[] format
  const storeWeights: AdvertisementWeight[] = useMemo(() => {
    return Object.entries(FEED_AD_WEIGHTS).map(([vendor_slug, weight]) => ({
      vendor_slug,
      position: AdvertisementPosition.FEED,
      weight
    }));
  }, []);

  useEffect(() => {
    if (!hasActiveSubscription && searchResults) {
      const feedAds = getFeedAds();
      if (feedAds?.length) {
        const selector = new AdSelector(feedAds, storeWeights);
        setInitialAd(selector.getNextAd());

        const adCount = Math.floor(searchResults.length / 11);
        const selectedAds = [];
        for (let i = 0; i < adCount; i++) {
          selectedAds.push(selector.getNextAd());
        }
        setAds(selectedAds);
      }
    }
  }, [searchResults, hasActiveSubscription, getFeedAds, storeWeights]);

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
              <div className="child-2 md:hidden">{/* <SingleSortBy /> */}</div>
              <div className="child-1 mt-1 w-full md:sticky md:top-[118px]">
                <div className="rounded-lg bg-popover px-3 py-2 text-left shadow-md md:max-w-sm">
                  <FilterSection
                    filterOptions={filterOptions}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    fetchCards={fetchCards}
                    clearFilters={clearFilters}
                    setFilter={setFilter}
                    setCurrentPage={setCurrentPage}
                    applyFilters={applyFilters}
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
            <div className="  flex flex-row items-center justify-between rounded-lg bg-popover px-4 py-2 ">
              <span className="text-center text-sm font-normal text-secondary-foreground ">
                {numResults} results
              </span>
              <div>
                <SearchPagination
                  currentPage={currentPage}
                  numPages={numPages}
                  fetchCards={fetchCards}
                  setCurrentPage={setCurrentPage}
                  setIsLoading={setIsLoading}
                />
              </div>
              <SearchSortBy
                sortBy={sortBy}
                sortByLabel={singleSortByLabel}
                setSortBy={setSortBy}
                fetchCards={fetchCards}
                setCurrentPage={setCurrentPage}
              />
            </div>
            <div className="bg-background pb-1"></div>
          </div>

          {/* #3 Single Search Result Cards Section*/}
          {searchResults && (
            <div className="grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-3 xxl:grid-cols-4">
              {!hasActiveSubscription && initialAd && (
                <AdComponent ad={initialAd} key={`initial-${initialAd.id}`} />
              )}
              {promotedResults &&
                !hasActiveSubscription &&
                promotedResults.map((item, index) => {
                  return <SingleCatalogItem product={item} key={index} />;
                })}

              {searchResults.map((item, index) => (
                <React.Fragment key={index}>
                  <SingleCatalogItem product={item} />
                  {!hasActiveSubscription &&
                    (index + 1) % 10 === 0 &&
                    ads[Math.floor(index / 10)] && (
                      <AdComponent
                        ad={ads[Math.floor(index / 10)]}
                        key={`feed-${ads[Math.floor(index / 10)].id}`}
                      />
                    )}
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
