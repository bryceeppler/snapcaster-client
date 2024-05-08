import { type NextPage } from 'next';
import Head from 'next/head';
import Homebanner from '@/components/homebanner';
import LoadingSpinner from '@/components/loading-spinner';
import SingleSearchInfo from '@/components/single-search/single-results-info';
import { useStore } from '@/stores/store';
import useGlobalStore from '@/stores/globalStore';
import SingleCatalog from '@/components/single-search/single-results';
import MainLayout from '@/components/main-page-layout';
import SingleSearchFilter from '@/components/single-search/single-filters';
import PopularSearchCarousel from '@/components/popular-search-carousel';
import { useEffect } from 'react';
import AutoFillSearchBox from '@/components/autofill-searchbox';
import { GetStaticProps } from 'next';
import { getAllBlogPosts } from '@/lib/blog';
import BlogFeed from '@/components/blog-feed';
import type { BlogPostPreview } from '@/pages/blog';

type Props = {
  posts: BlogPostPreview[];
};

const Home: NextPage<Props> = ({ posts }: Props) => {
  const {
    singleSearchResults,
    singleSearchResultsLoading,
    singleSearchStarted,
    singleSearchInput,
    setSingleSearchInput,
    fetchSingleSearchResults,
    initWebsiteInformation
  } = useStore();

  const { fetchPopularCards } = useGlobalStore();

  useEffect(() => {
    fetchPopularCards();
    initWebsiteInformation();
  }, []);

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
          {Object.keys(singleSearchResults).length === 0 &&
            !singleSearchStarted && (
              <div>
                <div className="p-4" />
                <PopularSearchCarousel />
              </div>
            )}
          {Object.keys(singleSearchResults).length === 0 &&
            !singleSearchStarted && (
              <div>
                <div className="p-4" />
                <div className="text-2xl font-bold">Recent Posts </div>
                <div className="p-4" />

                <BlogFeed posts={posts} />
              </div>
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

export const getStaticProps: GetStaticProps = async () => {
  const posts = getAllBlogPosts();
  return {
    props: {
      posts
    }
  };
};
