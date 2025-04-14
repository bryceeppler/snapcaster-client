//hooks and store states
import { useEffect, useRef, useState } from 'react';
import useBuyListStore from '@/stores/useBuylistStore';
import { useBuylistSearch } from '@/hooks/queries/useBuylistSearch';
//components
import { BuylistCatalogItem } from './catalog-item';
import { ScrollArea } from '@/components/ui/scroll-area';
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

  // Refetch Search Results: When the sortBy or selected filters change, refetch the search results
  useEffect(() => {
    refetch();
  }, [filters, sortBy]);

  // Set the number of search results
  useEffect(() => {
    setSearchResultCount(data?.numResults || 0);
  }, [data?.numResults]);

  // Set the default sort by
  useEffect(() => {
    if (defaultSortBy === null && data?.defaultSortBy) {
      setDefaultSortBy(data?.defaultSortBy);
    }
  }, [data?.defaultSortBy]);

  // Infinite Scroll Obsesrver: This useState is needed to reinitialize the observer when the UI state changes off the search results state
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
  // Infinite Scroll Observer: Fetch more results when the user scrolls to the bottom of the page
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

  const {} = useBuyListStore();

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
        className={`h-[75vh] w-full  overflow-hidden rounded-lg  bg-card pt-1  ${
          buylistUIState === 'listSelectionState' ? 'hidden md:block' : ''
        }`}
      >
        <ScrollArea className="h-full px-1" type="always">
          <div className=" grid grid-cols-2 gap-1  pr-1.5 sm:grid-cols-2 below1550:grid-cols-3">
            {data?.searchResults?.map((card, index) => (
              <div className="" key={index}>
                <BuylistCatalogItem cardData={card} />
              </div>
            ))}
          </div>
          <div
            ref={loadMoreRef}
            className="h-10 w-full"
            onClick={() => {
              setShouldReinitObserver(true);
            }}
          >
            {(isFetchingNextPage ||
              (isLoading &&
                Array.isArray(data?.searchResults) &&
                data?.searchResults.length > 0)) && (
              <div className="flex items-center justify-center py-4">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );
};
