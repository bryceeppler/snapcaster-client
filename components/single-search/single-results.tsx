import { useState, SetStateAction, useEffect } from 'react';
import Link from 'next/link';

import useGlobalStore from '@/stores/globalStore';
import useAuthStore from '@/stores/authStore';
import { useStore, type SingleSearchResult } from '@/stores/store';
import useSingleStore from '@/stores/singleSearchStore';

import { Button } from '@/components/ui/button';
import { Badge } from '../ui/badge';
import CardImage from '../ui/card-image';
import BackToTopButton from '../ui/back-to-top-btn';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

import AdComponent from '../ad';
import { Ad } from '@/types/ads';
import { handleBuyClick } from '../../utils/analytics';

import SingleSortBy from './single-sort-by';
import FilterDropdown from './filter-dropdown';
import ResultsSkeleton from './results-skeleton';

type ResultItem = SingleSearchResult | Ad;

const defaultFilters = {
  exactMatch: [false],
  condition: [] as string[],
  priceRange: [0, 10000] as [number, number],
  vendor: [] as string[],
  set: [] as string[],
  foil: [] as string[],
  alternate_art: [] as string[],
  showcase: [] as string[],
  frame: [] as string[],
  promo: [] as string[],
  art_series: [] as string[],
  collector_number: [] as string[]
};

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
  // push the first ad at the beginning
  const randomAd = getRandomAd(ads);
  if (randomAd) {
    resultsWithAds.push(randomAd);
  }
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

export default function SingleCatalog({ loading }: { loading: boolean }) {
  // Zustand Stores //
  const { promotedCards, tcg, results } =
    useSingleStore();
  const { ads } = useGlobalStore();
  const { hasActiveSubscription } = useAuthStore();

  // Ads //
  const adsFromPosition5 = ads.position['5']?.ads || [];

  // Sorting //
  const [sortBy, setSortBy] = useState('relevance');
  const handleSortChange = (value: SetStateAction<string>) => {
    setSortBy(value);
  };

  // Filters //
  const [isFilterToggled, setIsFilterToggled] = useState(false);
  const [filters, setFilters] = useState(defaultFilters);
  const handleFilterChange = (type: string, value: any[]) => {
    setFilters((prevFilters) => {
      let newValue = value;
      if (type === 'priceRange') {
        newValue = [
          value[0] === '' ? 0 : value[0],
          value[1] === '' ? 10000 : value[1]
        ];
      }
      return {
        ...prevFilters,
        [type]: newValue
      };
    });
  };

  // Check if the filters object is the same as the default filters //
  useEffect(() => {
    const isDefault = Object.keys(defaultFilters).every(
      (key) =>
        JSON.stringify(filters[key as keyof typeof filters]) ===
        JSON.stringify(defaultFilters[key as keyof typeof defaultFilters])
    );
    isDefault ? setIsFilterToggled(false) : setIsFilterToggled(true);
  }, [filters]);

  // Toggle Filters to Default (When user Changes TCG's)//
  useEffect(() => {
    setFilters(defaultFilters);
    setIsFilterToggled(false);
  }, [tcg]);

  return (
    <div className="grid min-h-svh gap-6 md:grid-cols-[240px_1fr]">
      <div className="flex flex-col gap-6">
        <div className="grid gap-4">
          <div className="relative flex w-full gap-2">
            <div className="child-1 w-1/2 md:w-full">
              <FilterDropdown/>
            </div>
            <div className="child-2 w-1/2 md:hidden">
              <SingleSortBy
                sortBy={sortBy}
                handleSortChange={handleSortChange}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="grid h-min gap-6">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Search Results</h1>
          <div className="hidden md:block">
            <SingleSortBy sortBy={sortBy} handleSortChange={handleSortChange} />
          </div>
        </div>
        {loading && <ResultsSkeleton />}

        {!loading && (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
            {!hasActiveSubscription &&
              results.map((item, index) =>
                item && 'position' in item ? (
                  <AdComponent ad={item} key={index} />
                ) : (
                  <CatalogItem product={item} key={index} />
                )
              )}
            {hasActiveSubscription &&
              results.map((item, index) => {
                if ('position' in item) {
                  return;
                }
                return <CatalogItem product={item} key={index} />;
              })}
          </div>
        )}
      </div>
      <BackToTopButton />
    </div>
  );
}

