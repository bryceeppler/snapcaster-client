// pages/index.tsx
import { type NextPage } from 'next';
import Head from 'next/head';
import Homebanner from '@/components/homebanner';
import SingleCatalog from '@/components/single-search/single-catalog-container';
import { GetStaticProps } from 'next';
import { getAllBlogPosts } from '@/lib/blog';
import { useSingleSearchStore } from '@/stores/useSingleSearchStore';
import PoweredBy from '@/components/powered-by';
import SingleSearchBar from '@/components/search-bar/search-bar';
import ResultsSkeleton from '@/components/single-search/results-skeleton';

type Props = {};

const Home: NextPage<Props> = ({}: Props) => {
  const { searchResults, loading } = useSingleSearchStore();

  return (
    <>
      <HomeHead />
      <div className="flex w-full flex-col justify-center gap-8 text-center">
        <Homebanner prefixText={'Search for'} />
        <PoweredBy size="small" />

        <div className="mx-auto flex w-full justify-center">
          <SingleSearchBar />
        </div>
        {loading && <ResultsSkeleton />}

        {!loading && searchResults && <SingleCatalog />}
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
