import { type NextPage } from 'next';
import { useStore } from '@/stores/store';
import Head from 'next/head';
import Link from 'next/link';
import PageTitle from '@/components/ui/page-title';
type Props = {};

const Supporters: NextPage<Props> = () => {
  const { websites } = useStore();

  return (
    <>
      <SupportersHead />
      <section className="w-full">
        <div className="container px-4 md:px-6">
          <div className="space-y-8">
            <PageTitle
              title="Our Supporters"
              subtitle="We're grateful for the support of these amazing companies."
            />
            <div className="space-y-12 text-center">
              <div>
                <h3 className="mb-6 text-2xl font-bold">Tier 1 Sponsor</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div className="flex items-center justify-center">
                    <Link href="https://obsidiangames.ca">
                      <img
                        alt="Obsidian Games Vernon"
                        className="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
                        height="200"
                        src="https://cdn.snapcaster.ca/obsidian_supporter.png"
                        width="400"
                      />
                    </Link>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="mb-6 text-2xl font-bold">Tier 2 Sponsors</h3>
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  <div className="flex items-center justify-center">
                    <Link
                      href="/contact"
                      className=" aspect-video w-48 rounded border bg-popover"
                    ></Link>
                  </div>
                  <div className="flex items-center justify-center">
                    <Link
                      href="/contact"
                      className=" aspect-video w-48 rounded border bg-popover"
                    ></Link>
                  </div>{' '}
                  <div className="flex items-center justify-center">
                    <Link
                      href="/contact"
                      className=" aspect-video w-48 rounded border bg-popover"
                    ></Link>
                  </div>{' '}
                  <div className="flex items-center justify-center">
                    <Link
                      href="/contact"
                      className=" aspect-video w-48 rounded border bg-popover"
                    ></Link>
                  </div>{' '}
                  <div className="flex items-center justify-center">
                    <Link
                      href="/contact"
                      className=" aspect-video w-48 rounded border bg-popover"
                    ></Link>
                  </div>{' '}
                </div>
              </div>
              <div>
                <h3 className="mb-6 text-2xl font-bold">Tier 3 Sponsors</h3>
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  <div className="flex items-center justify-center">
                    <Link
                      href="/contact"
                      className=" aspect-video w-32 rounded border bg-popover"
                    ></Link>
                  </div>
                  <div className="flex items-center justify-center">
                    <Link
                      href="/contact"
                      className=" aspect-video w-32 rounded border bg-popover"
                    ></Link>
                  </div>{' '}
                  <div className="flex items-center justify-center">
                    <Link
                      href="/contact"
                      className=" aspect-video w-32 rounded border bg-popover"
                    ></Link>
                  </div>{' '}
                  <div className="flex items-center justify-center">
                    <Link
                      href="/contact"
                      className=" aspect-video w-32 rounded border bg-popover"
                    ></Link>
                  </div>{' '}
                  <div className="flex items-center justify-center">
                    <Link
                      href="/contact"
                      className=" aspect-video w-32 rounded border bg-popover"
                    ></Link>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-left">
                  {' '}
                  If you're a Local Game Store (LGS) owner and wish to feature
                  your website on Snapcaster, we invite you to join our official
                  Discord server and send us a direct message or send us an
                  email at epplerdev@gmail.com. We are also now offering
                  exclusive advertising opportunities for your webstore on
                  Snapcaster. This is an excellent chance to promote your
                  store's special offers, discount codes, and events such as
                  pre-release tournaments. Don't miss out on this opportunity to
                  connect with our passionate audience and enhance your store's
                  visibility.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
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
