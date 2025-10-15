import type { NextPage } from 'next';

import { PageHead } from '@/components/page-head';
import ProductCatalogContainer from '@/components/product/product-catalog-container';
import { useProductSearch } from '@/hooks/queries/useProductSearch';
import { useProductSearchStore } from '@/stores/useProductSearchStore';

const SearchPage: NextPage = () => {
  const { searchTerm, selectedFilters, sortBy, region, clearFilters } =
    useProductSearchStore();

  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch
  } = useProductSearch(
    {
      searchTerm,
      selectedFilters,
      sortBy,
      region
    },
    { enabled: true }
  );

  return (
    <>
      <PageHead
        title="Snapcaster | Search All Products from 80+ Stores"
        description="Search and compare trading card game products from 80+ Canadian stores. Find the best prices on singles, sealed products, and accessories. Fast, Reliable, Local."
        url="https://www.snapcaster.ca/search"
      />
      <main className="flex w-full flex-col justify-center text-center">
        <h1 className="sr-only">
          Search all trading card game products from 80+ Canadian stores.
        </h1>
        <ProductCatalogContainer
          refetch={refetch}
          isLoading={isLoading}
          clearFilters={clearFilters}
          searchResults={data?.searchResults || []}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      </main>
    </>
  );
};

export default SearchPage;
