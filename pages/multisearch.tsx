import React from 'react'
import Head from 'next/head'
import { useStore } from 'store'
import Loadingspinner from '@/components/Loadingspinner'
import MultiCatalog from '@/components/MultiCatalog'
import MultiSearchbox from '@/components/MultiSearchbox'
import StoreSelector from '@/components/StoreSelector'
type Props = {}

export default function Multisearch({}: Props) {
    const mode: string = "search";
    const loading = false;
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
      <main className="flex flex-col justify-between items-center px-4 md:px-24 pt-8 min-h-screen">
        {mode === "search" && !loading && (
          <div className="flex-col items-center justify-center flex-1 text-center max-w-2xl">
            {/* checkboxes for selecting the stores */}
            <div className="font-bold">Select stores to search</div>
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