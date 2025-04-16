import React from 'react';
import Head from 'next/head';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { createCheckoutSession } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { RecommendedStores } from '@/components/multi-search/recommended-stores';
import useMultiSearchStore from '@/stores/multiSearchStore';
import { Condition, Product, Tcg } from '@/types';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Toolbar } from '@/components/multi-search/toolbar';
import BackToTopButton from '@/components/ui/back-to-top-btn';
import { ResultsContainer } from '@/components/multi-search/results-container';
import { FREE_MULTISEARCH_CARD_LIMIT } from '@/lib/constants';
import { trackSearch } from '@/utils/analytics';
import { Vendor } from '@/services/vendorService';
import { useVendors } from '@/hooks/queries/useVendors';

type Props = {};

export default function Multisearch({}: Props) {
  const {
    mode,
    selectedWebsites,
    tcg,
    searchInput,
    results,
    minimumAcceptableCondition,
    setMinimumAcceptableCondition,
    handleSubmit,
    setSearchInput,
    onWebsiteSelect,
    setTcg
  } = useMultiSearchStore();
  const { vendors } = useVendors();

  return (
    <>
      <MultisearchHead />
      <div className="flex w-full flex-col justify-center gap-8 text-center">
        {mode === 'search' && (
          <>
            <SearchView
              tcg={tcg}
              setTcg={setTcg}
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              handleSubmit={handleSubmit}
              vendors={vendors}
              selectedWebsites={selectedWebsites}
              onWebsiteSelect={onWebsiteSelect}
              minimumAcceptableCondition={minimumAcceptableCondition}
              setMinimumAcceptableCondition={setMinimumAcceptableCondition}
            />
          </>
        )}
        {mode === 'results' && (
          <>
            <div className="flex w-full flex-col gap-4 md:flex-row">
              <ResultsView results={results} />
            </div>
          </>
        )}
      </div>
      <BackToTopButton />
    </>
  );
}

const ResultsView = ({ results }: { results: Product[][] }) => {
  return (
    <div className="mb-8 w-full grid-cols-12 gap-4 space-y-2 lg:grid lg:space-y-0">
      <div className="col-span-12 flex flex-col gap-4">
        <Toolbar />
        <RecommendedStores />
        <ResultsContainer results={results} />
      </div>
    </div>
  );
};

const SearchView = ({
  tcg,
  setTcg,
  searchInput,
  setSearchInput,
  handleSubmit,
  minimumAcceptableCondition,
  setMinimumAcceptableCondition
}: {
  tcg: Tcg;
  setTcg: (value: Tcg) => void;
  searchInput: string;
  setSearchInput: (value: string) => void;
  handleSubmit: (tcg: string, minimumAcceptableCondition: Condition) => void;
  vendors: Vendor[];
  selectedWebsites: any[];
  onWebsiteSelect: (value: any) => void;
  minimumAcceptableCondition: Condition;
  setMinimumAcceptableCondition: (value: Condition) => void;
}) => {
  const { loading } = useMultiSearchStore();
  const { hasActiveSubscription, isAuthenticated } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (!hasActiveSubscription) {
      const lines = value.split('\n');
      if (lines.length > FREE_MULTISEARCH_CARD_LIMIT) {
        return;
      }
    }
    setSearchInput(value);
  };
  return (
    <div className="flex w-full flex-col gap-4 rounded-lg  bg-popover p-4">
      <div className="flex flex-col items-center gap-4 md:flex-row">
        <div className="flex flex-col gap-2">
          <label htmlFor="tcg-select" className="text-left text-sm">
            TCG
          </label>
          <Select value={tcg} onValueChange={(value: Tcg) => setTcg(value)}>
            <SelectTrigger id="tcg-select" className="w-[200px]">
              <SelectValue placeholder="MTG" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select TCG</SelectLabel>
                <SelectItem value="mtg">MTG</SelectItem>
                <SelectItem value="onepiece">One Piece</SelectItem>
                <SelectItem value="pokemon">Pokemon</SelectItem>
                <SelectItem value="lorcana">Lorcana</SelectItem>
                <SelectItem value="yugioh">Yu-gi-oh</SelectItem>
                <SelectItem value="starwars">Star Wars</SelectItem>
                <SelectItem value="fleshandblood">Flesh and Blood</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="condition-select" className="text-left text-sm">
            Minimum Condition
          </label>
          <Select
            value={minimumAcceptableCondition}
            onValueChange={(value: Condition) =>
              setMinimumAcceptableCondition(value)
            }
          >
            <SelectTrigger id="condition-select" className="w-[200px]">
              <SelectValue placeholder="MP" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nm">NM</SelectItem>
              <SelectItem value="lp">LP</SelectItem>
              <SelectItem value="mp">MP</SelectItem>
              <SelectItem value="hp">HP</SelectItem>
              <SelectItem value="dmg">DMG</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className=" flex-grow "></div>
        {/* {adsEnabled && <PoweredBy size="small" />} */}
      </div>

      {/* Textarea */}
      <div className="mx-auto mt-4 w-20">
        <svg
          className="h-auto w-full"
          viewBox="0 0 374 202"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="3.19031"
            y="42.1871"
            width="117"
            height="166"
            rx="5.5"
            transform="rotate(-19.4696 3.19031 42.1871)"
            className="fill-accent stroke-border"
            strokeWidth="5"
          />
          <rect
            x="-2.5"
            y="2.5"
            width="117"
            height="166"
            rx="5.5"
            transform="matrix(-1 8.74228e-08 8.74228e-08 1 243 2.18557e-07)"
            className="fill-accent stroke-border"
            strokeWidth="5"
          />
          <rect
            x="-3.19031"
            y="1.52378"
            width="117"
            height="166"
            rx="5.5"
            transform="matrix(-0.942819 -0.333306 -0.333306 0.942819 367.329 39.6871)"
            className="fill-accent stroke-border"
            strokeWidth="5"
          />
        </svg>
      </div>

      <div className="mx-auto max-w-xs text-center text-sm text-muted-foreground">
        Search up to 100 cards at once. Paste your decklist in below!
      </div>
      {!hasActiveSubscription && (
        <div>
          ✨{' '}
          <span
            className="text-primary underline hover:cursor-pointer hover:text-primary/80"
            onClick={() => {
              isAuthenticated
                ? createCheckoutSession()
                : (window.location.href = '/signin');
            }}
          >
            Upgrade to Snapcaster Pro
          </span>{' '}
          to search 100 cards at a time.
        </div>
      )}
      <Textarea
        rows={10}
        className="text-[16px]"
        placeholder={`Enter card names (one per line). Max ${
          hasActiveSubscription ? 100 : FREE_MULTISEARCH_CARD_LIMIT
        } cards.${
          !hasActiveSubscription
            ? ' \nUpgrade to Pro to search up to 100 cards.'
            : ''
        }`}
        value={searchInput}
        onChange={handleInputChange}
      ></Textarea>
      <Button
        onClick={() => {
          trackSearch(searchInput, tcg, 'multi');
          handleSubmit(tcg, minimumAcceptableCondition);
        }}
        disabled={
          searchInput.length === 0 ||
          loading ||
          (!hasActiveSubscription &&
            searchInput.split('\n').length > FREE_MULTISEARCH_CARD_LIMIT) ||
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
