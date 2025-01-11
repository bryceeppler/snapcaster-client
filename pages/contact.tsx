import { type NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import PageTitle from '@/components/ui/page-title';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
type Props = {};

const Contact: NextPage<Props> = () => {
  return (
    <>
      <ContactHead />
      <section className="w-full">
        <div className="container px-4 md:px-6">
          <div className="space-y-8">
            <PageTitle
              title="Contact Us"
              subtitle="Get ahold of us for questions, feedback, or support."
            />
            <div className="flex flex-col gap-4 max-w-lg mx-auto">
                <div className="flex flex-col gap-2">
                    <h2 className="text-lg font-bold">Discord</h2>
                    <p>Connect with the community and Snapcaster developers in our Discord server. Our community is a great place to ask questions, share ideas, and get help.</p>
                    <Button className="w-fit mx-auto mt-3">Join Discord</Button>
                </div>
                <Separator />
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-bold">Email</h2>
                <p>
                    We're always looking for ways to improve Snapcaster. If you have any feedback or suggestions, please let us know.
                </p>
                <a href="mailto:info@snapcaster.gg" className="text-primary hover:underline w-fit">info@snapcaster.gg</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;

const ContactHead = () => {
  return (
    <Head>
      <title>Contact</title>
      <meta
        name="description"
        content="Search TCG cards across Canada"
      />
      <meta
        property="og:title"
        content={`Snapcaster - Search TCG cards across Canada`}
      />
      <meta
        property="og:description"
        content={`Find TCG singles and sealed product using in Snapcaster. Search your favourite Canadian stores.`}
      />
      <meta property="og:url" content={`https://snapcaster.ca`} />
      <meta property="og:type" content="website" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};
