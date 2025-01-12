import React from 'react';
import { buylistSortByLabel } from '@/types/query';
import useBuyListStore from '@/stores/buyListStore';
import FilterSection from '@/components/search-ui/search-filter-container';
import SearchPagination from '@/components/search-ui/search-pagination';
import SearchSortBy from '@/components/search-ui/search-sort-by';
import BuyListCatalogItem from '@/components/buylists/buylist-catalog-item';

export default function BuylistCatalog() {
  const {
    numResults,
    currentPage,
    numPages,
    searchResults,
    sortBy,
    filterOptions,
    fetchCards,
    setFilter,
    setSortBy,
    setCurrentPage,
    clearFilters,
    applyFilters
  } = useBuyListStore();

  return (
    <>
      {/* #1 Filter Box Section */}
      <div className="mb-8 grid min-h-svh gap-1 md:grid-cols-[240px_1fr]">
        <div className="flex flex-col gap-1 ">
          <div className="grid h-full gap-1">
            <div className="relative  hidden w-full flex-col gap-1 md:flex">
              <div className="child-1 mt-1  w-full md:sticky md:top-[118px]">
                <div className=" rounded-lg bg-popover  px-3 py-2 text-left shadow-md md:max-w-sm">
                  <FilterSection
                    filterOptions={filterOptions}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    fetchCards={fetchCards}
                    clearFilters={clearFilters}
                    setFilter={setFilter}
                    setCurrentPage={setCurrentPage}
                    applyFilters={applyFilters}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* #2 Single Search Top Bar Section (# Results, Pagination, Sort By) */}
        <div className="grid h-min gap-1">
          <div className="z-30 hidden bg-background pt-1 md:sticky md:top-[114px] md:block">
            <div className="  flex flex-row items-center  justify-between rounded-lg bg-popover px-4 py-2 ">
              <span className="text-center text-sm font-normal text-secondary-foreground ">
                {numResults} results
              </span>
              <div>
                <SearchPagination
                  currentPage={currentPage}
                  numPages={numPages}
                  setCurrentPage={setCurrentPage}
                  fetchCards={fetchCards}
                />
              </div>
              <SearchSortBy
                sortBy={sortBy}
                sortByLabel={buylistSortByLabel}
                setSortBy={setSortBy}
                fetchCards={fetchCards}
                setCurrentPage={setCurrentPage}
              />
            </div>
            <div className="bg-background pb-1"></div>
          </div>
          {/* #3 Search Result Cards Section */}
          <div className="grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-3 xxl:grid-cols-4">
            {searchResults &&
              searchResults.map((item, index) => (
                <React.Fragment key={index}>
                  <div key={index} className="mb-2">
                    <BuyListCatalogItem key={index} cardData={item} />
                  </div>
                </React.Fragment>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
