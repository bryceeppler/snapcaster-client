import React from 'react'
import Head from 'next/head'
import Loadingspinner from '@/components/Loadingspinner'
import SealedSearchBox from '@/components/SealedSearchBox'
import { useUser } from '@/utils/useUser'
import { useRouter } from 'next/router'
type Props = {}

export default function Sealed({}: Props) {
    const router = useRouter()
    const loading = false;
    const showBanner = true;
    const resultsRaw = []
    const results = []
    const { user, isLoading, subscription } = useUser()
    console.log("user", user)
    console.log("isLoading", isLoading)
    console.log("subscription", subscription)

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
            <div className="text-2xl">Search for a set</div>
          )}
          <SealedSearchBox />
          {loading && (
            <div className="flex justify-center items-center pt-5">
              <Loadingspinner />
            </div>
          )}
          <div className="mt-2">
            {resultsRaw.length > 0 && (
              <div>
                {/* <SealedResultsInfo /> */}
                {/* <SealedSearchFilters /> */}
                {/* {results.map((result, index) => ( */}
                  {/* <div key={index}> */}
                    {/* <SealedProductRow product={result} /> */}
                  {/* </div> */}
                {/* ))} */}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );

  // Redirect to pricing page if not premium
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
            <div className="text-2xl">Sealed search requires a premium membership.</div>
            <button
              onClick={() => router.push("/pricing")}
              type="button"
              className={`relative w-1/2 bg-zinc-700 border-zinc-800 shadow-sm text-white
               rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
            >
              Pricing
            </button>
        </div>
      </main>
    </>
  );
}