interface SingleCatalogCard extends SingleSearchResult {
  promoted?: boolean;
}

function CatalogItem({ product }: { product: SingleCatalogCard }) {
  const { resultsTcg } = useSingleStore();
  const { hasActiveSubscription } = useAuthStore();
  const { websites, promoMap } = useStore();
  const findWebsiteNameByCode = (slug: string) => {
    const website = websites.find((website) => website.slug === slug);
    return website ? website.name : 'Website not found';
  };

  return (
    <div className="flex flex-col">
      <div
        className={`group flex h-full flex-col rounded-t-lg border border-accent bg-popover ${
          product.promoted ? 'bg-primary/10 p-6' : 'p-6'
        }`}
      >
        <div className="relative mx-auto max-w-[150px] md:max-w-[250px]">
          <CardImage imageUrl={product.image} alt={product.name} />
          {product.promoted && (
            <Badge className="absolute -left-2 -top-2 bg-gradient-to-tr from-primary to-red-700 shadow">
              Promoted
            </Badge>
          )}
        </div>
        <div className="flex flex-grow flex-col gap-1 pt-2 text-left">
          <div className="text-xs font-bold uppercase text-muted-foreground">
            {product.set}
          </div>

          <h3 className="text-sm font-bold capitalize tracking-tight">{`${
            product.name
          } ${
            product.collector_number ? `(${product.collector_number})` : ''
          }`}</h3>

          <h4 className="text-xs  font-semibold capitalize tracking-tight text-muted-foreground">{` ${
            product.frame ? product.frame : ''
          }  ${
            product.foil !== 'foil' && product.foil != null ? product.foil : ''
          } ${product.showcase ? product.showcase : ''} ${
            product.alternate_art ? product.alternate_art : ''
          } ${product.promo ? product.promo : ''} ${
            product.art_series ? product.art_series : ''
          }`}</h4>

          <div className="flex flex-row gap-2">
            {websites.map(
              (website, index) =>
                product.website === website.slug &&
                website.image_source && (
                  <img
                    src={website.image_source}
                    alt="Website"
                    className="h-4 w-4"
                    key={index}
                  />
                )
            )}

            <div className="text-xs">
              {findWebsiteNameByCode(product.website)}
            </div>
          </div>
        </div>

        {product.website in promoMap && (
          <div className="mt-3 flex w-full" key={product.website}>
            <div className="text-left text-[0.7rem] tracking-tighter text-muted-foreground">
              With code <br />
              <span className="text-xs font-bold">
                {promoMap[product.website].promoCode}
              </span>
            </div>
          </div>
        )}

        <div className="mt-3">
          {product.website in promoMap && (
            <h4 className="text-right text-xs text-muted-foreground line-through">
              ${Number(product.priceBeforeDiscount)?.toFixed(2)}
            </h4>
          )}
          <div className="   flex flex-row justify-between">
            <div className="flex flex-col justify-end">
              <Badge
                className={` border-2 border-accent-foreground text-white ${
                  product.foil ? 'bg-foil bg-cover bg-center' : 'bg-accent'
                }`}
              >
                {product.condition}
              </Badge>
            </div>
            <h4>${Number(product.price).toFixed(2)}</h4>
          </div>
        </div>
      </div>
      <Link
        href={product.link}
        target="_blank"
        rel="noreferrer"
        className="w-full"
      >
        <Button
          className="w-full rounded-b-lg rounded-t-none"
          onClick={() =>
            handleBuyClick(
              product.link,
              product.price,
              product.name,
              product.promoted ?? false,
              resultsTcg
            )
          }
        >
          Buy
        </Button>
      </Link>
    </div>
  );
}
