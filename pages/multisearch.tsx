import React from 'react';
import Head from 'next/head';
import { useStore } from '@/stores/store';
import LoadingSpinner from '@/components/LoadingSpinner';
import MultiCatalog from '@/components/MultiCatalog';
import MultiSearchbox from '@/components/MultiSearchbox';
import StoreSelector from '@/components/StoreSelector';
import MainLayout from '@/components/MainLayout';
import useAuthStore from '@/stores/authStore';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import LoginRequired from '@/components/login-required';
import PageTitle from '@/components/ui/page-title';
type Props = {};

export default function Multisearch({}: Props) {
  const { multiSearchResultsLoading: loading, multiSearchMode: mode } =
    useStore();

  const { hasActiveSubscription, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <LoginRequired
        title="Multi-search"
        message="You must be logged in to use this feature."
      />
    );
  }

  return (
    <>
      <Head>
        <title>Multi Search</title>
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
      <MainLayout>
        {mode === 'search' && !loading && (
          <div className="container w-full flex-1 flex-col items-center justify-center text-center">
            <a
              target="_blank"
              href="https://red-dragon.ca/collections/mtg-singles-instock"
            >
              <img
                src="./home_banner_4.jpg"
                alt="Home Banner"
                className="rounded-lg"
              ></img>
            </a>
            <PageTitle title="Multi Search" />
            <div className="p-2" />
            <div className="ext-sm outlined-container p-3">
              Select which stores you would like to search, and enter a list of
              card names to search for.
            </div>
            <div className="p-2" />

            <StoreSelector />
            <div className="p-2" />
            <MultiSearchbox hasActiveSubscription={hasActiveSubscription} />
          </div>
        )}
        {loading && (
          <div className="flex flex-col items-center justify-center space-y-2 pt-5">
            <LoadingSpinner />
            <div className="p-3 text-sm">
              This might take a minute, depending on the number of cards and
              selected stores.
            </div>
          </div>
        )}
        {mode == 'results' && (
          <div className="container w-full flex-col">
            <MultiCatalog />
          </div>
        )}
      </MainLayout>
    </>
  );
}
