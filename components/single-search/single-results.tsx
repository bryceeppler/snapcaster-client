import { useState, useMemo, SetStateAction, useEffect } from 'react';
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
import { MessageSquareWarning } from 'lucide-react';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import SingleFilterAccordian from './single-filter-accordian';
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
  const { filteredResults, promotedCards, tcg, searchQuery, results } =
    useSingleStore();
  const { ads } = useGlobalStore();
  const { websites } = useStore();
  const { hasActiveSubscription } = useAuthStore();
  const adsFromPosition5 = ads.position['5']?.ads || [];
  const [filters, setFilters] = useState({
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
  });
  useEffect(() => {
    setFilters({
      exactMatch: [false],
      condition: [],
      priceRange: [0, 10000],
      vendor: [],
      foil: [],
      set: [],
      alternate_art: [],
      showcase: [],
      frame: [],
      promo: [],
      art_series: [],
      collector_number: []
    });
  }, [tcg, searchQuery]);
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

        const nameMatch =
          (filters.exactMatch[0] &&
            product.name.toLowerCase() === searchQuery.toLowerCase()) ||
          !filters.exactMatch[0];

        const vendorMatch =
          filters.vendor.length === 0 ||
          filters.vendor.includes(product.website);

        const setMatch =
          filters.set.length === 0 || filters.set.includes(product.set);

        const foilMatch =
          filters.foil.length === 0 || filters.foil.includes(product.foil);

        const collector_number =
          filters.collector_number.length === 0 ||
          filters.collector_number.includes(product.collector_number);

        const alternate_art =
          filters.alternate_art.length === 0 ||
          filters.alternate_art.includes(product.alternate_art);

        const showcase =
          filters.showcase.length === 0 ||
          filters.showcase.includes(product.showcase);

        const frame =
          filters.frame.length === 0 || filters.frame.includes(product.frame);

        const promo =
          filters.promo.length === 0 || filters.promo.includes(product.promo);

        const art_series =
          filters.art_series.length === 0 ||
          filters.art_series.includes(product.art_series);
        return (
          nameMatch &&
          conditionMatch &&
          priceMatch &&
          vendorMatch &&
          setMatch &&
          foilMatch &&
          collector_number &&
          alternate_art &&
          showcase &&
          frame &&
          promo &&
          art_series
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
          case 'name-asc':
            return a.name.localeCompare(b.name);
          case 'name-desc':
            return b.name.localeCompare(a.name);
          case 'set-asc':
            return a.set.localeCompare(b.set);
          case 'set-desc':
            return b.set.localeCompare(a.set);
          default:
            return 0;
        }
      });

    // add "promoted"=true to promoted cards, and "promoted"=false to the rest
    const combined = [
      promotedCards.map((card) => ({ ...card, promoted: true })),
      tempFiltered.map((card) => ({ ...card, promoted: false }))
    ].flat();

    const withAds = insertAdvertisements(combined, 6, adsFromPosition5);

    return withAds;
  }, [filters, sortBy, filteredResults]);

  const handleFilterChange = (type: string, value: any[]) => {
    console.log(filters);
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
    console.log(filters);
  };
  const handleSortChange = (value: SetStateAction<string>) => {
    setSortBy(value);
  };

  return (
    <div className="grid gap-6 md:grid-cols-[240px_1fr]">
      <div className="flex flex-col gap-6">
        <div className="grid gap-4">
          {!hasActiveSubscription && (
            <div className="flex flex-row items-center gap-2 rounded-lg bg-popover p-3">
              <ExclamationTriangleIcon className="aspect-square h-4 min-w-4 text-yellow-500" />
              <p className="text-left text-xs">
                Snapcaster Pro filters will be available until the end of August
                for all users.
              </p>
            </div>
          )}
          <div className="grid gap-2">
            <Label className="flex items-center gap-2 font-normal">
              <Checkbox
                checked={filters.exactMatch[0]}
                onCheckedChange={() =>
                  handleFilterChange(
                    'exactMatch',
                    !filters.exactMatch[0] ? [true] : [false]
                  )
                }
              />
              Exact Name Filter
            </Label>
          </div>

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
            {(tcg === 'pokemon' ||
              tcg === 'lorcana' ||
              tcg === 'yugioh' ||
              tcg === 'onepiece') && (
              <SingleFilterAccordian
                filters={filters}
                filterOption="collector_number"
                header="Collector Number"
                handleFilterChange={handleFilterChange}
              />
            )}
            {tcg != 'pokemon' && (
              <SingleFilterAccordian
                filters={filters}
                filterOption="foil"
                header={tcg == 'yugioh' ? 'Rarity' : 'Foil'}
                handleFilterChange={handleFilterChange}
              ></SingleFilterAccordian>
            )}

            {tcg == 'mtg' && (
              <>
                <SingleFilterAccordian
                  filters={filters}
                  filterOption="frame"
                  header="Frame"
                  handleFilterChange={handleFilterChange}
                ></SingleFilterAccordian>
                <SingleFilterAccordian
                  filters={filters}
                  filterOption="showcase"
                  header="Showcase"
                  handleFilterChange={handleFilterChange}
                ></SingleFilterAccordian>
                <SingleFilterAccordian
                  filters={filters}
                  filterOption="alternate_art"
                  header="Alternate Art"
                  handleFilterChange={handleFilterChange}
                ></SingleFilterAccordian>
                <SingleFilterAccordian
                  filters={filters}
                  filterOption="promo"
                  header="Promo"
                  handleFilterChange={handleFilterChange}
                ></SingleFilterAccordian>
                <SingleFilterAccordian
                  filters={filters}
                  filterOption="art_series"
                  header="Art Series"
                  handleFilterChange={handleFilterChange}
                ></SingleFilterAccordian>
              </>
            )}
            <SingleFilterAccordian
              filters={filters}
              filterOption="set"
              header="Set"
              handleFilterChange={handleFilterChange}
            ></SingleFilterAccordian>
            <AccordionItem value="vendor">
              <AccordionTrigger className="text-base">Vendor</AccordionTrigger>
              <AccordionContent>
                <ScrollArea className="flex max-h-[200px] flex-col overflow-y-auto">
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
          </Accordion>

          {
            // if filters are not default, show clear filters button
            filters.condition.length > 0 ||
            filters.vendor.length > 0 ||
            filters.set.length > 0 ||
            filters.foil.length > 0 ||
            filters.collector_number.length > 0 ||
            filters.alternate_art.length > 0 ||
            filters.showcase.length > 0 ||
            filters.frame.length > 0 ||
            filters.promo.length > 0 ||
            filters.art_series.length > 0 ||
            filters.priceRange[0] !== 0 ||
            filters.priceRange[1] !== 10000 ? (
              <Button
                onClick={() =>
                  setFilters({
                    exactMatch: [false],
                    condition: [],
                    priceRange: [0, 10000],
                    vendor: [],
                    foil: [],
                    set: [],
                    alternate_art: [],
                    showcase: [],
                    frame: [],
                    promo: [],
                    art_series: [],
                    collector_number: []
                  })
                }
              >
                Clear Filters
              </Button>
            ) : null
          }
        </div>
      </div>
      <div className="grid h-min gap-6">
        <div className="flex justify-between">
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
                <DropdownMenuRadioItem value="name-asc">
                  Name A-Z
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="name-desc">
                  Name Z-A
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
        {/* If we have 1000 results, show warning */}
        {results.length >= 1000 && (
          <div className=" w-full rounded border bg-red-600/50 p-2 text-xs shadow">
            Displaying the first 1000 results. Try narrowing your search with
            autofill.
          </div>
        )}
        {loading && <ResultsSkeleton />}

        {!loading && (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
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

          {/* Remove This September 1 (Will be pro only)*/}
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

          {/* Uncomment This September 1 (Will be pro only)*/}
          {/* <h3 className="text-sm font-bold capitalize tracking-tight">{`${
            product.name
          } ${
            hasActiveSubscription == true && product.collector_number
              ? `(${product.collector_number})`
              : ''
          }`}</h3>
          {hasActiveSubscription == true && (
            <h4 className="text-xs  font-semibold capitalize tracking-tight  text-muted-foreground">{` ${
              product.frame ? product.frame : ''
            }  ${
              product.foil !== 'foil' && product.foil != null
                ? product.foil
                : ''
            } ${product.showcase ? product.showcase : ''} ${
              product.alternate_art ? product.alternate_art : ''
            } ${product.promo ? product.promo : ''} ${
              product.art_series ? product.art_series : ''
            }`}</h4>
          )} */}

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
