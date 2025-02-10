import { type NextPage } from 'next';
import Head from 'next/head';
import { useSealedSearchStore } from '@/stores/useSealedSearchStore';
import SealedBanner from '@/components/sealed/sealed-banner';
import { useSealedSearch } from '@/hooks/queries/useSealedSearch';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ProductCategory } from '@/types/product';
import SealedCatalogContainer from '@/components/sealed/sealed-catalog-container';
import SearchBar from '@/components/sealed/search-bar';
type Props = {};

const SealedSearch: NextPage<Props> = ({}: Props) => {
  const {
    productCategory,
    searchTerm,
    setProductCategory,
    setSearchTerm,
    filters,
    setFilters,
    sortBy,
    currentPage,
    region
  } = useSealedSearchStore();

  const { data, isLoading, refetch } = useSealedSearch(
    {
      productCategory,
      searchTerm,
      filters,
      sortBy,
      currentPage,
      region
    },
    {
      enabled: false
    }
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
  };

  const handleSearch = () => {
    setSearchTerm(searchTerm.trim());
    refetch();
  };

  return (
    <>
      <SealedSearchHead />
      <div className="flex w-full flex-col justify-center text-center">
        <div className="flex flex-col items-center justify-center md:mt-6">
          <SealedBanner prefixText={'Search sealed products for'} />
          <div className="mx-auto mt-6 flex w-full justify-center">
            <SearchBar
              productCategory={productCategory}
              searchTerm={searchTerm}
              setProductCategory={setProductCategory}
              setSearchTerm={setSearchTerm}
              handleInputChange={handleInputChange}
              handleSearch={handleSearch}
              isLoading={isLoading}
              clearFilters={() => setFilters('', '', false)}
            />
          </div>
        </div>

        <SealedCatalogContainer
          productCategory={productCategory}
          searchTerm={searchTerm}
          setProductCategory={setProductCategory}
          setSearchTerm={setSearchTerm}
          handleInputChange={handleInputChange}
          handleSearch={handleSearch}
          isLoading={isLoading}
          clearFilters={() => setFilters('', '', false)}
          searchResults={data?.searchResults}
          promotedResults={data?.promotedResults}
          filterOptions={data?.filterOptions}
          numPages={data?.numPages}
          numResults={data?.numResults}
          currentPage={currentPage}
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
        content="Search Magic the Gathering cards across Canada"
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
