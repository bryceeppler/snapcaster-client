import React from 'react'
import Head from 'next/head'
import { useStore } from 'store'
import Loadingspinner from '@/components/Loadingspinner'
import MultiCatalog from '@/components/MultiCatalog'
import MultiSearchbox from '@/components/MultiSearchbox'
import StoreSelector from '@/components/StoreSelector'
type Props = {}

export default function Multisearch({}: Props) {
    // const mode: string = "search";
    const { multiSearchResultsLoading: loading, multiSearchMode: mode } = useStore();
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
      <main className="w-full max-w-xl min-h-screen flex flex-col items-center p-2 sm:p-8">
        {mode === "search" && !loading && (
          <div className="flex-col items-center justify-center flex-1 text-center max-w-2xl">
            {/* checkboxes for selecting the stores */}
            <div className="text-3xl font-extrabold my-2">Select stores to search</div>
            <div className="text-sm text-white mb-4">Select which stores you would like to search. The more stores, the longer the search will take.</div>
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
          <div className="flex flex-col space-y-2 justify-center items-center pt-5">
            <Loadingspinner />
            <div className="text-sm p-3">
              This might take a minute, depending on the number of cards and
              selected stores.
            </div>
          </div>
        )}
        {mode == "results" && (
          <div className="flex-col w-full max-w-xl">
            <MultiCatalog />
          </div>
        )}
      </main>
    </>
  )
}