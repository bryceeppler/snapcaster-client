import React, { useEffect } from 'react';
import Head from 'next/head';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ScrollBar } from '@/components/ui/scroll-area';

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
import { WebsiteCombobox } from '@/components/multi-search-2/multi-website-combobox';
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
import { Scroll } from 'lucide-react';

type Props = {};

export default function Multisearch({}: Props) {
  const {
    mode,
    selectedWebsites,
    tcg,
    searchInput,
    searchQuery,
    results,
    handleSubmit,
    setSearchInput,
    onWebsiteSelect,
    setTcg
  } = useMultiSearchStore();
  const { fetchWebsites, websites, getWebsiteName } = useGlobalStore();
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
        {mode === 'search' && (
          <div className="container w-full flex-1 flex-col items-center justify-center text-center">
            <PageTitle title="Multi Search" />
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
          </div>
        )}
        {mode === 'results' && (
          <div className="container w-full flex-1 flex-col items-center justify-center text-center">
            <PageTitle title="Multi Search" />
            <ResultsView results={results} getWebsiteName={getWebsiteName} />
          </div>
        )}
      </MainLayout>
    </>
  );
}

const ResultsView = ({
  results,
  getWebsiteName
}: {
  results: any[];
  getWebsiteName: (code: string) => string;
}) => {
  return (
    <div className="flex flex-col gap-2">
      {/* <p>Found 24/25 cards</p> */}
      <p>
        Found {results.filter((result) => result.results.length > 0).length}/
        {results.length} cards
      </p>
      {results.map((result) => (
        <MultiSearchProduct key={result.name} product={result} />
      ))}
    </div>
  );
};

const MultiSearchProduct = ({ product }: { product: any }) => {
  const [selectedVariant, setSelectedVariant] = React.useState(
    product.results[0] || {}
  );

  const { getWebsiteName } = useGlobalStore();

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

          <Button>Buy</Button>
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
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
                      onClick={() => setSelectedVariant(variant)}
                      className="cursor-pointer text-left"
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
  handleSubmit: () => void;
  websites: any[];
  selectedWebsites: any[];
  onWebsiteSelect: (value: any) => void;
}) => {
  return (
    <div className="outlined-container flex w-full flex-col gap-4 p-6">
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* TCG Select */}
        <Select value={tcg} onValueChange={(value: Tcgs) => setTcg(value)}>
          <SelectTrigger className="w-[180px]">
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
      </div>

      {/* Textarea */}
      <Textarea
        rows={8}
        placeholder="Enter card names (one per line)"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <Button onClick={handleSubmit} disabled={searchInput.length === 0}>
        Submit
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
