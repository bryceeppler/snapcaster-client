import { type NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import PageTitle from '@/components/ui/page-title';
import { trackAdClick } from '@/utils/analytics';
import useGlobalStore from '@/stores/globalStore';
type Props = {};

const Supporters: NextPage<Props> = () => {
  const { websites } = useGlobalStore(); 

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
                <h3 className="mb-6 text-2xl font-bold">Tier 1 Sponsors</h3>
                <div className="grid grid-cols-3 gap-6">
                  {/* OBSIDIAN */}
                  <div className="flex items-center justify-center bg-zinc-800 p-4">
                    <Link
                      href="https://obsidiangames.ca"
                      target="_blank"
                      data-position-id="6" // hardcoded for t1 supporter logo
                      data-ad-id="13" // hardcoded for the obsidian support logo ad
                      onClick={() => trackAdClick('13')}
                    >
                      <img
                        alt="Obsidian Games Vernon"
                        className="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center bg-zinc-800 px-5"
                        height="200"
                        src="https://cdn.snapcaster.ca/obsidian_supporter.png"
                        width="400"
                      />
                    </Link>
                  </div>
                  {/* EXOR */}
                  <div className="flex items-center justify-center bg-zinc-800 p-4">
                    <Link
                      href="https://exorgames.com"
                      target="_blank"
                      data-position-id="6" // hardcoded for t1 supporter logo
                      data-ad-id="44" // hardcoded for the exor support logo ad
                      onClick={() => trackAdClick('44')}
                    >
                      <img
                        alt="Exor Games"
                        className="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
                        height="200"
                        src="/exorgames_icon.png"
                        width="400"
                      />
                    </Link>
                  </div>
                  {/* CHIMERA */}
                  <div className="flex items-center justify-center bg-zinc-800 p-4">
                    <Link
                      href="https://chimeragamingonline.com/"
                      target="_blank"
                      data-position-id="6" // hardcoded for t1 supporter logo
                      data-ad-id="43" // hardcoded for the obsidian support logo ad
                      onClick={() => trackAdClick('43')}
                    >
                      <img
                        alt="Chimera Gaming"
                        className="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
                        height="200"
                        src="/chimera_sponsor.png"
                        width="400"
                      />
                    </Link>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="mb-6 text-2xl font-bold">Tier 2 Sponsors</h3>
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
                  {/* LEVEL UP */}
                  <div className="flex items-center justify-center bg-zinc-800 p-4">
                    <Link
                      href="https://levelupgames.ca"
                      target="_blank"
                      data-position-id="8" // hardcoded for t2 supporter logo
                      data-ad-id="42" // hardcoded for the levelup support logo ad
                      onClick={() => trackAdClick('42')}
                    >
                      <img
                        alt="Level Up Games"
                        className="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
                        height="150"
                        src="/levelup_icon.png"
                        width="300"
                      />
                    </Link>
                  </div>
                  {/* The Mythic Store */}
                  <div className="flex items-center justify-center bg-zinc-800 p-4">
                    <Link
                      href="https://themythicstore.com"
                      target="_blank"
                      data-position-id="8" 
                      data-ad-id="55"  
                      onClick={() => trackAdClick('55')} 
                    >
                      <img
                        alt="The Mythic Store"
                        className="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
                        height="150"
                        src="/tms_sponsor.webp"
                        width="300"
                      />
                    </Link>
                  </div>
                  {/* House of Cards */}
                  <div className="flex items-center justify-center bg-zinc-800 p-4">
                    <Link
                      href="https://houseofcards.ca"
                      target="_blank"
                      data-position-id="8" 
                      data-ad-id="56"  
                      onClick={() => trackAdClick('56')} 
                    >
                      <img
                        alt="House of Cards"
                        className="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
                        height="150"
                        src="/hoc_sponsor.png"
                        width="300"
                      />
                    </Link>
                  </div>
    
                </div>
              </div>
              {/* <div>
                <h3 className="mb-6 text-2xl font-bold">Tier 3 Sponsors</h3>
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  <div className="flex items-center justify-center">
                    <Link
                      href="/contact"
                      className=" aspect-video w-32 rounded-lg border bg-popover"
                    ></Link>
                  </div>
                  <div className="flex items-center justify-center">
                    <Link
                      href="/contact"
                      className=" aspect-video w-32 rounded-lg border bg-popover"
                    ></Link>
                  </div>{' '}
                  <div className="flex items-center justify-center">
                    <Link
                      href="/contact"
                      className=" aspect-video w-32 rounded-lg border bg-popover"
                    ></Link>
                  </div>{' '}
                  <div className="flex items-center justify-center">
                    <Link
                      href="/contact"
                      className=" aspect-video w-32 rounded-lg border bg-popover"
                    ></Link>
                  </div>{' '}
                  <div className="flex items-center justify-center">
                    <Link
                      href="/contact"
                      className=" aspect-video w-32 rounded-lg border bg-popover"
                    ></Link>
                  </div>
                </div>
              </div> */}
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
