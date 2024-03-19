import { type NextPage } from 'next';
import Head from 'next/head';
import BlogFeed from '@/components/BlogFeed';

import MainLayout from '@/components/MainLayout';
type Props = {};

const Updates: NextPage<Props> = () => {
  const blogs = [
    {
      title: 'March Development Blog',
      date: 'March 1, 2024',
      link: '/blog/march-dev-update',
      description:
        "This month has been a significant one for Snapcaster! I've optimized the backend infrastructure, which has greatly improved both reliability and performance for searches. With these enhancements out of the way, we can now focus on developing new features.",
      image: '/1-wishlist.png',
      imageAlt: 'Wishlist feature'
    }
  ];
  return (
    <>
      <UpdatesHead />
      <MainLayout>
        <div className="w-full max-w-2xl flex-1 flex-col justify-center text-center">
          <BlogFeed blogs={blogs} />
        </div>
      </MainLayout>
    </>
  );
};

export default Updates;

const UpdatesHead = () => {
  return (
    <Head>
      <title>Blog</title>
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
