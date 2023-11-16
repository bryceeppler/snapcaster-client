import React from 'react';
import Head from 'next/head';
import { useStore } from 'store';
import Loadingspinner from '@/components/Loadingspinner';
import MultiCatalog from '@/components/MultiCatalog';
import MultiSearchbox from '@/components/MultiSearchbox';
import StoreSelector from '@/components/StoreSelector';
type Props = {};

export default function Multisearch({}: Props) {
  // const mode: string = "search";
  const { multiSearchResultsLoading: loading, multiSearchMode: mode } =
    useStore();
  // const loading = false;
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
            {/* <div className="h-auto w-full rounded bg-red-500 py-2 opacity-80">
              <div className="flex h-full items-center justify-center">
                <div className="text-md text-white">
                  Multisearch is undergoing some changes and may not work as
                  expected. Please use the single search for now.
                </div>
              </div>
            </div> */}
            <div className="my-2 text-3xl font-extrabold">
              Select stores to search
            </div>
            <div className="mb-4 text-sm text-white">
              Select which stores you would like to search. The more stores, the
              longer the search will take.
            </div>
            {/* <div className="flex justify-center items-center h-28 bg-zinc-900 bg-opacity-5 w-full">
            <ins
            className="adsbygoogle"
            //  style="display:block"
            data-ad-client="ca-pub-6026504058618942"
            data-ad-slot="4085824286"
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
          </div> */}
            <StoreSelector />
            {/* multi-line text field to enter card names */}
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
