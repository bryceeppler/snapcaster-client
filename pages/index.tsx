import { type NextPage } from 'next';
import Head from 'next/head';
import Homebanner from '@/components/Homebanner';
import SingleSearchbox from '@/components/SingleSearchbox';
import Loadingspinner from '@/components/Loadingspinner';
import SingleSearchInfo from '@/components/SingleSearchInfo';
import SearchFilters from '@/components/SingleSearchFilters';
import { useStore } from '@/store';
import SingleCatalog from '@/components/SingleCatalog';
import MainLayout from '@/components/MainLayout';

type Props = {};

const Home: NextPage<Props> = () => {
  const {
    singleSearchResults,
    singleSearchResultsLoading,
    singleSearchStarted
  } = useStore();

  return (
    <>
      <HomeHead />
      <MainLayout>
        <div className="w-full max-w-xl flex-1 flex-col justify-center text-center">
          {Object.keys(singleSearchResults).length === 0 &&
            !singleSearchStarted && (
              <div>
                <div className="p-4" />
                <Homebanner />
              </div>
            )}
          <SingleSearchbox />
          {!singleSearchStarted && !singleSearchResultsLoading && (
            <div className="mt-16 space-y-16"></div>
          )}
          {singleSearchResultsLoading && (
            <div className="flex items-center justify-center pt-5">
              <Loadingspinner />
            </div>
          )}
          {Object.keys(singleSearchResults).length > 0 && (
            <>
              <SingleSearchInfo />
              <SearchFilters />
              <SingleCatalog />
            </>
          )}
          {singleSearchStarted &&
            !singleSearchResultsLoading &&
            Object.keys(singleSearchResults).length === 0 && (
              <div className="flex items-center justify-center pt-5">
                <p className="text-gray-500">No results found</p>
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
