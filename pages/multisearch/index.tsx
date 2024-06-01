import React, { useEffect } from 'react';
import Head from 'next/head';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ScrollBar } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { handleBuyClick } from '@/utils/analytics';
import MainLayout from '@/components/main-page-layout';
import useAuthStore from '@/stores/authStore';
import LoginRequired from '@/components/login-required';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import PageTitle from '@/components/ui/page-title';
import useGlobalStore from '@/stores/globalStore';
import useMultiSearchStore from '@/stores/multiSearchStore';
import { WebsiteCombobox } from '@/components/multi-search/multi-website-combobox';
import { Tcgs } from '@/types';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import BackToTopButton from '@/components/ui/back-to-top-btn';
import PoweredBy from '@/components/powered-by';

type Props = {};

export default function Multisearch({}: Props) {
  const {
    mode,
    selectedWebsites,
    tcg,
    searchInput,
    results,
    resultsTcg,
    setResultsTcg,
    handleSubmit,
    setSearchInput,
    onWebsiteSelect,
    setTcg
  } = useMultiSearchStore();
  const { fetchWebsites, websites } = useGlobalStore();
  const { hasActiveSubscription, isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchWebsites();
  }, []);

  if (!isAuthenticated) {
    return (
      <LoginRequired
        title="Multi-search"
        message="You must be logged in to use this feature."
      />
    );
  }

  return (
    <>
      <MultisearchHead />
      <MainLayout>
        <div className="flex w-full flex-col justify-center gap-8 text-center">
          <PageTitle
            title="Multi Search"
            subtitle="Search for up to 100 cards across select stores."
          />

          {mode === 'search' && (
            <>
              <SearchView
                tcg={tcg}
                setTcg={setTcg}
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                handleSubmit={handleSubmit}
                websites={websites}
                selectedWebsites={selectedWebsites}
                onWebsiteSelect={onWebsiteSelect}
              />
            </>
          )}
          {mode === 'results' && (
            <>
              <div className="flex flex-col gap-4 md:flex-row">
                <ResultsView results={results} />
                <SummaryView />
              </div>
            </>
          )}
        </div>
        <BackToTopButton />
      </MainLayout>
    </>
  );
}

