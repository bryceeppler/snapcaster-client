import React from 'react';
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
    clearFilters
  } = useBuyListStore();

  return (
    <>
      <div className=" min-h-svh ">
        <div className="flex w-full flex-col justify-center  text-center">
          {!searchResults && (
            <div className="flex flex-col items-center justify-center md:mt-6">
              <Homebanner prefixText={'Sell'} />
              <div className="mx-auto mt-6 flex w-full justify-center">
                <SearchBar
                  searchTool="buylist"
                  tcg={tcg}
                  searchTerm={searchTerm}
                  setTcg={setTcg}
                  setSearchTerm={setSearchTerm}
                  clearSearchResults={clearSearchResults}
                  fetchCards={fetchCards}
                  clearFilters={clearFilters}
                />
              </div>
            </div>
          )}
        </div>
        {searchResults && (
          <>
            <BuylistCatalog />
          </>
        )}
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
