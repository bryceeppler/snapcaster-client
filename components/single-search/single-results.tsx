import { useState, useMemo, SetStateAction } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import AdComponent from '../ad';
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
import { Input } from '../ui/input';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import BackToTopButton from '../ui/back-to-top-btn';
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

export default function SingleCatalog({ loading }: { loading: boolean }) {
  const { filteredResults, promotedCards } = useSingleStore();
  const { ads } = useGlobalStore();
  const { websites } = useStore();
  const { hasActiveSubscription } = useAuthStore();
  const adsFromPosition5 = ads.position['5']?.ads || [];

  const [filters, setFilters] = useState({
    condition: [] as string[],
    priceRange: [0, 10000] as [number, number],
    vendor: [] as string[],
    set: [] as string[],
    foil: [] as string[]
  });
  const [sortBy, setSortBy] = useState('relevance');
  const filteredProducts = useMemo(() => {
    const tempFiltered = filteredResults
      .filter((product) => {
        const conditionMatch =
          filters.condition.length === 0 ||
          filters.condition.includes(product.condition);
        const priceMatch =
          product.price >= filters.priceRange[0] &&
          product.price <= filters.priceRange[1];

        const vendorMatch =
          filters.vendor.length === 0 ||
          filters.vendor.includes(product.website);

        const setMatch =
          filters.set.length === 0 || filters.set.includes(product.set);

        const foilMatch =
          filters.foil.length === 0 || filters.foil.includes(product.foil);

        return (
          conditionMatch && priceMatch && vendorMatch && setMatch && foilMatch
        );
      })
      .sort((a, b) => {
        if (a.promoted && !b.promoted) return -1;
        if (!a.promoted && b.promoted) return 1;
        switch (sortBy) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'vendor-asc':
            return a.website.localeCompare(b.website);
          case 'vendor-desc':
            return b.website.localeCompare(a.website);
          case 'set-asc':
            return a.set.localeCompare(b.set);
          case 'set-desc':
            return b.set.localeCompare(a.set);
          default:
            return 0;
        }
      });
    const withAds = insertAdvertisements(tempFiltered, 9, adsFromPosition5);
    // add "promoted"=true to promoted cards, and "promoted"=false to the rest
    const combined = [
      promotedCards.map((card) => ({ ...card, promoted: true })),
      withAds
    ].flat();

    return combined;
  }, [filters, sortBy, filteredResults]);

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
  const handleSortChange = (value: SetStateAction<string>) => {
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
                  <Label className="flex items-center gap-2 font-normal">
                    <Checkbox
                      checked={filters.condition.includes('HP')}
                      onCheckedChange={() =>
                        handleFilterChange(
                          'condition',
                          filters.condition.includes('HP')
                            ? filters.condition.filter((c) => c !== 'HP')
                            : [...filters.condition, 'HP']
                        )
                      }
                    />
                    HP
                  </Label>
                  <Label className="flex items-center gap-2 font-normal">
                    <Checkbox
                      checked={filters.condition.includes('DMG')}
                      onCheckedChange={() =>
                        handleFilterChange(
                          'condition',
                          filters.condition.includes('DMG')
                            ? filters.condition.filter((c) => c !== 'DMG')
                            : [...filters.condition, 'DMG']
                        )
                      }
                    />
                    DMG
                  </Label>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="price">
              <AccordionTrigger className="text-base">Price</AccordionTrigger>
              <AccordionContent>
                {/* from x to y inputs */}
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 p-2">
                    <Input
                      type="number"
                      value={filters.priceRange[0]}
                      onChange={(e) =>
                        handleFilterChange('priceRange', [
                          e.target.value === '' ? '' : parseInt(e.target.value),
                          filters.priceRange[1]
                        ])
                      }
                      onBlur={(e) =>
                        handleFilterChange('priceRange', [
                          e.target.value === '' ? 0 : parseInt(e.target.value),
                          filters.priceRange[1]
                        ])
                      }
                    />
                    <span>to</span>
                    <Input
                      type="number"
                      value={filters.priceRange[1]}
                      onChange={(e) =>
                        handleFilterChange('priceRange', [
                          filters.priceRange[0],
                          e.target.value === '' ? '' : parseInt(e.target.value)
                        ])
                      }
                      onBlur={(e) =>
                        handleFilterChange('priceRange', [
                          filters.priceRange[0],
                          e.target.value === ''
                            ? 10000
                            : parseInt(e.target.value)
                        ])
                      }
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="foil">
              <AccordionTrigger className="text-base">Foil</AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-2">
                  {Array.from(
                    new Set(
                      filteredResults
                        .map((product) => product.foil)
                        .filter((foil) => foil && foil.trim() !== '')
                    )
                  )
                    .sort()
                    .map((foil) => (
                      <Label
                        key={foil}
                        className="flex items-center gap-2 overflow-clip text-left text-xs font-normal capitalize"
                      >
                        <Checkbox
                          checked={filters.foil.includes(foil)}
                          onCheckedChange={() =>
                            handleFilterChange(
                              'foil',
                              filters.foil.includes(foil)
                                ? filters.foil.filter((s) => s !== foil)
                                : [...filters.foil, foil]
                            )
                          }
                        />
                        <div className="line-clamp-1">{foil}</div>
                      </Label>
                    ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="vendor">
              <AccordionTrigger className="text-base">Vendor</AccordionTrigger>
              <AccordionContent>
                <ScrollArea className="h-[200px] overflow-y-auto">
                  <div className="grid gap-2">
                    {websites
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((website) => (
                        <Label
                          key={website.slug}
                          className="flex items-center gap-2 font-normal"
                        >
                          <Checkbox
                            checked={filters.vendor.includes(website.slug)}
                            onCheckedChange={() =>
                              handleFilterChange(
                                'vendor',
                                filters.vendor.includes(website.slug)
                                  ? filters.vendor.filter(
                                      (v) => v !== website.slug
                                    )
                                  : [...filters.vendor, website.slug]
                              )
                            }
                          />
                          {website.name}
                        </Label>
                      ))}
                  </div>
                  <ScrollBar orientation="vertical" />{' '}
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="set">
              <AccordionTrigger className="text-base">Set</AccordionTrigger>
              <AccordionContent>
                <ScrollArea className="h-[200px] overflow-y-auto">
                  <div className="grid gap-2">
                    {Array.from(
                      new Set(
                        filteredResults
                          .map((product) => product.set)
                          .filter((set) => set && set.trim() !== '')
                      )
                    )
                      .sort()
                      .map((set) => (
                        <Label
                          key={set}
                          className="flex items-center gap-2 overflow-clip text-left text-xs font-normal capitalize"
                        >
                          <Checkbox
                            checked={filters.set.includes(set)}
                            onCheckedChange={() =>
                              handleFilterChange(
                                'set',
                                filters.set.includes(set)
                                  ? filters.set.filter((s) => s !== set)
                                  : [...filters.set, set]
                              )
                            }
                          />
                          <div className="line-clamp-1">{set}</div>
                        </Label>
                      ))}
                  </div>
                  <ScrollBar orientation="vertical" />{' '}
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {
            // if filters are not default, show clear filters button
            filters.condition.length > 0 ||
            filters.vendor.length > 0 ||
            filters.set.length > 0 ||
            filters.priceRange[0] !== 0 ||
            filters.priceRange[1] !== 10000 ? (
              <Button
                onClick={() =>
                  setFilters({
                    condition: [],
                    priceRange: [0, 10000],
                    vendor: [],
                    set: [],
                    foil: []
                  })
                }
              >
                Clear Filters
              </Button>
            ) : null
          }
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
                <DropdownMenuRadioItem value="price-asc">
                  Price: Low to High
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="price-desc">
                  Price: High to Low
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="set-asc">
                  Set A-Z
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="set-desc">
                  Set Z-A
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="vendor-asc">
                  Vendor A-Z
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="vendor-desc">
                  Vendor Z-A
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {loading && <ResultsSkeleton />}

        {!loading && (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {!hasActiveSubscription &&
              filteredProducts.map((item, index) =>
                item && 'position' in item ? (
                  <AdComponent ad={item} key={index} />
                ) : (
                  <CatalogItem product={item} key={index} />
                )
              )}
            {hasActiveSubscription &&
              filteredProducts.map((item, index) => {
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
  promoted: boolean;
}

function CatalogItem({ product }: { product: SingleCatalogCard }) {
  const { resultsTcg } = useSingleStore();
  const { websites } = useStore();
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
          <CardImage
            imageUrl={product.image}
            alt={product.name}
            // href={product.link}
          />
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
          <h3 className="text-sm font-bold tracking-tight">{product.name}</h3>
          <div className="flex flex-row gap-2">
            {product.website === 'obsidian' && (
              <img src="/obsidian_icon.png" alt="Website" className="h-4 w-4" />
            )}
            <div className="text-xs">
              {findWebsiteNameByCode(product.website)}
            </div>
          </div>
        </div>
        {product.website === 'obsidian' && (
          <div className="mt-3 flex w-full">
            <div className="text-left text-[0.7rem] tracking-tighter text-muted-foreground">
              With code{' '}
              <span className="text-xs font-bold">OBSIDIAN+SNAPCASTER5</span>
            </div>
          </div>
        )}
        <div className="mt-3">
          {product.website === 'obsidian' && (
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
            <h4 className="">${Number(product.price).toFixed(2)}</h4>
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
  );
}

function ResultsSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <div className="h-96 w-full animate-pulse rounded-lg bg-accent"></div>
      <div className="h-96 w-full animate-pulse rounded-lg bg-accent"></div>
      <div className="h-96 w-full animate-pulse rounded-lg bg-accent"></div>
      <div className="h-96 w-full animate-pulse rounded-lg bg-accent"></div>
    </div>
  );
}

function ArrowUpDownIcon(props: any) {
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
