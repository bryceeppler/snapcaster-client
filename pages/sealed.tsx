import { type NextPage } from 'next';
import Head from 'next/head';

import SealedCatalogContainer from '@/components/sealed/sealed-catalog-container';
import { useSealedSearch } from '@/hooks/queries/useSealedSearch';
import { useSealedSearchStore } from '@/stores/useSealedSearchStore';

const SealedSearch: NextPage = () => {
  const {
    productCategory,
    searchTerm,
    selectedFilters,
    sortBy,
    region,
    clearFilters
  } = useSealedSearchStore();

  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch
  } = useSealedSearch(
    {
      productCategory,
      searchTerm,
      selectedFilters,
      sortBy,
      region
    },
    { enabled: true }
  );

  return (
    <>
      <SealedSearchHead />
      <div className="flex w-full flex-col justify-center text-center">
        <SealedCatalogContainer
          refetch={refetch}
          isLoading={isLoading}
          clearFilters={clearFilters}
          searchResults={data?.searchResults || []}
          promotedResults={data?.promotedResults || []}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </>
  );
};

export default SealedSearch;

const SealedSearchHead = () => {
  return (
    <Head>
      <title>Sealed Search</title>
      <meta
        name="description"
        content="Search Magic the Gathering sealed products across Canada"
      />
      <meta
        property="og:title"
        content={`Snapcaster - Search Magic the Gathering cards across Canada`}
      />
      <meta
        property="og:description"
        content={`Find Magic the Gathering singles and sealed product using in Snapcaster. Search your favourite Canadian stores.`}
      />
      <meta property="og:url" content={`https://snapcaster.ca`} />
      <meta property="og:type" content="website" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};
