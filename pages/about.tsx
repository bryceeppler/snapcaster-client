import MainLayout from '@/components/MainLayout';
import { type NextPage } from 'next';
import Head from 'next/head';
type Props = {};

const About: NextPage<Props> = () => {
  return (
    <>
      <AboutHead />
      <MainLayout>
        <div className="w-full max-w-2xl flex-1 flex-col justify-center text-center">
          <section className="w-full py-6 md:py-12">
            <div className="container grid max-[1fr_900px] md:px-6 items-start gap-6">
              <div className="space-y-2">
                <h2 className="text-4xl font-bold tracking-tighter">About</h2>
              </div>
              <div className="grid gap-4 md:gap-4 p-8 outlined-container">
                <p className="text-left">
                  Snapcaster is a search tool designed for Magic: The Gathering players, letting you search for MTG singles across Canadian websites.
                  It allows users to efficiently search multiple
                  websites simultaneously, aggregating results in a single,
                  convenient location. We are excited to continuously
                  improve the service and welcome all suggestions or feedback.
                </p>
              </div>
            </div>
          </section>
        </div>
      </MainLayout>
    </>
  );
};

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
