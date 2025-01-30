import useBuyListStore from '@/stores/buyListStore';
import FilterSection from '@/components/search-ui/search-filter-container';
import BuyListCatalogItem from '@/components/buylists/buylist-catalog-item';
import NavSearchBar from '../search-ui/nav-search-bar';
import SearchPagination from '../search-ui/search-pagination';
import SearchSortBy from '../search-ui/search-sort-by';
import { buylistSortByLabel } from '@/types/query';
export default function Search() {
  const {
    tcg,
    searchTerm,
    setTcg,
    setSearchTerm,
    clearSearchResults,

    searchResults,
    sortBy,
    filterOptions,
    fetchCards,
    setFilter,
    setSortBy,
    setCurrentPage,
    clearFilters,
    applyFilters,
    currentCart,
    numResults,
    currentPage,
    numPages
  } = useBuyListStore();

  return (
    <>
      <div>
        <div className="z-40  mb-1 rounded-lg border bg-popover px-3 py-2 md:sticky md:top-[113px]">
          <div className="flex flex-col items-center justify-center">
            <NavSearchBar
              type={'desktop'}
              searchTerm={searchTerm}
              tcg={tcg}
              fetchQuery={fetchCards}
              setSearchTerm={setSearchTerm}
              setTcg={setTcg}
              clearFilters={clearFilters}
            />
          </div>
          <div className="hidden flex-row items-center justify-between rounded-lg bg-popover px-4 pt-2 md:flex">
            <span className="text-center text-sm font-normal text-secondary-foreground">
              {numResults} results
            </span>
            <div>
              <SearchPagination
                currentPage={currentPage}
                numPages={numPages}
                fetchCards={fetchCards}
                setCurrentPage={setCurrentPage}
              />
            </div>
            <div className="w-min">
              <SearchSortBy
                sortBy={sortBy}
                sortByLabel={buylistSortByLabel}
                setSortBy={setSortBy}
                fetchCards={fetchCards}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </div>
        </div>
        <div className="mb-8 grid min-h-svh gap-1 md:grid-cols-[240px_1fr]">
          <aside className="hidden md:block">
            <div className="sticky top-[227px]">
              {searchResults && (
                <div className="rounded-lg bg-popover px-3 pb-2 shadow-md">
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
              )}
            </div>
          </aside>

          <div className="grid h-min auto-rows-auto grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-3 xxl:grid-cols-4">
            {searchResults?.map((item, index) => (
              <div key={index} className="h-full">
                <BuyListCatalogItem cardData={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
