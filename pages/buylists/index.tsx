import React, { useEffect } from 'react';
import Head from 'next/head';
import { NextPage } from 'next';
import useBuyListStore from '@/stores/buyListStore';
import Homebanner from '@/components/homebanner';
import BackToTopButton from '@/components/ui/back-to-top-btn';
import BuylistCatalog from '@/components/buylists/buylist-catalog-container';
import SearchBar from '@/components/search-ui/search-bar';

type Props = {};
const Buylist: NextPage<Props> = () => {
  const {
    searchResults,
    tcg,
    searchTerm,
    setTcg,
    setSearchTerm,
    clearSearchResults,
    fetchCards,
    clearFilters,
    fetchCarts
  } = useBuyListStore();

  useEffect(() => {
    fetchCarts();
  }, []);

  return (
    <>
      <div className=" min-h-svh ">
        <BuylistCatalog />
        <BackToTopButton />
      </div>
    </>
  );
};

export default Buylist;

const HomeHead = () => {
  return (
    <Head>
      <title>Snapcaster</title>
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
