import MainLayout from '@/components/main-page-layout';
import { type NextPage } from 'next';
import { useStore } from '@/stores/store';
import Head from 'next/head';
type Props = {};

const About: NextPage<Props> = () => {
  const { websites } = useStore();

  return (
    <>
      <AboutHead />
      <MainLayout>
        <div className="max-w-8xl w-full flex-1 flex-col justify-center text-center">
          <section className="w-full py-6 md:py-12">
            <div className="max-[1fr_900px] container grid items-start gap-6 md:px-6">
              <div className="outlined-container grid gap-4 p-8 md:gap-4">
                {/* About Us*/}
                <div>
                  <h2 className="mb-4 text-4xl font-bold tracking-tighter">
                    About Us
                  </h2>
                  <p className="text-left">
                    Snapcaster is a search tool designed for Magic: The
                    Gathering players, letting you search for MTG singles across
                    70 Canadian websites. It allows users to efficiently search
                    multiple websites simultaneously, aggregating results in a
                    single convenient location. We are excited to continuously
                    improve the service and welcome any suggestions and feed
                    back in our official{' '}
                    <a
                      href="https://discord.gg/EnKKHxSq75"
                      className="text-pink-600"
                    >
                      Discord
                    </a>
                    .
                  </p>
                </div>

                {/* Collaborate With Us*/}
                <div className="my-4 text-left">
                  <h3 className="mb-4 text-center text-2xl font-medium tracking-tighter">
                    Collaborate with Snapcaster (Local Game Store Owners)
                  </h3>
                  <p>
                    If you're a LGS owner and would like to add your website to
                    Snapcaster, you can join our official discord server and
                    send us a direct message. We are also now open to
                    advertising your webstore store on Snapcaster. This can be a
                    great opportunity to advertise any store promotions,
                    discount codes, and events such as a pre-release event!
                  </p>
                </div>

                {/* Free Features */}
                <div className="my-4 text-left">
                  <h3 className="mb-4 text-center text-2xl font-medium tracking-tighter">
                    Free Features
                  </h3>

                  <h3 className="mb-1 text-left text-lg font-bold ">
                    Single Search
                  </h3>
                  <p>
                    Snapcaster's MTG singles search tool that allows users to
                    search for the cheapest cards across 70 Canadian websites.
                  </p>
                </div>

                {/* Free Features */}
                <div className="my-4 text-left">
                  <h3 className="mb-4 text-center text-2xl font-medium tracking-tighter">
                    Premium Features
                  </h3>

                  <div className="p-2"></div>
                  <h3 className="text-lg font-bold">Multi Search</h3>
                  <div className="p-2"></div>
                  <p>
                    A multi search tool where you can copy paste a deck list of
                    up to 100 cards to aggregate at once.
                  </p>

                  <div className="p-2"></div>
                  <h3 className="text-lg font-bold">Advanced Search</h3>
                  <div className="p-2"></div>
                  <p>
                    A more advanced version of the single search feature. Users
                    can apply custom queries based on the following filters:
                  </p>
                  <div className="p-2"></div>
                  <ul className="list-outside list-disc space-y-2 px-6">
                    <li>Website</li>
                    <li>Set</li>
                    <li>Condition</li>
                    <li>Foil Type</li>
                    <li>Showcase Treatment Type</li>
                    <li>Frame: Borderless, Extended Art, Full Art, Retro</li>
                    <li>Pre Release Card</li>
                    <li>Promo Card</li>
                    <li>Alternate Art</li>
                    <li>Art Series</li>
                    <li>Golden Stamped</li>
                    <li>Sort By: Price, Name, Website, Set, and Condition</li>
                  </ul>
                  <div className="p-2"></div>

                  <h3 className="text-lg font-bold">Wish Lists</h3>
                  <div className="p-2"></div>
                  <p>
                    Users can now create custom lists of cards for easy price
                    checking. Features include:
                  </p>
                  <div className="p-2"></div>
                  <ul className="list-outside list-disc space-y-2 px-6">
                    <li>Create custom lists of up to 100 cards.</li>
                    <li>
                      Users can specify the minimum condition requirements for
                      each card in their list.
                    </li>
                    <li>
                      Lists will be displayed in a table like format where users
                      can view the cheapest option for their cards all on one
                      page.
                    </li>
                  </ul>
                </div>

                {/* Supported Websites */}
                <div className="my-4 text-left">
                  <h3 className="mb-4 text-center text-2xl font-medium tracking-tighter">
                    Supported Websites
                  </h3>
                  <ul className="list-outside list-disc space-y-2 px-6 sm:columns-3">
                    {websites
                      .sort((a, b) =>
                        a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
                      )
                      .map((website, index) => (
                        <li key={index}>{website.name}</li>
                      ))}
                  </ul>
                </div>
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
