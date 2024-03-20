import { type NextPage } from 'next';
import Head from 'next/head';
import MainLayout from '@/components/MainLayout';
import ArticleHeader from '@/components/guide-components/ArticleHeader';
import Article from '@/components/guide-components/Article';
import { showcaseContent } from '@/articles/buyers-guide-mtg';
type Props = {};

const BuyersGuide: NextPage<Props> = () => {
  return (
    <>
      <ShowcaseHead />
      <MainLayout>
        <ArticleHeader
          category={'MTG Card Guide'}
          title={'Showcase Cards'}
        ></ArticleHeader>
        <div className="container mt-4 max-w-2xl flex-1 flex-col justify-center text-left">
          <h2 className="mb-3 text-2xl font-medium">Showcase Cards</h2>
          <p className="mb-6">
            Showcase cards are alternate art versions within distinct sets. They
            can be depicted in extended art, full art, or extended art
            variations depending on the card where the term "showcase" is
            usually used as a catchall term.
          </p>
          <p className="mb-6">
            They can be categorized as regular showcase cards or put into unique
            subcategories or different showcase frames, treatments, and
            illustrations. It is not uncommon to find showcase styles found in
            one set be reused in another set.
          </p>
          <Article content={showcaseContent}></Article>
        </div>
      </MainLayout>
    </>
  );
};
export default BuyersGuide;

const ShowcaseHead = () => {
  return (
    <Head>
      <title>Showcase Guide</title>
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