const SummaryView = () => {
  const { selectedVariants, results, setMode } = useMultiSearchStore();
  const { getWebsiteName } = useGlobalStore();

  // Group the selected variants by website and calculate the total price, excluding any variants with invalid prices
  const websiteSummary = Object.values(selectedVariants).reduce(
    (acc, variant: any) => {
      const { website, price } = variant;

      // Check if price is a valid number
      if (typeof price === 'number' && !isNaN(price)) {
        if (!acc[website]) {
          acc[website] = {
            name: getWebsiteName(website),
            totalPrice: 0
          };
        }
        acc[website].totalPrice += price;
      }
      return acc;
    },
    {} as Record<string, { name: string; totalPrice: number }>
  );

  // Calculate the overall total, skipping invalid prices
  const overallTotal = Object.values(selectedVariants).reduce((acc, item) => {
    return typeof item.price === 'number' && !isNaN(item.price)
      ? acc + item.price
      : acc;
  }, 0);

  return (
    <div className="outlined-container flex h-fit w-full flex-col gap-4 p-4 text-left md:max-w-md">
      <div className="flex flex-col gap-4">
        <p>
          Found {results.filter((result) => result.results.length > 0).length}/
          {results.length} cards
        </p>
        <p>Total: ${overallTotal.toFixed(2)}</p>

        {/* List of selected stores and their total prices, skipping entries with no valid prices */}
        <ScrollArea className="min-h-[100px] w-full rounded-md border bg-popover p-4">
          <span className="text-sm">Selected Websites</span>
          <Table>
            <TableBody className="text-left text-xs">
              {Object.values(websiteSummary).map((website, index) => (
                <TableRow key={index}>
                  <TableCell>{website.name}</TableCell>
                  <TableCell className="text-right">
                    ${website.totalPrice.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="vertical" />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <Button
        onClick={() => {
          setMode('search');
        }}
      >
        Reset
      </Button>
    </div>
  );
};

const ResultsView = ({ results }: { results: any[] }) => {
  const { resultsTcg } = useMultiSearchStore();
  return (
    <div className="flex w-full flex-col gap-2">
      {results.map((result) => (
        <MultiSearchProduct
          key={result.name}
          tcg={resultsTcg}
          product={result}
        />
      ))}
    </div>
  );
};

const MultiSearchProduct = ({
  product,
  tcg
}: {
  product: any;
  tcg: string;
}) => {
  const [selectedVariant, setSelectedVariant] = React.useState(
    product.results[0] || {}
  );

  const { getWebsiteName } = useGlobalStore();
  const { selectVariant } = useMultiSearchStore();

  useEffect(() => {
    if (selectedVariant) {
      selectVariant(product.name, selectedVariant);
    }
  }, [selectedVariant]);

  return (
    <>
      {product.results.length > 0 ? (
        <div className="outlined-container flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <img
              src={selectedVariant.image}
              alt={selectedVariant.name}
              className="mx-auto max-w-48 rounded object-cover sm:mx-0 sm:w-24 sm:max-w-24"
            />
            <div className="flex flex-col text-left">
              <p>{selectedVariant.name}</p>

              <div>${selectedVariant.price}</div>
              <div className="capitalize">{selectedVariant.set}</div>
              <div>{getWebsiteName(selectedVariant.website)}</div>
              <div>{selectedVariant.condition}</div>
              <div>{selectedVariant.foil && 'Foil'}</div>
            </div>
          </div>
          {/* dropdown to browse variants */}

          <Link href={selectedVariant.link} target="_blank" className="">
            <Button
              className="w-full"
              onClick={() => {
                handleBuyClick(
                  selectedVariant.link,
                  selectedVariant.price,
                  selectedVariant.name,
                  tcg
                );
              }}
            >
              Buy
            </Button>
          </Link>
          <ScrollArea className="h-[300px] w-full rounded-md border bg-popover p-4">
            <Table>
              <TableCaption>Variants for {product.name}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Name</TableHead>
                  <TableHead>Set</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                  // map over variants
                  product.results.map((variant: any) => (
                    <TableRow
                      key={variant._id}
                      onClick={() => {
                        setSelectedVariant(variant);
                      }}
                      className="cursor-pointer text-left hover:bg-background"
                    >
                      <TableCell className="w-[100px]">
                        {variant.name}
                      </TableCell>
                      <TableCell className="capitalize">
                        {variant.set}
                      </TableCell>
                      <TableCell>{variant.condition}</TableCell>
                      <TableCell>{getWebsiteName(variant.website)}</TableCell>
                      <TableCell className="text-right">
                        ${variant.price}
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
            <ScrollBar orientation="vertical" />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      ) : (
        <div className="outlined-container flex flex-col gap-4 p-4">
          <p>No results found for {product.name}</p>
        </div>
      )}
    </>
  );
};

const SearchView = ({
  tcg,
  setTcg,
  searchInput,
  setSearchInput,
  handleSubmit,
  websites,
  selectedWebsites,
  onWebsiteSelect
}: {
  tcg: Tcgs;
  setTcg: (value: Tcgs) => void;
  searchInput: string;
  setSearchInput: (value: string) => void;
  handleSubmit: (tcg: string) => void;
  websites: any[];
  selectedWebsites: any[];
  onWebsiteSelect: (value: any) => void;
}) => {
  const { loading } = useMultiSearchStore();
  const { hasActiveSubscription } = useAuthStore();
  const { adsEnabled } = useGlobalStore();
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (!hasActiveSubscription) {
      const lines = value.split('\n');
      if (lines.length > 3) {
        return;
      }
    }
    setSearchInput(value);
  };
  return (
    <div className="outlined-container flex w-full flex-col gap-4 p-6">
      <div className="flex flex-col gap-4 md:flex-row">
        {/* TCG Select */}
        <Select value={tcg} onValueChange={(value: Tcgs) => setTcg(value)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="MTG" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select TCG</SelectLabel>
              <SelectItem value="mtg">MTG</SelectItem>
              <SelectItem value="pokemon">Pokemon</SelectItem>
              <SelectItem value="lorcana">Lorcana</SelectItem>
              <SelectItem value="yugioh">Yu-gi-oh</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Store Combobox */}
        <WebsiteCombobox
          websites={websites.map((website) => ({
            name: website.name,
            code: website.code
          }))}
          selectedWebsites={selectedWebsites}
          onWebsiteSelect={onWebsiteSelect}
        />
        <div className=" flex-grow "></div>
        {adsEnabled && <PoweredBy size="small" />}
      </div>

      {/* Textarea */}
      <Textarea
        rows={hasActiveSubscription ? 10 : 3}
        className="text-[16px]"
        placeholder={`Enter card names (one per line). Max ${
          hasActiveSubscription ? 100 : 3
        } cards.${
          !hasActiveSubscription
            ? ' \nUpgrade to Pro to search up to 100 cards.'
            : ''
        }`}
        // max 3 lines unless hasActiveSubscription is true
        value={searchInput}
        onChange={handleInputChange}
      />
      <Button
        onClick={() => {
          handleSubmit(tcg);
        }}
        disabled={
          searchInput.length === 0 ||
          loading ||
          (!hasActiveSubscription && searchInput.split('\n').length > 3) ||
          searchInput.split('\n').length > 100
        }
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={16} />
            <span className="ml-2">Loading</span>
          </>
        ) : searchInput.split('\n').length > 100 ? (
          'Too many cards'
        ) : (
          'Search'
        )}
      </Button>
    </div>
  );
};

const MultisearchHead = () => {
  return (
    <Head>
      <title>Multi Search</title>
      <meta
        name="description"
        content="Search Magic the Gathering cards across Canada"
      />
      <meta
        property="og:title"
        content={`Snapcaster - Search Magic the Gathering cards across Canada`}
      />
      <meta
        property="og:description"
        content={`Find Magic the Gathering singles and sealed product using in Snapcaster. Search your favourite Canadian stores.`}
      />
      <meta property="og:url" content={`https://snapcaster.ca`} />
      <meta property="og:type" content="website" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};
