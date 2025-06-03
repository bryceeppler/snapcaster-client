import Head from 'next/head';

import type { NextPage } from 'next';
import React from 'react';

import BuylistCatalog from '@/components/buylists/buylist-catalog-container';
import BuylistLayout from '@/components/buylists/buylist-layout';

const Buylist: NextPage = () => {
  return (
    <>
      <BuylistHead />
      <BuylistLayout>
        <BuylistCatalog />
      </BuylistLayout>
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
