import { type NextPage } from 'next';
import Head from 'next/head';
import BlogFeed from '@/components/BlogFeed';

import MainLayout from '@/components/MainLayout';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
type Props = {};

const Updates: NextPage<Props> = () => {
  return (
    <>
      <UpdatesHead />
      <MainLayout>
        <div className="container max-w-2xl flex-1 flex-col justify-center text-left">
          <div className="p-6"></div>

          <h1 className="text-2xl font-bold">#2 April Development Blog</h1>
          <div className="p-4"></div>
          <p className="">
            We hope with the launch of the new premium features last month that
            our community have been able to further save on their MTG single
            purchases. Alongside these new features came a new set of system
            design considerations, performance improvements, UX changes, and
            various bug fixes.
          </p>
          <div className="p-4"></div>
          <p>
            We’ve also been hard at work setting up systems that will help us
            standardize our data set moving forward. Now we will be able to
            better detect bad card information as we continue to fully flesh out
            advanced search, wish lists, and new features.
          </p>

          <div className="p-4"></div>
          <h2 className="text-xl font-bold">April Updates</h2>

          <div className="p-4"></div>
          <h3 className="text-lg font-bold">Single Search</h3>
          <div className="p-2"></div>
          <ul className="list-outside list-disc space-y-2 px-6">
            <li>
              Users can now switch between a list, catalog/grid, and table view
              when doing single searches.
            </li>
          </ul>

          <div className="p-4"></div>
          <img
            src="/blog-images/thumbnail-april.png"
            alt="Wishlist feature"
            width={500}
            height={300}
            className="mx-auto rounded-lg border border-zinc-600"
          />

          <div className="p-4"></div>
          <h3 className="text-lg font-bold">Wish Lists</h3>
          <div className="p-2"></div>
          <ul className="list-outside list-disc space-y-2 px-6">
            <li>
              Improved wish list performance and loading times through caching.
            </li>
            <li>Set a limit of 100 cards per wish list.</li>
          </ul>

          <div className="p-4"></div>
          <h3 className="text-lg font-bold">Advanced Search</h3>
          <div className="p-2"></div>
          <ul className="list-outside list-disc space-y-2 px-6">
            <li>
              Refactored filtering options due to card data inconsistencies
              between different websites.
            </li>
            <li>
              We spent this past month standardizing our card data being mapped
              to its corresponding set. Users can expect to get significantly
              more results returned when searching by set.
            </li>
          </ul>

          <div className="p-4"></div>
          <h3 className="text-lg font-bold">Bug Fixes</h3>
          <div className="p-2"></div>
          <ul className="list-outside list-disc space-y-2 px-6">
            <li>
              Fixed Face to Face games displaying thousands of duplicate data.
            </li>
            <li>General UI updates and fixes.</li>
          </ul>

          <div className="p-4"></div>
          <h3 className="text-lg font-bold">Added and Removed Stores</h3>
          <div className="p-2"></div>
          <ul className="list-outside list-disc space-y-2 px-6">
            <li>Added: Obsidian Games (Vernon BC).</li>
            <li>Removed: Untouchables (Mississauga, ON).</li>
          </ul>

          <div className="p-4"></div>
          <h3 className="text-lg font-bold">Other</h3>
          <div className="p-2"></div>
          <ul className="list-outside list-disc space-y-2 px-6">
            <li>Added various MTG single purchasing guides.</li>
            <li>
              Backend refactoring and Internal tools used to check the health of
              our data.
            </li>
            <li>The search bar autocomplete logic has been updated.</li>
            <li>Spent the month migrated our CDN service.</li>
          </ul>

          <div className="p-4"></div>
          <p>
            During the first half of the upcoming month, we’ll be focusing on
            bugs and UX enhancements from our to-do list. After we’re satisfied
            with those changes, the plan is to spend time fleshing out our wish
            list feature while integrating the remaining 23 websites missing in
            advanced search.
          </p>

          <div className="p-4"></div>
        </div>
      </MainLayout>
    </>
  );
};

export default Updates;

const UpdatesHead = () => {
  return (
    <Head>
      <title>April Development Update</title>
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
