import React from 'react';
import useSingleStore from '@/stores/singleSearchStore';
import SingleCatalogRow from './single-list-item';
import SingleCatalogCard from './single-grid-item';
import SingleResultsTable from './single-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BackToTopButton from '../ui/back-to-top-btn';
import type { SingleSearchResult } from '@/stores/store';
import useGlobalStore from '@/stores/globalStore';
type Props = {};

interface Ad {
  type: 'ad';
  content: string;
}

type ResultItem = SingleSearchResult | Ad;

const insertAdvertisements = (
  results: SingleSearchResult[],
  adInterval: number
): ResultItem[] => {
  let resultsWithAds: ResultItem[] = [];
  for (let i = 0; i < results.length; i++) {
    if (i > 0 && i % adInterval === 0) {
      resultsWithAds.push({ type: 'ad', content: 'Tier 2 Ad' });
    }
    resultsWithAds.push(results[i]);
  }
  return resultsWithAds;
};

export default function SingleCatalog({}: Props) {
  const { filteredResults } = useSingleStore();
  const { adsEnabled } = useGlobalStore();
  // Insert advertisements every 10 results
  const resultsWithAds = insertAdvertisements(filteredResults, 9);

  if (filteredResults.length === 0) {
    return (
      <div className="flex items-center justify-center pt-5">
        <div className="text-sm">No results found</div>
      </div>
    );
  }

  return (
    <div>
      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="catalog">Catalog</TabsTrigger>
          <TabsTrigger value="table">Table</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          {adsEnabled &&
            resultsWithAds.map((item, index) =>
              'type' in item && item.type === 'ad' ? (
                <div
                  key={index}
                  className="mx-auto my-4 flex h-40 w-full max-w-5xl items-center justify-center rounded border border-zinc-600 bg-zinc-700"
                >
                  {item.content}
                </div>
              ) : (
                <SingleCatalogRow
                  cardData={item as SingleSearchResult}
                  key={index}
                />
              )
            )}
          {!adsEnabled &&
            filteredResults.map((item, index) => (
              <SingleCatalogRow cardData={item} key={index} />
            ))}
        </TabsContent>
        <TabsContent value="catalog">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {adsEnabled &&
              resultsWithAds.map((item, index) =>
                'type' in item && item.type === 'ad' ? (
                  <div
                    key={index}
                    className="col-span-1 flex h-full items-center justify-center rounded border border-zinc-600 bg-zinc-700 p-4"
                  >
                    {item.content}
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
                (item) => !('type' in item)
              ) as SingleSearchResult[]
            }
          />
        </TabsContent>
      </Tabs>
      <BackToTopButton />
    </div>
  );
}
