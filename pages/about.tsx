import { type NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import PageTitle from '@/components/ui/page-title';
import { trackAdClick } from '@/utils/analytics';
import useGlobalStore from '@/stores/globalStore';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

type Props = {};

const About: NextPage<Props> = () => {
  const { websites } = useGlobalStore();
  const router = useRouter();

  useEffect(() => {
    if (router.asPath.includes('#vendors')) {
      const element = document.getElementById('vendors');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [router.asPath]);

  return (
    <>
      <AboutHead />
      <section className="w-full min-h-screen bg-gradient-to-b from-background to-background/80">
        <div className="container max-w-7xl mx-auto px-4 md:px-8 py-16 mb-16">
          <div className="space-y-16">
            <PageTitle
              title="Our Supporters"
              subtitle="We're grateful for the support of these amazing companies."
            />
            {/* Tier 1 Sponsors */}
            <div className="space-y-8">
              <div className="flex flex-col items-center">
                <h3 className="text-3xl font-bold text-center">
                  Tier 1 Sponsors
                </h3>
                <div className="mt-2 rounded-full h-2 w-16 bg-primary/40 mx-auto"></div>
              </div>
              <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
                {/* OBSIDIAN */}
                <SponsorCard
                  href="https://obsidiangames.ca"
                  imgSrc="https://cdn.snapcaster.ca/obsidian_supporter.png"
                  alt="Obsidian Games Vernon"
                  positionId="6"
                  adId="13"
                />
                {/* EXOR */}
                <SponsorCard
                  href="https://exorgames.com"
                  imgSrc="https://cdn.snapcaster.ca/supporters/exorgames_supporter.png"
                  alt="Exor Games"
                  positionId="6"
                  adId="44"
                />
                {/* CHIMERA */}
                <SponsorCard
                  href="https://chimeragamingonline.com/"
                  imgSrc="https://cdn.snapcaster.ca/supporters/chimera_supporter.png"
                  alt="Chimera Gaming"
                  positionId="6"
                  adId="43"
                />
              </div>
            </div>

            {/* Tier 2 Sponsors */}
            <div className="space-y-8">
            <div className="flex flex-col items-center">
                <h3 className="text-3xl font-bold text-center">
                  Tier 2 Sponsors
                </h3>
                <div className="mt-2 rounded-full h-2 w-16 bg-primary/40 mx-auto"></div>
              </div>
              <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
                {/* LEVEL UP */}
                <SponsorCard
                  href="https://levelupgames.ca"
                  imgSrc="https://cdn.snapcaster.ca/supporters/levelup_supporter.png"
                  alt="Level Up Games"
                  positionId="8"
                  adId="42"
                />
                {/* The Mythic Store */}
                <SponsorCard
                  href="https://themythicstore.com"
                  imgSrc="https://cdn.snapcaster.ca/supporters/tms_supporter.png"
                  alt="The Mythic Store"
                  positionId="8"
                  adId="55"
                />
                {/* House of Cards */}
                <SponsorCard
                  href="https://houseofcards.ca"
                  imgSrc="https://cdn.snapcaster.ca/supporters/hoc_supporter.png"
                  alt="House of Cards"
                  positionId="8"
                  adId="56"
                />
              </div>
            </div>

            {/* Vendors Section */}
            <div id="vendors" className="scroll-mt-32 space-y-8">
              <div className="text-center space-y-4">
                <h3 className="text-3xl font-bold">
                  We support {websites.length} stores across Canada!
                </h3>
                <p className="max-w-3xl mx-auto text-muted-foreground leading-relaxed">
                  If you're a Local Game Store (LGS) owner and wish to feature
                  your website on Snapcaster, we invite you to join our official
                  Discord server and send us a direct message or send us an
                  email at{' '}
                  <a href="mailto:info@snapcaster.gg" className="text-primary hover:text-primary/80 transition-colors">
                    info@snapcaster.gg
                  </a>
                  . This is an excellent chance to promote your store's special offers,
                  discount codes, and events.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {websites.map((website) => (
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    target="_blank"
                    href={website.url}
                    key={website.slug}
                    className="p-4 text-center border rounded-xl bg-popover hover:bg-accent/50 transition-all duration-200 shadow-sm hover:shadow-md backdrop-blur-sm"
                  >
                    {website.name}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

interface SponsorCardProps {
  href: string;
  imgSrc: string;
  alt: string;
  positionId: string;
  adId: string;
}

const SponsorCard = ({ href, imgSrc, alt, positionId, adId }: SponsorCardProps) => (
  <motion.div
    whileHover={{ 
      scale: 1.02,
      boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
    }}
    whileTap={{ scale: 0.98 }}
    className="group relative rounded-xl shadow-lg transition-all duration-300 hover:z-10 bg-zinc-800/50 backdrop-blur-sm overflow-visible hover:border-primary/20 border border-transparent"
  >
    <Link
      href={href}
      target="_blank"
      data-position-id={positionId}
      data-ad-id={adId}
      onClick={() => trackAdClick(adId)}
      className="block p-8 overflow-visible"
    >
      <div className="relative aspect-[2/1] rounded-lg overflow-visible">
        <img
          alt={alt}
          className="absolute w-full h-full object-contain transform transition-transform duration-300 origin-center group-hover:scale-110 group-hover:brightness-110"
          src={imgSrc}
        />
      </div>
    </Link>
  </motion.div>
);

export default About;

const AboutHead = () => {
  return (
    <Head>
      <title>About</title>
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
