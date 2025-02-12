import { type NextPage } from 'next';
import Head from 'next/head';
import Homebanner from '@/components/homebanner';
import SingleCatalog from '@/components/single-search/single-catalog-container';
import { useSingleSearchStore } from '@/stores/useSingleSearchStore';
import SearchBar from '@/components/search-ui/search-bar';

type Props = {};

const Home: NextPage<Props> = ({}: Props) => {
  const {
    searchResults,
    tcg,
    searchTerm,
    setTcg,
    setSearchTerm,
    clearSearchResults,
    fetchCards,
    clearFilters,
    isLoading,
    setIsLoading,
    setCurrentPage
  } = useSingleSearchStore();

  return (
    <>
      <HomeHead />
      <div className="flex w-full flex-col justify-center  text-center">
        {!searchResults && (
          <div className="flex flex-col items-center justify-center md:mt-6">
            <Homebanner prefixText={'Search singles for'} />
            <div className="mx-auto mt-6 flex w-full justify-center">
              <SearchBar
                searchTool="single"
                tcg={tcg}
                searchTerm={searchTerm}
                setTcg={setTcg}
                setSearchTerm={setSearchTerm}
                clearSearchResults={clearSearchResults}
                fetchCards={fetchCards}
                clearFilters={clearFilters}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </div>
        )}
        {searchResults && <SingleCatalog />}
      </div>
    </>
  );
};

export default Home;
const HomeHead = () => {
  return (
    <Head>
      <title>Snapcaster</title>
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