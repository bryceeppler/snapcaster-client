import { useSingleSearchStore } from '@/stores/useSingleSearchStore';
import BackToTopButton from '../ui/back-to-top-btn';
import SingleSortBy from './single-sort-by';
import SingleCatalogItem from './single-catalog-item';
import FilterSection from './single-filter-container';
import SinglePagination from './single-pagination';
import useAuthStore from '@/stores/authStore';
import useGlobalStore from '@/stores/globalStore';
import AdComponent from '../ad';
import type { Ad } from '@/types/ads';
import React, { useState, useEffect, useMemo } from 'react';

export default function SingleCatalog() {
  const {
    searchResults,
    promotedResults,
    numResults,
    currentPage,
    setCurrentPage,
    numPages,
    fetchCards,
    loadingCardResults,
    loadingFilterResults,
    filters
  } = useSingleSearchStore();
  const { hasActiveSubscription } = useAuthStore();
  const { getRandomAd } = useGlobalStore();

  const [ads, setAds] = useState<Ad[]>([]);

  const adBeforePromoted = useMemo(() => {
    if (!hasActiveSubscription) {
      return getRandomAd('5');
    }
    return null;
  }, [hasActiveSubscription, getRandomAd]);

  useEffect(() => {
    if (!hasActiveSubscription && searchResults) {
      const adList = [];
      const adCount = Math.floor(searchResults.length / 7);
      for (let i = 0; i < adCount; i++) {
        adList.push(getRandomAd('5'));
      }
      setAds(adList);
    }
  }, [searchResults, hasActiveSubscription, getRandomAd]);

  return (
    <div className="grid min-h-svh gap-6 md:grid-cols-[240px_1fr]">
      <div className="flex flex-col gap-6">
        <div className="grid h-full gap-4">
          {/* Skeleton for Filters */}
          {loadingFilterResults && (
            <div className="h-full w-full animate-pulse rounded-lg bg-accent"></div>
          )}
          {!loadingFilterResults && filters && (
            <div className="relative flex w-full flex-col gap-2">
              <div className="child-2 md:hidden">
                <SingleSortBy />
              </div>
              <div className="child-1 w-full">
                <FilterSection />
              </div>
            </div>
          )}
        </div>
      </div>
      {loadingCardResults && (
        <div className="grid h-min gap-6">
          <div className="h-10 w-full animate-pulse rounded-lg bg-accent"></div>{' '}
          <div className="grid h-min gap-6">
            <div className="flex justify-between">
              {/* Skeleton for Heading */}
              <div className="h-8 w-40 animate-pulse rounded-lg bg-accent"></div>
              <div className="hidden md:block">
                {/* Skeleton for SingleSortBy */}
                <div className="h-10 w-40 animate-pulse rounded-lg bg-accent"></div>
              </div>
            </div>

            {/* Skeleton for Results Grid */}
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
        <div className="grid h-min gap-6">
          <div className="flex justify-between">
            <div className="flex flex-col text-left">
              <h1 className="text-2xl font-bold">Search Results</h1>
              <p className="text-sm text-gray-500">
                {numResults} results found
              </p>
            </div>
            <div className="hidden md:block">
              <SingleSortBy />
            </div>
          </div>

          {searchResults && (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {adBeforePromoted && !hasActiveSubscription && (
                <AdComponent ad={adBeforePromoted} />
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
                    (index + 1) % 6 === 0 &&
                    ads[Math.floor(index / 6)] && (
                      <AdComponent ad={ads[Math.floor(index / 6)]} />
                    )}
                </React.Fragment>
              ))}
            </div>
          )}

          {searchResults && (
            <SinglePagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              numPages={numPages}
              fetchCards={fetchCards}
            />
          )}
        </div>
      )}

      <BackToTopButton />
    </div>
  );
}
