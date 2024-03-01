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
type Props = {};

export default function Multisearch({}: Props) {
  const { multiSearchResultsLoading: loading, multiSearchMode: mode } =
    useStore();

  const { hasActiveSubscription, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="w-full max-w-2xl flex-1 flex-col justify-center text-center">
          <section className="w-full py-6 md:py-12">
            <div className="container grid max-[1fr_900px] md:px-6 items-start gap-6">
              <div className="space-y-2">
                <h2 className="text-4xl font-bold tracking-tighter">
                  Multi-search
                </h2>
              </div>
              <div className="grid gap-4 md:gap-4 p-8 outlined-container">
                <p className="text-left">
                  You must be logged in to use this feature.
                </p>
                <Link href="/signin">
                  <Button className="w-full">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button className="w-full">Sign up</Button>
                </Link> 
              </div>
            </div>
          </section>
        </div>
      </MainLayout>
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
          <div className="max-w-2xl flex-1 flex-col items-center justify-center text-center">
            <h2 className="text-4xl font-bold tracking-tighter">
              Multi-search
            </h2>
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
          <div className="w-full max-w-xl flex-col">
            <MultiCatalog />
          </div>
        )}
      </MainLayout>
    </>
  );
}
