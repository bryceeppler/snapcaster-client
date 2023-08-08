import React, { useEffect } from 'react';
import Head from 'next/head';
import Loadingspinner from '@/components/Loadingspinner';
import SealedSearchBox from '@/components/SealedSearchBox';
// import { useUser } from '@/utils/useUser';
import { useRouter } from 'next/router';
import { useStore } from '@/store';
import SealedCatalogRow from '@/components/SealedCatalogRow';
import SealedSearchInfo from '@/components/SealedSearchInfo';
import SealedSearchFilters from '@/components/SealedSearchFilters';
import { SealedProductInfo } from '@/components/PopularSealed';
import PopularSealed from '@/components/PopularSealed';
import axios from 'axios';
type Props = {
};

export default function Sealed() {
  const {
    filteredSealedSearchResults: results,
    sealedSearchResultsLoading: loading,
    sealedSearchHasResults
  } = useStore();
  const router = useRouter();
  const showBanner = true;
  // const { user, isLoading, subscription } = useUser();

  const [popularSealed, setPopularSealed] = React.useState<SealedProductInfo[]>([]);
  useEffect(() => {
    const res = axios.get(
      `${process.env.NEXT_PUBLIC_SNAPCASTER_API_URL}/utils/popular_sealed/`
    ).then(res => res.data).then(data => {
    let popularSealedProduct = [...data.monthly, ...data.weekly];
    popularSealedProduct = popularSealedProduct.filter(
      (prod, index, self) =>
        index === self.findIndex((t) => t.product_name === prod.product_name)
    );
    setPopularSealed(popularSealedProduct);
  })
  }, []);
  // if (subscription?.status === "active")
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
      <main className="flex flex-col justify-between items-center px-2 py-8 sm:p-8 min-h-screen">
        <div className="flex-col justify-center flex-1 text-center max-w-xl w-full">
                      {/* message box for updates */}
                      <div className="h-auto w-full rounded bg-red-500 py-2 opacity-80">
              <div className="flex h-full items-center justify-center">
                <div className="text-md text-white">
                  Sealed search is undergoing some changes and may not work as
                  expected. <span>
                    {/* date */}
                    <span className="font-bold">August 8, 2023</span>
                  </span>
                </div>
              </div>
            </div>
          {showBanner && (
            <div className="text-3xl font-extrabold">Search for a set</div>
          )}
          <SealedSearchBox />
          {loading && (
            <div className="flex justify-center items-center pt-5">
              <Loadingspinner />
            </div>
          )}
          {
            !sealedSearchHasResults && popularSealed.length > 0 && <PopularSealed popularSealed={popularSealed} />
          }

          <div className="mt-2">
            {sealedSearchHasResults && (
              <div>
                {' '}
                <SealedSearchInfo />
                <SealedSearchFilters />
              </div>
            )}
            {results.length > 0 && (
              <div>
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
          <div className="text-sm">
            Sealed search requires a premium membership.
          </div>
          <div className="text-sm">
            Click{' '}
            <a
              className="text-pink-500 hover:text-pink-700 cursor-pointer"
              onClick={() => router.push('/pricing')}
            >
              here
            </a>{' '}
            to view membership options.
          </div>
        </div>
      </main>
    </>
  );
}
