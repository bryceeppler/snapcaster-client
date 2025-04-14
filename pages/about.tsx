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

// TODO: Use vendors.tier to map out the sponsors
const About: NextPage<Props> = () => {
  const { vendors } = useGlobalStore();
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
      <section className="min-h-screen w-full bg-gradient-to-b from-background to-background/80">
        <div className="container mx-auto mb-16 max-w-7xl px-4 py-16 md:px-8">
          <div className="space-y-16">
            <PageTitle
              title="Our Supporters"
              subtitle="We're grateful for the support of these amazing companies."
            />
            {/* Tier 1 Sponsors */}
            {/* TODO: Use vendors.tier to map out the sponsors */}
            <div className="space-y-8">
              <div className="flex flex-col items-center">
                <h3 className="text-center text-3xl font-bold">
                  Tier 1 Sponsors
                </h3>
                <div className="mx-auto mt-2 h-2 w-16 rounded-full bg-primary/40"></div>
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
                <h3 className="text-center text-3xl font-bold">
                  Tier 2 Sponsors
                </h3>
                <div className="mx-auto mt-2 h-2 w-16 rounded-full bg-primary/40"></div>
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
            <div className="space-y-8">
              <div className="flex flex-col items-center">
                <h3 className="text-center text-3xl font-bold">
                  Tier 3 Sponsors
                </h3>
                <div className="mx-auto mt-2 h-2 w-16 rounded-full bg-primary/40"></div>
              </div>
              <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
                {/* VORTEX */}
                <SponsorCard
                  href="https://vortexgames.ca"
                  imgSrc="https://cdn.snapcaster.ca/supporters/vortex_supporter.png"
                  alt="Vortex Games"
                />
              </div>
            </div>

            {/* Vendors Section */}
            <div id="vendors" className="scroll-mt-32 space-y-8">
              <div className="space-y-4 text-center">
                <h3 className="text-3xl font-bold">
                  We support {vendors.length} stores across Canada!
                </h3>
                <p className="mx-auto max-w-3xl leading-relaxed text-muted-foreground">
                  If you're a Local Game Store (LGS) owner and wish to feature
                  your website on Snapcaster, we invite you to join our official
                  Discord server and send us a direct message or send us an
                  email at{' '}
                  <a
                    href="mailto:info@snapcaster.gg"
                    className="text-primary transition-colors hover:text-primary/80"
                  >
                    info@snapcaster.gg
                  </a>
                  . This is an excellent chance to promote your store's special
                  offers, discount codes, and events.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {vendors.map((vendor) => (
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    target="_blank"
                    href={vendor.url}
                    key={vendor.slug}
                    className="rounded-xl border bg-popover p-4 text-center shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-accent/50 hover:shadow-md"
                  >
                    {vendor.name}
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
  alt?: string;
  positionId?: string;
  adId?: string;
}

const SponsorCard = ({
  href,
  imgSrc,
  alt,
  positionId,
  adId
}: SponsorCardProps) => (
  <motion.div
    whileHover={{
      scale: 1.02,
      boxShadow:
        '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
    }}
    whileTap={{ scale: 0.98 }}
    className="group relative overflow-visible rounded-xl border border-transparent bg-zinc-800/50 shadow-lg backdrop-blur-sm transition-all duration-300 hover:z-10 hover:border-primary/20"
  >
    <Link
      href={href}
      target="_blank"
      data-position-id={positionId}
      data-ad-id={adId}
      onClick={() => adId && trackAdClick(adId)}
      className="block overflow-visible p-8"
    >
      <div className="relative aspect-[2/1] overflow-visible rounded-lg">
        <img
          alt={alt}
          className="absolute h-full w-full origin-center transform object-contain transition-transform duration-300 group-hover:scale-110 group-hover:brightness-110"
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
