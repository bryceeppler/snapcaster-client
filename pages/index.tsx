import { type NextPage } from "next";
import Head from "next/head";
import Homebanner from "@/components/Homebanner";
import SingleSearchbox from "@/components/SingleSearchbox";
import Loadingspinner from "@/components/Loadingspinner";
import SingleSearchInfo from "@/components/SingleSearchInfo";
import SearchFilters from "@/components/SingleSearchFilters";
import { useStore } from "@/store";
import SingleCatalog from "@/components/SingleCatalog";

const Home: NextPage = () => {
  const { singleSearchResults, singleSearchResultsLoading } = useStore();

  return (
    <>
      <HomeHead />
      <main className="flex min-h-screen flex-col items-center justify-between p-8">
        <div className="w-full max-w-xl flex-1 flex-col justify-center text-center">
          {Object.keys(singleSearchResults).length === 0 && (
            <div>
              <Homebanner />
            </div>
          )}
          <SingleSearchbox />
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
        </div>
      </main>
    </>
  );
};

export default Home;

const HomeHead = () => {
  return (
    <Head>
      <title>snapcaster</title>
      <meta
        name="description"
        content="Search for Magic the Gathering singles in Canada"
      />
      <meta
        property="og:title"
        content={`snapcaster - Search for Magic: the Gathering cards across Canada`}
      />
      <meta
        property="og:description"
        content={`Find your Magic the Gathering singles and sealed product using snapcaster. Search over 20 Canadian stores.`}
      />
      <meta property="og:url" content={`https://snapcaster.ca`} />
      <meta property="og:type" content="website" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};
