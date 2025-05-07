'use client';

import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { useSingleSearchStore } from '@/stores/useSingleSearchStore';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import FilterSection from '@/components/search-ui/search-filter-container';
import SearchPagination from '@/components/search-ui/search-pagination';

/**
 * Toolbar component for singles search results
 * Shows result count, pagination, and filter controls
 */
export default function SinglesResultsToolbar(): JSX.Element | null {
  const {
    searchResults,
    numResults,
    currentPage,
    setCurrentPage,
    numPages,
    fetchCards,
    setIsLoading,
    filterOptions,
    sortBy,
    clearFilters,
    setFilter,
    applyFilters,
    setSortBy,
    sortByOptions
  } = useSingleSearchStore();

  // Only render if we have search results
  if (!searchResults) return null;

  return (
    <div className="z-50 flex h-12 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm">
      <span
        className="text-center text-sm font-normal text-muted-foreground"
        aria-live="polite"
      >
        {numResults} results
      </span>

      <SearchPagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        numPages={numPages}
        fetchCards={fetchCards}
        setIsLoading={setIsLoading}
      />

      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1.5 rounded-full px-2.5"
            aria-label="Open filters"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            <span>Filters</span>
          </Button>
        </SheetTrigger>

        <SheetContent className="min-w-full">
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Filter your search results</SheetDescription>

          <FilterSection
            filterOptions={filterOptions}
            sortBy={sortBy}
            fetchCards={fetchCards}
            clearFilters={clearFilters}
            setFilter={setFilter}
            setCurrentPage={setCurrentPage}
            handleSortByChange={(value: any) => {
              setSortBy(value);
              setCurrentPage(1);
              fetchCards();
            }}
            applyFilters={applyFilters}
            setSortBy={setSortBy}
            sortByOptions={sortByOptions}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
