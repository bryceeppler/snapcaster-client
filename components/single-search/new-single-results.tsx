import { useState, useMemo } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import useSingleStore from '@/stores/singleSearchStore';
import { Ad } from '@/types/ads';
import { useStore, type SingleSearchResult } from '@/stores/store';
import useGlobalStore from '@/stores/globalStore';
import useAuthStore from '@/stores/authStore';
import CardImage from '../ui/card-image';
import { Badge } from '../ui/badge';
import { handleBuyClick } from '../../utils/analytics';
type ResultItem = SingleSearchResult | Ad;

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

export default function SingleCatalog() {
  const { filteredResults, resultsTcg, promotedCards } = useSingleStore();
  const { adsEnabled, ads } = useGlobalStore();
  const [selectedTab, setSelectedTab] = useState('list');
  const { websites } = useStore();
  const { hasActiveSubscription } = useAuthStore();
  const adsFromPosition4 = ads.position['4']?.ads || [];
  const adsFromPosition5 = ads.position['5']?.ads || [];

  const findWebsiteNameByCode = (slug: string): string => {
    const website = websites.find((website) => website.slug === slug);
    return website ? website.name : 'Website not found';
  };

  const resultsWithAds = useMemo(() => {
    return insertAdvertisements(filteredResults, 9, adsFromPosition4);
  }, [filteredResults, adsFromPosition4]);

  const resultsWithVerticalAds = useMemo(() => {
    return insertAdvertisements(filteredResults, 9, adsFromPosition5);
  }, [filteredResults, adsFromPosition5]);

  const combinedProducts = [
    ...promotedCards.map((card) => ({ ...card, promoted: true })),
    ...resultsWithAds.map((card) => ({ ...card, promoted: false }))
  ];

  const [filters, setFilters] = useState({
    condition: [],
    priceRange: [0, 100],
    rating: 0
  });
  const [sortBy, setSortBy] = useState('relevance');
  const filteredProducts = useMemo(() => {
    return combinedProducts
      .filter((product) => {
        const conditionMatch =
          filters.condition.length === 0 ||
          filters.condition.includes(product.condition);
        const priceMatch =
          product.price >= filters.priceRange[0] &&
          product.price <= filters.priceRange[1];
        return conditionMatch && priceMatch;
      })
      .sort((a, b) => {
        if (a.promoted && !b.promoted) return -1;
        if (!a.promoted && b.promoted) return 1;
        switch (sortBy) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          default:
            return 0;
        }
      });
  }, [filters, sortBy]);

  const handleFilterChange = (type, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [type]: value
    }));
  };
  const handleSortChange = (value) => {
    setSortBy(value);
  };
  return (
    <div className="grid gap-6 md:grid-cols-[240px_1fr]">
      <div className="flex flex-col gap-6">
        <div className="grid gap-4">
          <Accordion type="single" collapsible>
            <AccordionItem value="condition">
              <AccordionTrigger className="text-base">
                Condition
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-2">
                  <Label className="flex items-center gap-2 font-normal">
                    <Checkbox
                      checked={filters.condition.includes('NM')}
                      onCheckedChange={() =>
                        handleFilterChange(
                          'condition',
                          filters.condition.includes('NM')
                            ? filters.condition.filter((c) => c !== 'NM')
                            : [...filters.condition, 'NM']
                        )
                      }
                    />
                    NM
                  </Label>
                  <Label className="flex items-center gap-2 font-normal">
                    <Checkbox
                      checked={filters.condition.includes('LP')}
                      onCheckedChange={() =>
                        handleFilterChange(
                          'condition',
                          filters.condition.includes('LP')
                            ? filters.condition.filter((c) => c !== 'LP')
                            : [...filters.condition, 'LP']
                        )
                      }
                    />
                    LP
                  </Label>
                  <Label className="flex items-center gap-2 font-normal">
                    <Checkbox
                      checked={filters.condition.includes('MP')}
                      onCheckedChange={() =>
                        handleFilterChange(
                          'condition',
                          filters.condition.includes('MP')
                            ? filters.condition.filter((c) => c !== 'MP')
                            : [...filters.condition, 'MP']
                        )
                      }
                    />
                    MP
                  </Label>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="price">
              <AccordionTrigger className="text-base">Price</AccordionTrigger>
              <AccordionContent>
                <div />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="rating">
              <AccordionTrigger className="text-base">Rating</AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-2">
                  <Label className="flex items-center gap-2 font-normal">
                    <Checkbox
                      checked={filters.rating >= 4}
                      onCheckedChange={() =>
                        handleFilterChange(
                          'rating',
                          filters.rating >= 4 ? 0 : 4
                        )
                      }
                    />
                    4 stars and above
                  </Label>
                  <Label className="flex items-center gap-2 font-normal">
                    <Checkbox
                      checked={filters.rating >= 3}
                      onCheckedChange={() =>
                        handleFilterChange(
                          'rating',
                          filters.rating >= 3 ? 0 : 3
                        )
                      }
                    />
                    3 stars and above
                  </Label>
                  <Label className="flex items-center gap-2 font-normal">
                    <Checkbox
                      checked={filters.rating >= 2}
                      onCheckedChange={() =>
                        handleFilterChange(
                          'rating',
                          filters.rating >= 2 ? 0 : 2
                        )
                      }
                    />
                    2 stars and above
                  </Label>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Search Results</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="shrink-0">
                <ArrowUpDownIcon className="mr-2 h-4 w-4" />
                Sort by
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]" align="end">
              <DropdownMenuRadioGroup
                value={sortBy}
                onValueChange={handleSortChange}
              >
                <DropdownMenuRadioItem value="relevance">
                  Relevance
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="price-asc">
                  Price: Low to High
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="price-desc">
                  Price: High to Low
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="rating">
                  Rating
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="flex flex-col">
              <div
                key={product.id}
                className={`group relative flex h-full flex-col rounded-t-lg border border-accent bg-popover ${
                  product.promoted ? 'bg-primary/10 p-6' : 'p-6'
                }`}
              >
                <CardImage imageUrl={product.image} alt={product.name} />
                {product.promoted && (
                  <div className="absolute left-3 top-3 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                    Promoted
                  </div>
                )}
                <div className="flex flex-grow flex-col gap-1 pt-2 text-left">
                  <div className="text-xs font-bold uppercase text-muted-foreground">
                    {product.set}
                  </div>
                  <h3 className="text-sm font-bold tracking-tight">
                    {product.name}
                  </h3>
                  <div className="flex flex-row gap-2">
                    {product.website === 'obsidian' && (
                      <img
                        src="/obsidian_icon.png"
                        alt="Website"
                        className="h-4 w-4"
                      />
                    )}
                    <div className="text-xs">
                      {findWebsiteNameByCode(product.website)}
                    </div>
                  </div>
                  <div className="mt-2 flex flex-row justify-between">
                    <Badge
                      className={`w-fit border-2 border-black text-white ${
                        product.foil
                          ? 'bg-foil bg-cover bg-center'
                          : 'bg-accent'
                      }`}
                    >
                      {product.condition}
                    </Badge>
                    <h4 className="">${product.price.toFixed(2)}</h4>
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
                      resultsTcg
                    )
                  }
                >
                  Buy
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ArrowUpDownIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21 16-4 4-4-4" />
      <path d="M17 20V4" />
      <path d="m3 8 4-4 4 4" />
      <path d="M7 4v16" />
    </svg>
  );
}

function StarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
