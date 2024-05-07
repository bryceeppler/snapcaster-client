import { type NextPage } from 'next';
import Head from 'next/head';
import MainLayout from '@/components/main-page-layout';
import ArticleHeader from '@/components/guide-components/article-header';
import Article from '@/components/guide-components/article';
import { conditionContent } from '@/articles/buyers-guide-mtg';
type Props = {};

const ConditionGuide: NextPage<Props> = () => {
  return (
    <>
      <ConditionHead></ConditionHead>
      <MainLayout>
        <ArticleHeader
          category={'MTG Card Guide'}
          title={'Card Conditions'}
        ></ArticleHeader>
        <div className="container mt-4 max-w-2xl flex-1 flex-col justify-center text-left">
          <Article content={conditionContent}></Article>
        </div>
      </MainLayout>
    </>
  );
};

export default ConditionGuide;

const ConditionHead = () => {
  return (
    <Head>
      <title>Condition Guide</title>
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
