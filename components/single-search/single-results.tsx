import React, { useState } from 'react';
import useSingleStore from '@/stores/singleSearchStore';
import SingleCatalogRow from './single-list-item';
import SingleCatalogCard from './single-grid-item';
import SingleResultsTable from './single-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BackToTopButton from '../ui/back-to-top-btn';
import type { SingleSearchResult } from '@/stores/store';
import useGlobalStore from '@/stores/globalStore';
import { Ad } from '@/types/ads';

type Props = {};

type ResultItem = SingleSearchResult | Ad;

// Helper function to get a random ad from a list of ads
const getRandomAd = (ads: Ad[]): Ad => {
  const randomIndex = Math.floor(Math.random() * ads.length);
  return ads[randomIndex];
};

const insertAdvertisements = (
  results: SingleSearchResult[],
  adInterval: number,
  ads: Ad[]
): ResultItem[] => {
  let resultsWithAds: ResultItem[] = [];
  for (let i = 0; i < results.length; i++) {
    if (i > 0 && i % adInterval === 0) {
      const randomAd = getRandomAd(ads);
      if (randomAd) {
        resultsWithAds.push(randomAd);
      }
    }
    resultsWithAds.push(results[i]);
  }
  return resultsWithAds;
};

export default function SingleCatalog({}: Props) {
  const { filteredResults, resultsTcg } = useSingleStore();
  const { adsEnabled, ads } = useGlobalStore();
  const [selectedTab, setSelectedTab] = useState('list');

  const adsFromPosition4 = ads.position['4']?.ads || [];

  if (adsFromPosition4.length === 0) {
    console.log('No ads found for position 4');
  }

  const resultsWithAds = insertAdvertisements(
    filteredResults,
    9,
    adsFromPosition4
  );

  if (filteredResults.length === 0) {
    return (
      <div className="flex items-center justify-center pt-5">
        <div className="text-sm">No results found</div>
      </div>
    );
  }

  return (
    <div>
      <Tabs
        defaultValue="list"
        className="w-full"
        onValueChange={setSelectedTab}
      >
        <TabsList>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="catalog">Catalog</TabsTrigger>
          <TabsTrigger value="table">Table</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          {adsEnabled &&
            resultsWithAds.map((item, index) =>
              item && 'position' in item ? (
                <div
                  key={index}
                  className="mx-auto my-4 flex h-40 w-full max-w-5xl rounded border border-zinc-600 bg-zinc-700"
                >
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    <img
                      src={item.desktop_image}
                      alt={`ad-${item.id}`}
                      className="rounded-lg"
                    />
                  </a>
                </div>
              ) : (
                <SingleCatalogRow
                  tcg={resultsTcg}
                  cardData={item as SingleSearchResult}
                  key={index}
                />
              )
            )}
          {!adsEnabled &&
            filteredResults.map((item, index) => (
              <SingleCatalogRow tcg={resultsTcg} cardData={item} key={index} />
            ))}
        </TabsContent>
        <TabsContent value="catalog">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {adsEnabled &&
              resultsWithAds.map((item, index) =>
                item && 'position' in item ? (
                  <div
                    key={index}
                    className="col-span-1 flex h-full overflow-clip rounded-lg border border-zinc-600 bg-zinc-700"
                  >
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={item.mobile_image}
                        alt={`ad-${item.id}`}
                        className="h-full w-full object-cover"
                      />
                    </a>
                  </div>
                ) : (
                  <SingleCatalogCard
                    cardData={item as SingleSearchResult}
                    key={index}
                  />
                )
              )}
            {!adsEnabled &&
              filteredResults.map((item, index) => (
                <SingleCatalogCard cardData={item} key={index} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="table">
          <SingleResultsTable
            cardData={
              resultsWithAds.filter(
                (item) => item && !('position' in item)
              ) as SingleSearchResult[]
            }
          />
        </TabsContent>
      </Tabs>
      <BackToTopButton />
    </div>
  );
}
