import React, { useEffect } from 'react';
import Head from 'next/head';
import { useStore } from '@/stores/store';
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
type Props = {};

export default function Multisearch({}: Props) {
  const {
    mode,
    selectedWebsites,
    tcg,
    searchInput,
    searchQuery,
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
        {mode === 'search' && (
          <div className="container w-full flex-1 flex-col items-center justify-center text-center">
            <PageTitle title="Multi Search" />
            <div className="outlined-container flex w-full flex-col gap-4 p-6">
              <div className="flex flex-col gap-4 sm:flex-row">
                {/* TCG Select */}
                <Select
                  value={tcg}
                  onValueChange={(value: Tcgs) => setTcg(value)}
                >
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
              <Button>Submit</Button>
            </div>
          </div>
        )}
      </MainLayout>
    </>
  );
}

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
