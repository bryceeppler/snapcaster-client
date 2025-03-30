import React, { useState, useEffect, useRef } from 'react';

import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosWrapper';

import FilterSection from '../search-ui/search-filter-container';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription
} from '../ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetTrigger
} from '@/components/ui/sheet';
import { Button } from '../ui/button';
import {
  MixerHorizontalIcon,
  QuestionMarkCircledIcon,
  PlusIcon,
  MinusIcon
} from '@radix-ui/react-icons';
import CardImage from '../ui/card-image';
import { Card } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { useBuylistSearch } from '@/hooks/queries/useBuylistSearch';
import useBuyListStore from '@/stores/useBuylistStore';

export default function BuylistCatalog() {
  const {
    tcg,
    searchTerm,
    setSearchTerm,
    filters,
    sortBy,
    filterOptions,
    setFilter,
    setCurrentPage
    // setProductCategory,
    // clearFilters
  } = useBuyListStore();
  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch
  } = useBuylistSearch(
    {
      tcg,
      searchTerm,
      filters: filters || [],
      sortBy
    },
    { enabled: false }
  );

  useEffect(() => {
    refetch();
  }, [filters]);

  const loadMoreRef = useRef<HTMLDivElement>(null);
  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSortChange = async (newSortBy: any) => {
    // setStoreSortBy(newSortBy);
    await refetch();
  };

  return (
    <div className="flex flex-col gap-1">
      {/* Header */}
      <div className="mx-auto flex w-full items-center justify-between rounded-lg border bg-card px-2 py-0.5 ">
        <div className="flex w-24 items-center justify-start gap-1">
          <Sheet>
            <SheetTitle hidden>Filters</SheetTitle>
            <SheetDescription hidden>
              Filter your search results
            </SheetDescription>
            <SheetTrigger asChild className="hidden md:block">
              <MixerHorizontalIcon className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="left">
              <FilterSection
                filterOptions={filterOptions}
                sortBy={'name-asc'}
                fetchCards={async () => {
                  refetch();
                }}
                clearFilters={() => {}}
                setFilter={setFilter}
                // setFilter={() => {}}
                setCurrentPage={setCurrentPage}
                applyFilters={async () => {
                  // console.log('applyFilters in buylist-catalog-container');
                  // console.log('filters in buylist-catalog-container', filters);
                  // refetch();
                }}
                setSortBy={() => {}}
                sortByOptions={{
                  'name-asc': 'Name (A-Z)',
                  'name-desc': 'Name (Z-A)'
                }}
              />
            </SheetContent>
          </Sheet>
        </div>
        <div className="space-y-1">
          <div>
            <p className="text-sm">{data?.numResults} Search Results</p>
          </div>
          <div className="mx-auto flex w-min gap-2">
            <div className="h-[0.6rem] w-[0.6rem] rounded-full bg-primary"></div>
            <div className="h-[0.6rem] w-[0.6rem] rounded-full bg-background"></div>
            <div className="h-[0.6rem] w-[0.6rem] rounded-full bg-background"></div>
          </div>
        </div>
        <div
          className="flex w-24 items-center justify-end gap-1"
          onClick={() => {
            // console.log('FAQ button clicked');
            refetch();
          }}
        >
          <p className="text-sm">FAQ</p>
          <QuestionMarkCircledIcon className="h-5 w-5" />
        </div>
      </div>
      {/* Body */}
      <div className="flex gap-1">
        {/* Left Sidebar */}
        <div className="col-span-1 flex h-[75vh] w-[480px] flex-col space-y-1 rounded-lg border bg-card">
          <div className="flex justify-between border-b px-1">
            <div className="flex h-10 w-12 items-center justify-start gap-1">
              <p className="text-xs underline">My Lists</p>
            </div>
            <div className="flex items-center gap-1">
              <p className="text-sm">Cart 1</p>
            </div>
            <div className="flex w-12 items-center justify-end gap-1 ">
              {/* <PlusIcon className="h-6 w-6" /> */}
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full" type="always">
              <div className="mr-1.5 space-y-1 px-1 ">
                <CartItem />
                <CartItem />
                <CartItem />
              </div>
            </ScrollArea>
          </div>
          <div className=" ">
            <Button className="w-full">View Offers</Button>
          </div>
        </div>

        {/* Content */}
        <div className="h-[75vh] w-full overflow-hidden rounded-lg">
          <ScrollArea className="h-full" type="always">
            <div className="grid grid-cols-2 gap-1 pr-2.5 sm:grid-cols-3 md:grid-cols-4">
              {data?.searchResults?.map((card) => (
                <div className="">
                  <BuylistCatalogItem cardData={card} />
                </div>
              ))}
            </div>
            <div ref={loadMoreRef} className="h-10 w-full">
              {(isFetchingNextPage ||
                (isLoading &&
                  Array.isArray(data?.searchResults) &&
                  data?.searchResults.length > 0)) && (
                <div className="flex items-center justify-center py-4">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

const CartItem = () => {
  return (
    <>
      <div className="flex items-center rounded-lg border px-1 py-1 ">
        <div className="">
          <img
            className="w-20 object-contain"
            src="https://cdn.shopify.com/s/files/1/0235/2457/3231/files/70cd7a67-9f40-5227-8c12-5fb1a4750035.png?v=1736540822"
            alt="card_image"
          />
        </div>
        <div className="flex w-full flex-col gap-1 space-y-0.5 px-0.5">
          <p className="text-[0.55rem] text-xs font-semibold uppercase   leading-none text-muted-foreground">
            commander masters sss sss sss sss sssss ssss
          </p>

          <p className="text-[0.70rem] text-xs font-semibold leading-none">
            Counterspell
          </p>

          <div className="flex flex-wrap items-center gap-1 text-xs font-medium text-primary">
            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[0.55rem]">
              <p> Near Mint</p>
            </span>
            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[0.55rem]">
              <p> Foil</p>
            </span>
            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[0.55rem]">
              <p> Foilssssss</p>
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-1">
          <div>
            <PlusIcon className="h-5 w-5 stroke-[3]"></PlusIcon>
          </div>
          <div>
            <p className="text-xs">99</p>
          </div>
          <div>
            <MinusIcon className="h-5 w-5"></MinusIcon>
          </div>
        </div>
      </div>
    </>
  );
};

type BuylistCatalogItemProps = {
  cardData: any;
};

const BuylistCatalogItem = ({ cardData }: BuylistCatalogItemProps) => {
  return (
    <>
      <Card className="h-full">
        <div className="flex h-full flex-col gap-2 rounded-md bg-popover px-1 py-2">
          <div className="mx-auto max-w-[150px] px-4 md:max-w-[250px]">
            <CardImage imageUrl={cardData.image} alt={cardData.name} />
          </div>

          <div className=" flex flex-1 flex-col justify-between">
            <div className="flex w-full flex-col gap-1 space-y-0.5 px-0.5">
              <p className="overflow-hidden text-ellipsis text-[0.7rem] text-xs  font-semibold uppercase leading-none text-muted-foreground ">
                {cardData.set}
              </p>
              <p className="overflow-hidden text-ellipsis text-[0.80rem] font-semibold leading-none ">
                {cardData.name}
              </p>

              <div className="flex flex-wrap items-center gap-1 text-[0.70rem] font-medium text-primary">
                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[0.7rem]">
                  <p> {cardData.foil}</p>
                </span>
                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[0.7rem]">
                  <p> {cardData.rarity}</p>
                </span>
              </div>
            </div>

            {/* <Dialog>
              <DialogTitle hidden>Add To Cart</DialogTitle>
              <DialogDescription hidden>
                Add this card to your cart
              </DialogDescription>

              <DialogContent className="w-min px-16">
                <div className="mx-auto w-[250px] px-4">
                  <CardImage
                    imageUrl="https://cdn.shopify.com/s/files/1/0235/2457/3231/files/70cd7a67-9f40-5227-8c12-5fb1a4750035.png?v=1736540822"
                    alt="Counterspell"
                  />
                </div>

                <div className="mt-2">
                  <p className="text-[0.9rem] font-semibold capitalize">
                    Counterspell
                  </p>
                  <p className="text-primary-light font-montserrat text-[0.65rem] font-semibold uppercase">
                    Modern Masters
                  </p>

                  <div className="flex flex-wrap items-center gap-1 text-xs font-medium text-primary">
                    <span className="rounded bg-primary/10 px-1.5 py-0.5">
                      <p> Foil</p>
                    </span>
                    <span className="rounded bg-primary/10 px-1.5 py-0.5">
                      <p> Foilssssss</p>
                    </span>
                    <span className="rounded bg-primary/10 px-1.5 py-0.5">
                      <p> Foilssssss</p>
                    </span>
                  </div>
                </div>
              </DialogContent>
            </Dialog> */}
          </div>
          <Button
            className="h-8 w-full  font-montserrat font-semibold "
            variant="outline"
          >
            <p className="text-[0.65rem]">Add To Cart</p>
          </Button>
        </div>
      </Card>
    </>
  );
};
