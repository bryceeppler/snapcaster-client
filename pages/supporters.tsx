import MainLayout from '@/components/main-page-layout';
import { type NextPage } from 'next';
import { useStore } from '@/stores/store';
import Head from 'next/head';
import Link from 'next/link';
type Props = {};

const Supporters: NextPage<Props> = () => {
  const { websites } = useStore();

  return (
    <>
      <SupportersHead />
      <MainLayout>
        <div className="w-full max-w-2xl flex-1 flex-col justify-center text-center">
          <div>
            <h2 className="mb-4 text-4xl font-bold tracking-tighter">
              Our Supporters
            </h2>
            <p className="text-left">
              At Snapcaster, we are incredibly grateful for the support of the
              amazing businesses and sponsors that help us bring our vision to
              life. Their contributions play a vital role in enhancing our
              platform and ensuring that we continue to provide the best service
              to our users.
            </p>
          </div>

          {/* Sponsor Logos */}
          {/* Tier 1 */}
          <div>
            <Link href="https://obsidiangames.ca">
              <img
                src="https://s3.ca-central-1.amazonaws.com/cdn.snapcaster.ca/obsidian_games_logo.webp"
                alt="Tier 1 Sponsors"
                className="mx-auto w-1/2"
              />
            </Link>
          </div>
          {/* Tier 2 */}
          <div></div>
          {/* Tier 3 */}
          <div></div>
          <div className="my-4 text-left">
            <h3 className="mb-4 text-center text-2xl font-medium tracking-tighter">
              Collaborate with Snapcaster (Local Game Store Owners)
            </h3>
            <p>
              If you're a Local Game Store (LGS) owner and wish to feature your
              website on Snapcaster, we invite you to join our official Discord
              server and send us a direct message. We are also now offering
              exclusive advertising opportunities for your webstore on
              Snapcaster. This is an excellent chance to promote your store's
              special offers, discount codes, and events such as pre-release
              tournaments. Don't miss out on this opportunity to connect with
              our passionate audience and enhance your store's visibility.
            </p>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default Supporters;

const SupportersHead = () => {
  return (
    <Head>
      <title>Supporters</title>
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
