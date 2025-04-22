import React from 'react';
import Head from 'next/head';
import { NextPage } from 'next';
import BackToTopButton from '@/components/ui/back-to-top-btn';
import BuylistCatalog from '@/components/buylists/buylist-catalog-container';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {};
const Buylist: NextPage<Props> = () => {
  return (
    <>
      <BuylistHead />
      <div className="h-full min-h-svh ">
        <div className="flex flex-col items-center justify-center gap-2 pt-[calc(25vh-2rem)]">
          <AlertCircle></AlertCircle>
          <div className="flex flex-col items-center justify-center">
            <p className="text-lg font-semibold">
              Buylists is currently under maintenance
            </p>
            <p className="text-sm text-muted-foreground">
              This feature will return in the next few days
            </p>
            <a href="https://discord.gg/EnKKHxSq75">
              <Button className="mt-2 w-full">Discord Updates</Button>
            </a>
          </div>
        </div>
        {/* <BuylistCatalog />
        <BackToTopButton /> */}
      </div>
    </>
  );
};

export default Buylist;

const BuylistHead = () => {
  return (
    <Head>
      <title>Buylists</title>
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
