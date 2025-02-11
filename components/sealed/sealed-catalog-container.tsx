import { useSingleSearchStore } from '@/stores/useSingleSearchStore';
import BackToTopButton from '../ui/back-to-top-btn';
import SealedCatalogItem from './sealed-catalog-item';
import useAuthStore from '@/stores/authStore';
import useGlobalStore from '@/stores/globalStore';
import React, { useEffect, useRef } from 'react';
import { singleSortByLabel } from '@/types/query';
import SearchSortBy from '../search-ui/search-sort-by';
import SearchBar from './search-bar';
import { ProductCategory, SealedProduct } from '@/types';
import { useSealedSearchStore } from '@/stores/useSealedSearchStore';
import { SingleSortOptions } from '@/types/query';
import SortBy from './sort-by';

interface SealedCatalogContainerProps {
  productCategory: ProductCategory;
  searchTerm: string;
  setProductCategory: (productCategory: ProductCategory) => void;
  setSearchTerm: (searchTerm: string) => void;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearch: () => void;
  clearFilters: () => void;
  searchResults?: SealedProduct[];
  promotedResults?: SealedProduct[];
  numResults?: number;
  isLoading: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  refetch: () => Promise<any>;
}

export default function SealedCatalogContainer({
  searchResults,
  promotedResults,
  numResults,
  isLoading,
  productCategory,
  searchTerm,
  setProductCategory,
  setSearchTerm,
  handleInputChange,
  handleSearch,
  clearFilters,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  refetch
}: SealedCatalogContainerProps) {
  const { loadingFilterResults } = useSingleSearchStore();
  const { sortBy, setSortBy: setStoreSortBy } = useSealedSearchStore();

  const { hasActiveSubscription } = useAuthStore();

  const loadMoreRef = useRef<HTMLDivElement>(null);
  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
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

  const handleSortChange = async (newSortBy: SingleSortOptions) => {
    setStoreSortBy(newSortBy);
    await refetch();
  };

  return (
    <div className="mb-8 min-h-svh gap-1">
      {/* Show results section when not loading */}
      <div className="grid h-min gap-1">
        {/* #2.1 Single Search Top Bar Section (# Results, Pagination, Sort By) */}
        <div className="z-30 hidden bg-background pt-1 md:block">
          <div className="flex flex-row items-center justify-between rounded-lg bg-popover px-4 py-2">
            <div className="flex flex-col">

              <span className="text-center text-sm font-normal text-secondary-foreground">
                {numResults} results
              </span>
            </div>
            <SortBy
              sortBy={sortBy}
              sortByLabel={singleSortByLabel}
              setSortBy={handleSortChange}
            />
          </div>
          <div className="bg-background pb-1"></div>
        </div>

        {/* Results */}
        {searchResults && searchResults.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-1 md:grid-cols-4 lg:grid-cols-5">
              {/* {!hasActiveSubscription && initialAd && (
                  <AdComponent ad={initialAd} key={`initial-${initialAd.id}`} />
                )} */}
              {promotedResults &&
                !hasActiveSubscription &&
                promotedResults.map((item, index) => {
                  return <SealedCatalogItem product={item} key={index} />;
                })}

              {searchResults.map((item, index) => (
                <React.Fragment key={index}>
                  <SealedCatalogItem product={item} />
                </React.Fragment>
              ))}
            </div>

            {/* Infinite Scroll Loading Trigger */}
            <div ref={loadMoreRef} className="h-10 w-full">
              {isFetchingNextPage && (
                <div className="flex items-center justify-center py-4">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                </div>
              )}
            </div>
          </>
        )}
        {/* Loading Skeleton */}
        {isLoading && !isFetchingNextPage && (
          <div className="grid h-min gap-1">
            <div className="grid h-min gap-1">
              {/* Skeleton for Results Grid */}
              <div className="grid grid-cols-2 gap-1 md:grid-cols-4 lg:grid-cols-5">
                {[...Array(8)].map((_, index) => (
                  <div
                    key={index}
                    className="h-48 w-full animate-pulse rounded-lg bg-accent"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <BackToTopButton />
    </div>
  );
}
