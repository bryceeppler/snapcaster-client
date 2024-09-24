import { useSingleSearchStore } from "@/stores/useSingleSearchStore";

import BackToTopButton from "../ui/back-to-top-btn";

import SingleSortBy from "./single-sort-by";
import SingleCatalogItem from "./single-catalog-item";
import FilterSection from "./single-filter-container";
import SinglePagination from "./single-pagination";

export default function SingleCatalog() {
  const { searchResults, promotedResults } = useSingleSearchStore();

  return (
    <div className="grid min-h-svh gap-6 md:grid-cols-[240px_1fr]">
      <div className="flex flex-col gap-6">
        <div className="grid gap-4">
          <div className="relative flex w-full gap-2">
            <div className="child-1 w-1/2 md:w-full">
              <FilterSection />
            </div>
            <div className="child-2 w-1/2 md:hidden">
              <SingleSortBy/>
            </div>
          </div>
        </div>
      </div>
      <div className="grid h-min gap-6">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Search Results</h1>
          <div className="hidden md:block">
            <SingleSortBy />
          </div>
        </div>

        {searchResults && (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
            {promotedResults &&
              promotedResults.map((item, index) => {
                return <SingleCatalogItem product={item} key={index} />;
              })}
            {searchResults.map((item, index) => {
              return <SingleCatalogItem product={item} key={index} />;
            })}
          </div>
        )}
        {searchResults && (
          <SinglePagination />
        )}
      </div>
      <BackToTopButton />
    </div>
  );
}
