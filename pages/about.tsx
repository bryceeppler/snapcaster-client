import MainLayout from '@/components/MainLayout';
import Button from '@/components/ui/Button';
import { type NextPage } from 'next';
import Head from 'next/head';
type Props = {};

const About: NextPage<Props> = () => {
  return (
    <>
      <AboutHead />
      <MainLayout>
        <div className="w-full max-w-xl flex-1 flex-col justify-center text-center">
          <section className="w-full py-6 md:py-12">
            <div className="container grid max-[1fr_900px] md:px-6 items-start gap-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter">About</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Welcome to Snapcaster!
                </p>
              </div>
              <div className="grid gap-4 md:gap-4">
                <p>
                  This is a project that I created to help Magic: The Gathering
                  players search for singles on Canadian websites. With
                  Snapcaster, you can search multiple websites at once and see
                  all the results in one place. If you have any suggestions or
                  feedback, please feel free to email me at epplerdev@gmail.com.
                </p>
                <h3 className="text-2xl font-bold">Support</h3>
                <p>
                  Snapcaster is a service I created in my spare time, and I rely
                  on donations to cover the server costs. If you find Snapcaster
                  helpful, please consider donating to support the project.
                </p>
                <Button
                  onClick={() => {
                    window.location.href =
                      'https://www.paypal.com/donate/?business=KK537LVP4TZ5Q&no_recurring=0&item_name=I+appreciate+your+support%21+If+you+have+any+suggestions+or+feedback%2C+please+feel+free+to+email+me+at+epplerdev%40gmail.com.&currency_code=CAD';
                  }}
                  className="mt-2"
                  variant="secondary"
                >
                  Donate with PayPal
                </Button>
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
      <title>Snapcaster</title>
      <meta
        name="description"
        content="Search for Magic the Gathering singles in Canada"
      />
      <meta
        property="og:title"
        content={`Snapcaster - Search for Magic: the Gathering cards across Canada`}
      />
      <meta
        property="og:description"
        content={`Find your Magic the Gathering singles and sealed product using Snapcaster. Search your favorite Canadian stores.`}
      />
      <meta property="og:url" content={`https://Snapcaster.ca`} />
      <meta property="og:type" content="website" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};
