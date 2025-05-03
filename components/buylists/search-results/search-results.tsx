import { useEffect, useRef, useState } from 'react';
import useBuyListStore from '@/stores/useBuylistStore';
import { useBuylistSearch } from '@/hooks/queries/useBuylistSearch';
import { BuylistCatalogItem } from './catalog-item';
import { SearchResultsHeader } from '../header/header';
import BuylistBackToTopButton from '@/components/buylists/ui/buylist-back-to-top-btn';

export const BuylistSearchResults = () => {
  const {
    searchTerm,
    tcg,
    filters,
    sortBy,
    setSearchResultCount,
    setDefaultSortBy,
    defaultSortBy
  } = useBuyListStore();
  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch
  } = useBuylistSearch(
    {
      tcg,
      searchTerm,
      filters: filters || [],
      sortBy
    },
    { enabled: false }
  );

  useEffect(() => {
    refetch();
  }, [filters, sortBy]);

  useEffect(() => {
    setSearchResultCount(data?.numResults || 0);
  }, [data?.numResults]);

  useEffect(() => {
    if (defaultSortBy === null && data?.defaultSortBy) {
      setDefaultSortBy(data?.defaultSortBy);
    }
  }, [data?.defaultSortBy]);

  const [shouldReinitObserver, setShouldReinitObserver] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Reset observer when new results come in
  useEffect(() => {
    if (data?.searchResults) {
      setShouldReinitObserver(true);
    }
  }, [data?.searchResults]);

  useEffect(() => {
    if (shouldReinitObserver && loadMoreRef.current && hasNextPage) {
      setShouldReinitObserver(false);
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(loadMoreRef.current);
      return () => {
        if (loadMoreRef.current) {
          observer.unobserve(loadMoreRef.current);
        }
      };
    }
  }, [
    shouldReinitObserver,
    data?.searchResults,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  ]);

  return (
    <div className="relative flex h-fit w-full flex-col space-y-4 overflow-hidden rounded-lg">
      <SearchResultsHeader />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-3  xl:grid-cols-4 xxl:grid-cols-5">
        {data?.searchResults?.map((card, index) => (
          <div key={index}>
            <BuylistCatalogItem cardData={card} />
          </div>
        ))}
      </div>

      <div
        ref={loadMoreRef}
        className="h-20 w-full"
        onClick={() => {
          setShouldReinitObserver(true);
        }}
      >
        {(isFetchingNextPage ||
          (isLoading &&
            Array.isArray(data?.searchResults) &&
            (data?.searchResults?.length ?? 0) > 0)) && (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          </div>
        )}
      </div>

      {/* Buylist-specific back to top button */}
      <BuylistBackToTopButton />
    </div>
  );
};
