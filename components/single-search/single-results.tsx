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
import AdComponent from '../ad';
import useAuthStore from '@/stores/authStore';

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

  const { hasActiveSubscription } = useAuthStore();
  const adsFromPosition4 = ads.position['4']?.ads || [];
  const adsFromPosition5 = ads.position['5']?.ads || [];

  const resultsWithAds = insertAdvertisements(
    filteredResults,
    9,
    adsFromPosition4
  );

  const resultsWithVerticalAds = insertAdvertisements(
    filteredResults,
    9,
    adsFromPosition5
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
          {!hasActiveSubscription &&
            resultsWithAds.map((item, index) =>
              item && 'position' in item ? (
                <AdComponent ad={item} key={index} />
              ) : (
                <SingleCatalogRow
                  tcg={resultsTcg}
                  cardData={item as SingleSearchResult}
                  key={index}
                />
              )
            )}
          {hasActiveSubscription &&
            filteredResults.map((item, index) => (
              <SingleCatalogRow tcg={resultsTcg} cardData={item} key={index} />
            ))}
        </TabsContent>
        <TabsContent value="catalog">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {!hasActiveSubscription &&
              resultsWithVerticalAds.map((item, index) =>
                item && 'position' in item ? (
                  <AdComponent ad={item} key={index} />
                ) : (
                  <SingleCatalogCard
                    cardData={item as SingleSearchResult}
                    tcg={resultsTcg}
                    key={index}
                  />
                )
              )}
            {hasActiveSubscription &&
              filteredResults.map((item, index) => (
                <SingleCatalogCard
                  tcg={resultsTcg}
                  cardData={item}
                  key={index}
                />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="table">
          <SingleResultsTable
            tcg={resultsTcg}
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
