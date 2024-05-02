import { type NextPage } from 'next';
import Head from 'next/head';
import Homebanner from '@/components/Homebanner';
import SingleSearchbox from '@/components/SingleSearchbox';
import LoadingSpinner from '@/components/LoadingSpinner';
import SingleSearchInfo from '@/components/SingleSearchInfo';
import SearchFilters from '@/components/SingleSearchFilters';
import { useStore } from '@/stores/store';
import SingleCatalog from '@/components/SingleCatalog';
import MainLayout from '@/components/MainLayout';
import SingleSearchFilter from '@/components/single-search-filters';
import AutoFillSearchBox from '@/components/AutoFillSearchBox';
import HomeUpdates from '@/components/HomeUpdates';
type Props = {};

const Home: NextPage<Props> = () => {
  const {
    singleSearchResults,
    singleSearchResultsLoading,
    singleSearchStarted,
    singleSearchInput,
    setSingleSearchInput,
    fetchSingleSearchResults
  } = useStore();

  return (
    <>
      <HomeHead />
      <MainLayout>
        <div className="container flex w-full flex-col justify-center text-center">
          {Object.keys(singleSearchResults).length === 0 &&
            !singleSearchStarted && (
              <div>
                <div />
                <Homebanner />
              </div>
            )}
          <div className="mt-6">
            <AutoFillSearchBox
              searchFunction={fetchSingleSearchResults}
              setSearchInput={setSingleSearchInput}
              searchInput={singleSearchInput}
            />
          </div>

          {!singleSearchStarted && !singleSearchResultsLoading && (
            <HomeUpdates></HomeUpdates>
          )}
          {singleSearchResultsLoading && (
            <div className="flex items-center justify-center pt-5">
              <LoadingSpinner />
            </div>
          )}
          {Object.keys(singleSearchResults).length > 0 && (
            <>
              <SingleSearchInfo />
              <SingleSearchFilter />
              <SingleCatalog />
            </>
          )}
          {singleSearchStarted &&
            !singleSearchResultsLoading &&
            Object.keys(singleSearchResults).length === 0 && (
              <div className="flex items-center justify-center pt-5">
                <p className="text-zinc-500">No results found</p>
              </div>
            )}
        </div>
      </MainLayout>
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
