import React from 'react';
import Head from 'next/head';
import { NextPage } from 'next';
import BackToTopButton from '@/components/ui/back-to-top-btn';
import BuylistCatalog from '@/components/buylists/buylist-catalog-container';

type Props = {};
const Buylist: NextPage<Props> = () => {
  return (
    <>
      <BuylistHead />
      <div className="min-h-vh">
        <BuylistCatalog />
        <BackToTopButton />
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
