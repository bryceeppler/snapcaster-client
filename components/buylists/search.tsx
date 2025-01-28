import useBuyListStore from '@/stores/buyListStore';
import FilterSection from '@/components/search-ui/search-filter-container';
import BuyListCatalogItem from '@/components/buylists/buylist-catalog-item';
export default function Search() {
  const {
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
      <div className="mb-8 grid min-h-svh gap-1 md:grid-cols-[240px_1fr]">
        <aside className="hidden md:block">
          <div className="sticky top-[227px] ">
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

        <div className="grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-3 xxl:grid-cols-4">
          {searchResults?.map((item, index) => (
            <div key={index} className="mb-1">
              <BuyListCatalogItem cardData={item} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
