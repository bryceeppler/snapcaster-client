import { type NextPage } from 'next';
import Head from 'next/head';
import Homebanner from '@/components/homebanner';
import SingleCatalog from '@/components/single-search/single-catalog-container';
import { GetStaticProps } from 'next';
import { getAllBlogPosts } from '@/lib/blog';
import { useSingleSearchStore } from '@/stores/useSingleSearchStore';
import { DollarSignIcon, GlobeIcon } from 'lucide-react';
import SearchBar from '@/components/search-ui/search-bar';

type Props = {};

const HomeContent = (
  <div className="mt-4 grid grid-cols-1 gap-8 px-2 md:grid-cols-3">
    <div className="opacity-1 filter-blur-0 transform-translate-y-[-6px] rounded-xl border bg-popover  shadow-xl will-change-auto">
      <div className="rounded-lg border border-none text-card-foreground shadow-none">
        <div className="flex flex-col items-center space-y-2 p-6">
          <div className="bg-primary-muted- flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary bg-primary-foreground">
            <GlobeIcon className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">Single Search</h3>
          <p className="text-muted-foreground">
            Search and filter for singles across 80+ Canadian local game stores!
          </p>
        </div>
      </div>
    </div>
    <div className="opacity-1 filter-blur-0 transform-translate-y-[-6px] rounded-xl border bg-popover  shadow-xl will-change-auto">
      <div className="rounded-lg border border-none text-card-foreground shadow-none">
        <div className="flex flex-col items-center space-y-2 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary bg-primary-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-zap h-6 w-6 text-primary"
            >
              <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold">Multi Search</h3>
          <p className="text-muted-foreground">
            Submit your decklist to query up to 100 trading cards at once!
          </p>
        </div>
      </div>
    </div>
    <div className="opacity-1 filter-blur-0 transform-translate-y-[-6px] rounded-xl border bg-popover  shadow-xl will-change-auto">
      <div className="rounded-lg border border-none text-card-foreground shadow-none">
        <div className="flex flex-col items-center space-y-2 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary bg-primary-foreground">
            <DollarSignIcon className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">Buylists Coming Soon</h3>
          <p className="text-muted-foreground">
            Get a direct quote for your cards from one of our partnered vendors!
            Ship your cards and get cash or credit!
          </p>
        </div>
      </div>
    </div>
  </div>
);

const Home: NextPage<Props> = ({}: Props) => {
  const {
    searchResults,
    tcg,
    searchTerm,
    setTcg,
    setSearchTerm,
    clearSearchResults,
    fetchCards,
    clearFilters
  } = useSingleSearchStore();

  return (
    <>
      <HomeHead />
      <div className="flex w-full flex-col justify-center  text-center">
        {!searchResults && (
          <div className="flex flex-col items-center justify-center md:mt-6">
            <Homebanner prefixText={'Search for'} />
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

export const getStaticProps: GetStaticProps = async () => {
  const posts = getAllBlogPosts();
  return {
    props: {
      posts
    }
  };
};
