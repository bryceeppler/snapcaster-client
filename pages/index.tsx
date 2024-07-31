// pages/index.tsx
import { type NextPage } from 'next';
import Head from 'next/head';
import Homebanner from '@/components/homebanner';
import { useStore } from '@/stores/store';
import SingleCatalog from '@/components/single-search/single-results';
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

  useEffect(() => {
    initWebsiteInformation();
  }, []);

  return (
    <>
      <HomeHead />
      <div className="flex w-full flex-col justify-center gap-8 text-center">
        {!searchStarted && <Homebanner />}
        <PoweredBy size="small" />
        <MultiTcgSearchbox searchType={'single'} />
        {Object.keys(results).length > 0 && <SingleCatalog loading={loading} />}
        {searchStarted && !loading && Object.keys(results).length === 0 && (
          <div className="flex items-center justify-center pt-5">
            <p className="text-zinc-500">No results found. Try typing the proper card name using the autofill.</p>
          </div>
        )}
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
