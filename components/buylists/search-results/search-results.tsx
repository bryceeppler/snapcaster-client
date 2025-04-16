import { useEffect, useRef, useState } from 'react';
import useBuyListStore from '@/stores/useBuylistStore';
import { useBuylistSearch } from '@/hooks/queries/useBuylistSearch';
import { BuylistCatalogItem } from './catalog-item';
import { LeftCartListSelection } from '../saved-lists/saved-lists';
import { LeftCartEditWithViewOffers } from '../modify-list-items/modify-list-items';

export const BuylistSearchResults = () => {
  const {
    searchTerm,
    tcg,
    filters,
    sortBy,
    buylistUIState,
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

  useEffect(() => {
    if (
      buylistUIState === 'listSelectionState' ||
      buylistUIState === 'searchResultsState'
    ) {
      setShouldReinitObserver(true);
    }
  }, [buylistUIState]);

  useEffect(() => {
    if (
      (shouldReinitObserver || data?.searchResults) &&
      loadMoreRef.current &&
      hasNextPage
    ) {
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
    <>
      {buylistUIState === 'listSelectionState' && (
        <div className="w-full md:w-80">
          <LeftCartListSelection />
        </div>
      )}
      {buylistUIState === 'searchResultsState' && (
        <div className="hidden md:block">
          <LeftCartEditWithViewOffers />
        </div>
      )}

      <div
        className={`  h-full w-full overflow-hidden rounded-lg  ${
          buylistUIState === 'listSelectionState' ? 'hidden md:block' : ''
        }`}
      >
        <div className=" grid grid-cols-2 gap-1   sm:grid-cols-2 below1550:grid-cols-3">
          {data?.searchResults?.map((card, index) => (
            <div className="" key={index}>
              <BuylistCatalogItem cardData={card} />
            </div>
          ))}
        </div>
        <div
          ref={loadMoreRef}
          className="h-[200svh] w-full"
          onClick={() => {
            setShouldReinitObserver(true);
          }}
        >
          {(isFetchingNextPage ||
            (isLoading &&
              Array.isArray(data?.searchResults) &&
              (data?.searchResults?.length ?? 0) > 0)) && (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
