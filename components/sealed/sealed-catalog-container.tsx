import type { QueryObserverResult } from '@tanstack/react-query';
import { SlidersHorizontal } from 'lucide-react';
import React, { useEffect, useRef } from 'react';

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
import { useAuth } from '@/hooks/useAuth';
import { useSealedSearchStore } from '@/stores/useSealedSearchStore';
import type { SealedProduct } from '@/types';
import { sealedSortByLabel } from '@/types/query';
import type { SealedSortOptions } from '@/types/query';





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
          <div className="flex flex-row items-center justify-between rounded-lg bg-popover px-4 py-2">
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
            {promotedResults &&
              !hasActiveSubscription &&
              promotedResults.map((item, index) => (
                <SealedCatalogItem product={item} key={index} />
              ))}

            {searchResults.map((item, index) => (
              <SealedCatalogItem product={item} key={index} />
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
