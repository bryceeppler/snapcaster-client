import { type NextPage } from 'next';
import Head from 'next/head';
import BlogFeed from '@/components/blog-feed';

import MainLayout from '@/components/main-page-layout';
type Props = {};

const Updates: NextPage<Props> = () => {
  const blogs = [
    {
      title: 'April Development Blog',
      date: 'April 1, 2024',
      link: '/blog/april-dev-update',
      description:
        'UX changes, back-end refactoring, bug fixes, card purchasing guides, and more.',
      // image: '/blog-images/thumbnail-april.png',
      image: '/blog-images/april-thumbnail.png',
      imageAlt: 'Wishlist feature'
    },
    {
      title: 'March Development Blog',
      date: 'March 1, 2024',
      link: '/blog/march-dev-update',
      description:
        'New premium features, websites, community Discord, and search optimizations.',
      // "This month has been a significant one for Snapcaster! I've optimized the backend infrastructure, which has greatly improved both reliability and performance for searches. With these enhancements out of the way, we can now focus on developing new features.",
      // image: '/blog-images/thumbnail-march.png',
      image: '/blog-images/march-thumbnail.png',
      imageAlt: 'Wishlist feature'
    }
  ];
  return (
    <>
      <UpdatesHead />
      <MainLayout>
        <div className="w-full max-w-2xl flex-1 flex-col justify-center text-center">
          <BlogFeed
            pagetitle="Snapcaster Blog"
            pageDescription="Stay up to date with the latest changes."
            blogs={blogs}
          />
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
