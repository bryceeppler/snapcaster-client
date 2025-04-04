import { type NextPage } from 'next';
import Head from 'next/head';
import { useSealedSearchStore } from '@/stores/useSealedSearchStore';
import { useSealedSearch } from '@/hooks/queries/useSealedSearch';
import SealedCatalogContainer from '@/components/sealed/sealed-catalog-container';

type Props = {};

const SealedSearch: NextPage<Props> = () => {
  const {
    productCategory,
    searchTerm,
    setSearchTerm,
    selectedFilters,
    sortBy,
    region,
    setProductCategory,
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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <SealedSearchHead />
      <div className="flex w-full flex-col justify-center text-center">
        <SealedCatalogContainer
          setProductCategory={setProductCategory}
          setSearchTerm={setSearchTerm}
          handleSearch={() => {}}
          refetch={refetch}
          productCategory={productCategory}
          searchTerm={searchTerm}
          handleInputChange={handleInputChange}
          isLoading={isLoading}
          clearFilters={clearFilters}
          searchResults={data?.searchResults}
          promotedResults={data?.promotedResults}
          numResults={data?.numResults}
          filterOptions={data?.filterOptions}
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
