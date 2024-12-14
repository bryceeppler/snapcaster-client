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
    <div className="grid min-h-svh gap-1 md:grid-cols-[240px_1fr] ">
      <div className="flex flex-col gap-1 ">
        <div className="grid h-full gap-1">
          {/* Skeleton for Filters */}
          {loadingFilterResults && (
            <div className="h-full w-full animate-pulse rounded-lg bg-accent"></div>
          )}
          {!loadingFilterResults && filters && (
            <div className="relative  hidden w-full flex-col gap-1 md:flex">
              <div className="child-2 md:hidden">
                <SingleSortBy />
              </div>
              <div className="child-1 mt-1 w-full md:sticky md:top-[118px]">
                <FilterSection />
              </div>
            </div>
          )}
        </div>
      </div>

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
          <div className="z-30 hidden bg-background pt-1 md:sticky md:top-[114px] md:block">
            <div className="  flex items-center justify-between rounded-lg bg-popover px-4 py-2 ">
              <p className=" text-center text-sm font-normal text-secondary-foreground ">
                {numResults} results found
              </p>
              <div>
                <SinglePagination
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  numPages={numPages}
                  fetchCards={fetchCards}
                />
              </div>
            </div>
            <div className="bg-background pb-1"></div>
          </div>

          {searchResults && (
            <div className="grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-4">
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
        </div>
      )}
      <BackToTopButton />
    </div>
  );
}
