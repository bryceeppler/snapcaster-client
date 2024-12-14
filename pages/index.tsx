import { type NextPage } from 'next';
import Head from 'next/head';
import Homebanner from '@/components/homebanner';
import SingleCatalog from '@/components/single-search/single-catalog-container';
import { GetStaticProps } from 'next';
import { getAllBlogPosts } from '@/lib/blog';
import { useSingleSearchStore } from '@/stores/useSingleSearchStore';
import { Button } from '@/components/ui/button';
import { ChevronRightIcon } from 'lucide-react';

type Props = {};
const Home: NextPage<Props> = ({}: Props) => {
  const { searchResults } = useSingleSearchStore();
  return (
    <>
      <HomeHead />
      <div className="flex w-full flex-col justify-center  text-center">
        {!searchResults && (
          <>
            <Homebanner prefixText={'Search for'} />
            <div className="mt-4 flex items-center justify-center ">
              <Button className="group w-min rounded-lg bg-primary">
                Search Now{' '}
                <ChevronRightIcon className="ml-1 size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </div>
          </>
        )}
        <SingleCatalog />
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
