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

          <h1 className="text-2xl font-bold">#1 March Development Blog</h1>
          <div className="p-4"></div>

          <p className="">
            This month has been a significant one for Snapcaster! I've optimized
            the backend infrastructure, which has greatly improved both
            reliability and performance for searches. With these enhancements
            out of the way, we can now focus on developing new features.
            Additionally, we've introduced the Snapcaster Pro membership,
            providing an avenue for users to support the development and
            maintenance of Snapcaster. Moving forward, new features will
            primarily be exclusive to Pro members. We've already begun
            implementing some of these features, and users can anticipate seeing
            them evolve over time. Note that we intend on keeping the core
            search and multisearch functionality free.
          </p>
          <div className="p-4"></div>
          <p>
            {/* discord launch , join to give us feedback, report bugs and keep up with updates~! */}
            We have also launched our Discord server, where you can join to give
            us feedback, report bugs, and keep up with updates. We're excited to
            have you join our community and look forward to hearing your
            thoughts and suggestions.
          </p>
          <div className="p-4"></div>
          {/* <Button
            className='w-full mx-auto bg-indigo-500 text-white'
          >Join the Snapcaster Discord</Button> */}
          <div className="p-4"></div>
          <h2 className="text-xl font-bold">New Features</h2>
          <div className="p-4"></div>

          <h3 className="text-lg font-bold">Wishlists</h3>
          <div className="p-2"></div>

          <ul className="list-outside list-disc space-y-2 px-6">
            <li>
              Users can now create lists of cards for easy price checking.
            </li>
            <li>
              A price notification feature is in the works, which will allow
              users to be notified when a card matching their criteria becomes
              available.
            </li>
          </ul>
          <div className="p-4"></div>
          <img
            src="/1-wishlist.png"
            alt="Wishlist feature"
            width={500}
            height={300}
            className="mx-auto rounded-lg border border-zinc-600"
          />
          <div className="p-4"></div>

          <h3 className="text-lg font-bold">Advanced Search</h3>
          <div className="p-2"></div>
          <ul className="list-outside list-disc space-y-2 px-6">
            <li>
              An advanced search feature now supports the majority of stores on
              Snapcaster.
            </li>
            <li>
              Efforts are ongoing to expand this feature to include as many
              websites on Snapcaster as possible.
            </li>
            <li>
              This tool enables users to filter by specific criteria, helping to
              exclude unwanted cards or discover deals on specific printings or
              art styles.
            </li>
          </ul>
          <div className="p-4"></div>
          <img
            src="/2-advanced.png"
            alt="Advanced search feature"
            width={500}
            height={300}
            className="mx-auto rounded-lg border border-zinc-600"
          />
          <div className="p-4"></div>

          <h3 className="text-lg font-bold">100 Card Multisearch</h3>
          <div className="p-2"></div>
          <p>
            Pro users can now search for up to 100 cards simultaneously using
            the multisearch tool.
          </p>
          <div className="p-4"></div>

          <h2 className="text-xl font-bold">17 New Stores</h2>
          <div className="p-2"></div>
          <p>
            We've revisited our to-do list this month and added a substantial
            number of the requested stores, with more to come soon!
          </p>
          <div className="p-4"></div>
          <ul className="list-outside list-disc space-y-2 px-6 sm:columns-2">
            <li>J&J Cards</li>
            <li>MTG North</li>
            <li>Dragon Fyre Games</li>
            <li>Carta Magica Ottawa</li>
            <li>Carta Magica Montreal</li>
            <li>Free Game</li>
            <li>Gods Arena</li>
            <li>Fetch Shock Games</li>
            <li>Boutique Awesome</li>
            <li>Gaming Kingdom</li>
            <li>Mecha Games</li>
            <li>Multizone</li>
            <li>Trinity Hobby</li>
            <li>Luke’s Cards</li>
            <li>Dark Crystal Cards</li>
            <li>Bootown’s Games</li>
            <li>Prisma Games Edmonton</li>
          </ul>
          <div className="p-4"></div>

          <h2 className="text-xl font-bold">
            Websites Removed from Snapcaster
          </h2>
          <div className="p-2"></div>
          <ul className="list-outside list-disc space-y-2 px-6">
            <li>North of Exile Games</li>
          </ul>
          <div className="p-4"></div>

          <p>
            This development journey continues to be an exciting one, and your
            support, especially through the Pro membership, is invaluable to us.
            Stay tuned for more updates and enhancements as we continue to work
            on Snapcaster and introduce some cool features. Thank you for being
            a part of our community!
          </p>
        </div>
      </MainLayout>
    </>
  );
};

export default Updates;

const UpdatesHead = () => {
  return (
    <Head>
      <title>March Development Update</title>
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
