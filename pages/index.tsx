import { type NextPage } from 'next';
import Head from 'next/head';
import Homebanner from '@/components/homebanner';
import LoadingSpinner from '@/components/loading-spinner';
import SingleSearchInfo from '@/components/single-search/single-results-info';
import { useStore } from '@/stores/store';
import usePopularCardsStore from '@/stores/popularCardsStore';
import SingleCatalog from '@/components/single-search/single-results';
import MainLayout from '@/components/main-page-layout';
import SingleSearchFilter from '@/components/single-search/single-filters';
import { useEffect } from 'react';
import { GetStaticProps } from 'next';
import { getAllBlogPosts } from '@/lib/blog';
import MultiTcgSearchbox from '@/components/single-search/multitcg-searchbox';
import useSingleStore from '@/stores/singleSearchStore';
import PoweredBy from '@/components/powered-by';

type Props = {};

const Home: NextPage<Props> = ({}: Props) => {
  const { initWebsiteInformation } = useStore();

  const { results, searchStarted, loading } = useSingleStore();
  const { fetchPopularCards } = usePopularCardsStore();

  useEffect(() => {
    fetchPopularCards();
    initWebsiteInformation();
  }, []);

  return (
    <>
      <HomeHead />
      <MainLayout>
        <div className="container relative flex w-full max-w-5xl flex-col justify-center gap-8 text-center">
          <div className="fixed left-10 top-1/4 hidden h-1/2 w-40 items-center justify-center rounded border border-zinc-600 bg-zinc-700 xl:flex">
            Tier 1 Ad
          </div>
          <div className="fixed right-10 top-1/4 hidden h-1/2 w-40 items-center justify-center rounded border border-zinc-600 bg-zinc-700 xl:flex xl:flex-col">
            <span className="flex flex-grow items-center justify-center">
              Tier 2 Ad
            </span>
            {/* five dots at end/bottom of parent container */}
            <div className="mt-auto flex justify-center gap-1 pb-4">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="h-2 w-2 rounded-full bg-zinc-600"></div>
              ))}
            </div>
          </div>

          <div className="flex h-40 w-full items-center justify-center rounded border border-zinc-600 bg-zinc-700">
            Tier 1 Ad
          </div>

          {!searchStarted && <Homebanner />}
          <PoweredBy size="small" />
          <MultiTcgSearchbox />

          {loading && (
            <div className="flex items-center justify-center pt-5">
              <LoadingSpinner />
            </div>
          )}
          {Object.keys(results).length > 0 && (
            <div>
              <SingleSearchInfo />
              <SingleSearchFilter />
              <SingleCatalog />
            </div>
          )}
          {searchStarted && !loading && Object.keys(results).length === 0 && (
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

export const getStaticProps: GetStaticProps = async () => {
  const posts = getAllBlogPosts();
  return {
    props: {
      posts
    }
  };
};
