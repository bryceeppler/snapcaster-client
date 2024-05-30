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
  positionId: string;
  adType: string;
  adId: string;
  url: string;
  images: {
    desktop: string;
    mobile: string;
  };
}

type ResultItem = SingleSearchResult | Ad;

const horizontalAds = [
  {
    positionId: 'top-banner',
    adType: 'horizontal-banner',
    adId: '1',
    url: 'https://obsidiangames.ca/',
    images: {
      desktop:
        'https://s3.ca-central-1.amazonaws.com/cdn.snapcaster.ca/obsidian_1008x160.png',
      mobile:
        'https://s3.ca-central-1.amazonaws.com/cdn.snapcaster.ca/obsidian_1008x160.png'
    }
  },
  {
    positionId: 'left-banner',
    adType: 'horizontal-banner',
    adId: '2',
    url: 'https://company2.com/',
    images: {
      desktop:
        'https://s3.ca-central-1.amazonaws.com/cdn.snapcaster.ca/obsidian_1008x160.png',
      mobile:
        'https://s3.ca-central-1.amazonaws.com/cdn.snapcaster.ca/obsidian_382x160.png'
    }
  }
] as Ad[];

const verticalAds = [
  {
    positionId: 'side-banner',
    adType: 'vertical-banner',
    adId: '3',
    url: 'https://example.com/',
    images: {
      desktop:
        'https://s3.ca-central-1.amazonaws.com/cdn.snapcaster.ca/obsidian_pokemon_vertical_lg.png',
      mobile:
        'https://s3.ca-central-1.amazonaws.com/cdn.snapcaster.ca/ad_placeholder.png'
    }
  },
  {
    positionId: 'side-banner',
    adType: 'vertical-banner',
    adId: '4',
    url: 'https://anotherexample.com/',
    images: {
      desktop:
        'https://s3.ca-central-1.amazonaws.com/cdn.snapcaster.ca/ad_placeholder_vertical_lg.png',
      mobile:
        'https://s3.ca-central-1.amazonaws.com/cdn.snapcaster.ca/vertical_ad_2.png'
    }
  },
  {
    positionId: 'side-banner',
    adType: 'vertical-banner',
    adId: '5',
    url: 'https://yetanotherexample.com/',
    images: {
      desktop:
        'https://s3.ca-central-1.amazonaws.com/cdn.snapcaster.ca/obsidian_mtg_vertical_lg.png',
      mobile:
        'https://s3.ca-central-1.amazonaws.com/cdn.snapcaster.ca/vertical_ad_3.png'
    }
  }
] as Ad[];

// Helper function to get a random ad from a list of ads
const getRandomAd = (ads: Ad[]): Ad => {
  const randomIndex = Math.floor(Math.random() * ads.length);
  return ads[randomIndex];
};

const insertAdvertisements = (
  results: SingleSearchResult[],
  adInterval: number,
  adType: 'horizontal' | 'vertical'
): ResultItem[] => {
  const ads = adType === 'horizontal' ? horizontalAds : verticalAds;
  let resultsWithAds: ResultItem[] = [];
  for (let i = 0; i < results.length; i++) {
    if (i > 0 && i % adInterval === 0) {
      resultsWithAds.push(getRandomAd(ads));
    }
    resultsWithAds.push(results[i]);
  }
  return resultsWithAds;
};

export default function SingleCatalog({}: Props) {
  const { filteredResults, resultsTcg } = useSingleStore();
  const { adsEnabled } = useGlobalStore();
  // Insert advertisements every 10 results
  const resultsWithAds = insertAdvertisements(filteredResults, 9, 'horizontal');

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
              'adType' in item ? (
                <div
                  key={index}
                  className="mx-auto my-4 flex h-40 w-full max-w-5xl rounded border border-zinc-600 bg-zinc-700"
                >
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    <img
                      src={item.images.desktop}
                      alt={`ad-${item.adId}`}
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
              insertAdvertisements(filteredResults, 9, 'vertical').map(
                (item, index) =>
                  'adType' in item ? (
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
                          src={item.images.desktop}
                          alt={`ad-${item.adId}`}
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
                (item) => !('adType' in item)
              ) as SingleSearchResult[]
            }
          />
        </TabsContent>
      </Tabs>
      <BackToTopButton />
    </div>
  );
}
