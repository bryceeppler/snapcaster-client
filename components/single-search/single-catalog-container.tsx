import { useSingleSearchStore } from '@/stores/useSingleSearchStore';
import BackToTopButton from '../ui/back-to-top-btn';
import SingleCatalogItem from './single-catalog-item';
import FilterSection from '@/components/search-ui/search-filter-container';
import { useAuth } from '@/hooks/useAuth';
import useGlobalStore from '@/stores/globalStore';
import AdComponent from '../ad';
import type { Ad, AdWeight } from '@/types/ads';
import React, { useState, useEffect } from 'react';
import { AdSelector } from '@/utils/adSelector';
import SearchPagination from '../search-ui/search-pagination';
import SearchSortBy from '../search-ui/search-sort-by';

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
  const { getFeedAds } = useGlobalStore();

  const [ads, setAds] = useState<Ad[]>([]);
  const [initialAd, setInitialAd] = useState<Ad | null>(null);

  // Note these store_ids come from the ads database
  const storeWeights: AdWeight[] = [
    { store_id: 2, weight: 1 }, // obsidian
    { store_id: 5, weight: 1 }, // exorgames
    { store_id: 4, weight: 1 }, // chimera
    { store_id: 3, weight: 1 }, // levelup
    { store_id: 8, weight: 1 }, // houseofcards
    { store_id: 9, weight: 1 } // mythicstore
  ];

  useEffect(() => {
    if (!hasActiveSubscription && searchResults) {
      const ads = getFeedAds();
      if (ads?.length) {
        const selector = new AdSelector(ads, storeWeights);
        setInitialAd(selector.getNextAd());

        const adCount = Math.floor(searchResults.length / 11);
        const selectedAds = [];
        for (let i = 0; i < adCount; i++) {
          selectedAds.push(selector.getNextAd());
        }
        setAds(selectedAds);
      }
    }
  }, [searchResults, hasActiveSubscription]);

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
                        sortBy={sortBy}
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
