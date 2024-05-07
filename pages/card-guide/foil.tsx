import { type NextPage } from 'next';
import Head from 'next/head';
import MainLayout from '@/components/main-page-layout';
import ArticleHeader from '@/components/guide-components/article-header';
import Article from '@/components/guide-components/article';
import { foilContent } from '@/articles/buyers-guide-mtg';
type Props = {};

const BuyersGuide: NextPage<Props> = () => {
  return (
    <>
      <FoilHead />
      <MainLayout>
        <ArticleHeader
          category={'MTG Card Guide'}
          title={'Foil Types'}
        ></ArticleHeader>
        <div className="container mt-4 max-w-2xl flex-1 flex-col justify-center text-left">
          <Article content={foilContent}></Article>
        </div>
      </MainLayout>
    </>
  );
};
export default BuyersGuide;

const FoilHead = () => {
  return (
    <Head>
      <title>Foil Guide</title>
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
