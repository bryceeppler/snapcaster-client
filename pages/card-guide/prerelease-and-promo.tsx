import { type NextPage } from 'next';
import Head from 'next/head';
import MainLayout from '@/components/main-page-layout';
import exp from 'constants';

import ArticleHeader from '@/components/guide-components/article-header';
import Article from '@/components/guide-components/article';
import { prereleasePromoContent } from '@/articles/buyers-guide-mtg';
type Props = {};

const BuyersGuide: NextPage<Props> = () => {
  return (
    <>
      <PrereleasePromoGuideHead />
      <MainLayout>
        <>
          <ArticleHeader
            category={'MTG Card Guide'}
            title={'Pre-release and Promo Cards'}
          ></ArticleHeader>

          <div className="container mt-4 max-w-2xl flex-1 flex-col justify-center text-left">
            <Article content={prereleasePromoContent}></Article>
            <p className="mb-6">
              In summary, all pre-release cards are a type of promo card but not
              all promo cards are necessarily a pre-release card. Each card
              comes with their own unique characteristics not typically found in
              their regular sets.
            </p>
          </div>
        </>
      </MainLayout>
    </>
  );
};
export default BuyersGuide;

const PrereleasePromoGuideHead = () => {
  return (
    <Head>
      <title>Prerelease and Promo Guide</title>
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
