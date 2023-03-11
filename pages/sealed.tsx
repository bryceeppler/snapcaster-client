import React from 'react'
import Head from 'next/head'
import Loadingspinner from '@/components/Loadingspinner'
import SealedSearchBox from '@/components/SealedSearchBox'
import { useUser } from '@/utils/useUser'
import { useRouter } from 'next/router'
import { useStore } from '@/store'
import SealedCatalogRow from '@/components/SealedCatalogRow'
import SealedSearchInfo from '@/components/SealedSearchInfo'
import SealedSearchFilters from '@/components/SealedSearchFilters'
type Props = {}

export default function Sealed({}: Props) {
  const { filteredSealedSearchResults : results, sealedSearchResultsLoading:loading } = useStore()
    const router = useRouter()
    const showBanner = true;
    const { user, isLoading, subscription } = useUser()

    if (subscription?.status === "active")
  return (
    <>
      <Head>
        <title>Sealed Search - snapcaster</title>
        <meta
          name="description"
          content="Search Magic the Gathering sealed products in Canada"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col justify-between items-center p-8 min-h-screen">
        <div className="flex-col justify-center flex-1 text-center max-w-xl w-full">
          {showBanner && (
            <div className="text-3xl font-extrabold">Search for a set</div>
          )}
          <SealedSearchBox />
          {loading && (
            <div className="flex justify-center items-center pt-5">
              <Loadingspinner />
            </div>
          )}
          <div className="mt-2">
            {results.length > 0 && (
              <div>
                <SealedSearchInfo />
                <SealedSearchFilters />
                {results.map((result, index) => (
                  <div key={index}>
                    <SealedCatalogRow product={result} />
                  </div>
                ))} 
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );

  // Redirect to pricing page if not premium user
  return (
    <>
      <Head>
        <title>Sealed Search - snapcaster</title>
        <meta
          name="description"
          content="Search Magic the Gathering sealed products in Canada"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col justify-between items-center p-8 min-h-screen">
        <div className="flex-col justify-center flex-1 text-center max-w-xl w-full">
            <div className="text-sm">Sealed search requires a premium membership.</div>
            <div className="text-sm">Click <a
            className="text-pink-500 hover:text-pink-700 cursor-pointer"
              onClick={() => router.push("/pricing")}
            >here</a> to view membership options.</div>
        </div>
      </main>
    </>
  );
}

