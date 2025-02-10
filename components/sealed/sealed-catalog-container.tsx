import { useSingleSearchStore } from '@/stores/useSingleSearchStore';
import BackToTopButton from '../ui/back-to-top-btn';
import SealedCatalogItem from './sealed-catalog-item';
import FilterSection from '@/components/search-ui/search-filter-container';
import useAuthStore from '@/stores/authStore';
import useGlobalStore from '@/stores/globalStore';
import AdComponent from '../ad';
import type { Ad, AdWeight } from '@/types/ads';
import React, { useState, useEffect } from 'react';
import { AdSelector } from '@/utils/adSelector';
import { FilterOption, singleSortByLabel } from '@/types/query';
import SearchPagination from '../search-ui/search-pagination';
import SearchSortBy from '../search-ui/search-sort-by';
import { ProductCategory, SealedProduct } from '@/types';
import SearchBar from './search-bar';

interface SealedCatalogContainerProps {
  productCategory: ProductCategory;
  searchTerm: string;
  setProductCategory: (productCategory: ProductCategory) => void;
  setSearchTerm: (searchTerm: string) => void;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearch: () => void;
  clearFilters: () => void;
  searchResults?: SealedProduct[];
  promotedResults?: SealedProduct[];
  filterOptions?: FilterOption[];
  numPages?: number;
  numResults?: number;
  currentPage: number;
  isLoading: boolean;
}
export default function SealedCatalogContainer({

  searchResults,
  promotedResults,
  filterOptions,
  numPages,
  numResults,
  currentPage,
  isLoading,
  productCategory,
  searchTerm,
  setProductCategory,
  setSearchTerm,
  handleInputChange,
  handleSearch,
  clearFilters
}: SealedCatalogContainerProps) {
  const {
    loadingCardResults,
    loadingFilterResults,
    filters,
    sortBy,
    fetchCards,
    setCurrentPage,
    setSortBy,
    setFilter,
    applyFilters
  } = useSingleSearchStore();

  console.log(searchResults);
  const { hasActiveSubscription } = useAuthStore();
  const { getFeedAds } = useGlobalStore();

  const [ads, setAds] = useState<Ad[]>([]);
  const [initialAd, setInitialAd] = useState<Ad | null>(null);

  // Note these store_ids come from the ads database
  const storeWeights: AdWeight[] = [
    { store_id: 2, weight: 1 }, // obsidian
    { store_id: 5, weight: 1 }, // exorgames
    { store_id: 4, weight: 1 }, // chimera
    { store_id: 3, weight: 1 }, // levelup
    { store_id: 8, weight: 1 }, // houseofcards
    { store_id: 9, weight: 1 } // mythicstore
  ];

  useEffect(() => {
    if (!hasActiveSubscription && searchResults) {
      const ads = getFeedAds();
      if (ads?.length) {
        const selector = new AdSelector(ads, storeWeights);
        setInitialAd(selector.getNextAd());

        const adCount = Math.floor(searchResults.length / 11);
        const selectedAds = [];
        for (let i = 0; i < adCount; i++) {
          selectedAds.push(selector.getNextAd());
        }
        setAds(selectedAds);
      }
    }
  }, [searchResults, hasActiveSubscription]);

  return (
    <div className="mb-8 min-h-svh gap-1">
      {/* #1 Single Search Filter Section */}
      <div className="flex flex-col gap-1 ">
        <div className="grid h-full gap-1">
          {loadingFilterResults && (
            <div className="h-full w-full animate-pulse rounded-lg bg-accent"></div>
          )}
        </div>
      </div>

      {/* #2 Single Search Loading Results Skeleton */}
      {isLoading && (
        <div className="grid h-min gap-1">
          <div className="h-10 w-full animate-pulse rounded-lg bg-accent"></div>
          <div className="grid h-min gap-1">
            {/* Skeleton for Results Grid */}
            <div className="grid gap-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="h-96 w-full animate-pulse rounded-lg bg-accent"
                ></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!isLoading && searchResults && numResults && numPages && (
        <div className="grid h-min gap-1">
          {/* #2.1 Single Search Top Bar Section (# Results, Pagination, Sort By) */}
          <div className="z-30 hidden bg-background pt-1 md:sticky md:top-[114px] md:block">
            <SearchBar
              productCategory={productCategory}
              searchTerm={searchTerm}
              setProductCategory={setProductCategory}
              setSearchTerm={setSearchTerm}
              handleInputChange={handleInputChange}
              handleSearch={handleSearch}
              clearFilters={clearFilters}
              isLoading={isLoading}
            />
            <div className="  flex flex-row items-center justify-between rounded-lg bg-popover px-4 py-2 ">
              <span className="text-center text-sm font-normal text-secondary-foreground ">
                {numResults} results
              </span>
              <div>
                <SearchPagination
                  currentPage={currentPage}
                  numPages={numPages}
                  fetchCards={fetchCards}
                  setCurrentPage={setCurrentPage}
                />
              </div>
              <SearchSortBy
                sortBy={sortBy}
                sortByLabel={singleSortByLabel}
                setSortBy={setSortBy}
                fetchCards={fetchCards}
                setCurrentPage={setCurrentPage}
              />
            </div>
            <div className="bg-background pb-1"></div>
          </div>

          {/* #3 Single Search Result Cards Section*/}
          {searchResults && (
            <div className="grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-4 xxl:grid-cols-5">
              {!hasActiveSubscription && initialAd && (
                <AdComponent ad={initialAd} key={`initial-${initialAd.id}`} />
              )}
              {promotedResults &&
                !hasActiveSubscription &&
                promotedResults.map((item, index) => {
                  return <SealedCatalogItem product={item} key={index} />;
                })}

              {searchResults.map((item, index) => (
                <React.Fragment key={index}>
                  <SealedCatalogItem product={item} />
                  {!hasActiveSubscription &&
                    (index + 1) % 10 === 0 &&
                    ads[Math.floor(index / 10)] && (
                      <AdComponent
                        ad={ads[Math.floor(index / 10)]}
                        key={`feed-${ads[Math.floor(index / 10)].id}`}
                      />
                    )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      )}
      <BackToTopButton />
    </div>
  );
}
