//hooks and store states
import { useEffect, useRef, useState } from 'react';
import useBuyListStore from '@/stores/useBuylistStore';
import {
  TransformedSearchResponse,
  useBuylistSearch
} from '@/hooks/queries/useBuylistSearch';
//components
import { BuylistCatalogItem } from './catalog-item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LeftCartListSelection } from '../saved-lists/saved-lists';
import { LeftCartEditWithViewOffers } from '../modify-list-items/modify-list-items';

//other
interface BuylistSearchResultsProps {
  data: TransformedSearchResponse | undefined;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  loadMoreRef: React.RefObject<HTMLDivElement>;
  setShouldReinitObserver: (value: boolean) => void;
}

export const BuylistSearchResults = () => {
  const {
    searchTerm,
    tcg,
    filters,
    sortBy,
    leftUIState,
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

  useEffect(() => {
    setSearchResultCount(data?.numResults || 0);
  }, [data?.numResults]);

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
      leftUIState === 'leftCartListSelection' ||
      leftUIState === 'leftCartEditWithViewOffers'
    ) {
      setShouldReinitObserver(true);
    }
  }, [leftUIState]);
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

  return (
    <>
      {leftUIState === 'leftCartListSelection' && (
        <div className="w-full md:w-80">
          <LeftCartListSelection />
        </div>
      )}
      {leftUIState === 'leftCartEditWithViewOffers' && (
        <div className="hidden md:block">
          <LeftCartEditWithViewOffers />
        </div>
      )}

      <div
        className={`h-[75vh] w-full overflow-hidden rounded-lg border bg-card  ${
          leftUIState === 'leftCartListSelection' ? 'hidden md:block' : ''
        }`}
      >
        <ScrollArea className="h-full" type="always">
          <div className="grid grid-cols-2 gap-1 pr-2.5 sm:grid-cols-3 md:grid-cols-3">
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
