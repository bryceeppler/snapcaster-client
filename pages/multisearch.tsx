import React from 'react';
import Head from 'next/head';
import { useStore } from 'store';
import Loadingspinner from '@/components/Loadingspinner';
import MultiCatalog from '@/components/MultiCatalog';
import MultiSearchbox from '@/components/MultiSearchbox';
import StoreSelector from '@/components/StoreSelector';
type Props = {};

export default function Multisearch({}: Props) {
  const { multiSearchResultsLoading: loading, multiSearchMode: mode } =
    useStore();
  return (
    <>
      <Head>
        <title>Multi Search - snapcaster</title>
        <meta
          name="description"
          content="Search for bulk Magic the Gathering singles in Canada"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center p-2 sm:p-8">
        {mode === 'search' && !loading && (
          <div className="max-w-2xl flex-1 flex-col items-center justify-center text-center">
            {/* checkboxes for selecting the stores */}
            <div className="my-2 text-3xl font-extrabold">
              Select stores to search
            </div>
            <div className="mb-4 text-sm text-white">
              Select which stores you would like to search. The more stores, the
              longer the search will take.
            </div>
            <div className="my-4 text-md content-center p-4 bg-red-900 text-white rounded-lg">
              Some websites have been temporarily disabled.
            </div>
            <StoreSelector />
            <MultiSearchbox />
          </div>
        )}
        {loading && (
          <div className="flex flex-col items-center justify-center space-y-2 pt-5">
            <Loadingspinner />
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
      </main>
    </>
  );
}
