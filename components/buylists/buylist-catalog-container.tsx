import React, { useState, useEffect, useRef } from 'react';

import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosWrapper';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import FilterSection from '../search-ui/search-filter-container';
import BuylistFilterSection from './buylist-filter-section';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger
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
  MinusIcon,
  ExclamationTriangleIcon
} from '@radix-ui/react-icons';
import CardImage from '../ui/card-image';
import { Card } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { useBuylistSearch } from '@/hooks/queries/useBuylistSearch';
import useBuyListStore, { IBuylistCart } from '@/stores/useBuylistStore';
import BuylistLeftSideBodyFactory from './buylist-left-side-body';
import { toast } from 'sonner';
import { useCartItems } from '@/hooks/useCartItems';
import { ArrowLeftIcon, ExternalLink } from 'lucide-react';
import { useConnectedVendors } from '@/hooks/useConnectedVendors';
import useGlobalStore from '@/stores/globalStore';
import { useTheme } from 'next-themes';
import { Separator } from '../ui/separator';
export default function BuylistCatalog() {
  const {
    searchTerm,
    tcg,
    filterOptions,
    filters,
    setFilter,
    defaultSortBy,
    reviewData,
    sortBy,
    setSortBy,
    sortByOptions,
    clearFilters,
    setLeftUIState,
    leftUIState,
    setCurrentCartId
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

  // refetch search results when filters or sortBy changes
  useEffect(() => {
    refetch();
  }, [sortBy, filters]);
  // Intersection Observer for infinite scroll
  const loadMoreRef = useRef<HTMLDivElement>(null);
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

  return (
    <div className="flex flex-col gap-1">
      {/* Header */}
      <div className="mx-auto flex w-full items-center justify-between rounded-lg border bg-card px-2 py-0.5 ">
        <div className="flex w-24 items-center justify-start gap-1">
          {leftUIState === 'leftCartListSelection' ||
          leftUIState === 'leftCartEditWithViewOffers' ? (
            <Sheet>
              <SheetTitle hidden>Filters</SheetTitle>
              <SheetDescription hidden>
                Filter your search results
              </SheetDescription>
              <SheetTrigger asChild className="hidden md:block">
                <MixerHorizontalIcon className="h-6 w-6 cursor-pointer" />
              </SheetTrigger>
              <SheetContent side="left">
                <FilterSection
                  filterOptions={filterOptions}
                  // defaultSortBy={defaultSortBy}
                  sortBy={sortBy ? sortBy : data?.defaultSortBy}
                  fetchCards={async () => {
                    refetch();
                  }}
                  clearFilters={clearFilters}
                  setFilter={setFilter}
                  setCurrentPage={() => {}}
                  applyFilters={async () => {}}
                  setSortBy={setSortBy}
                  handleSortByChange={(value: any) => {
                    setSortBy(value);
                  }}
                  sortByOptions={sortByOptions}
                />
              </SheetContent>
            </Sheet>
          ) : leftUIState === 'leftCartEdit' ? (
            <span
              className="flex cursor-pointer gap-0.5 rounded-lg bg-background px-1 py-1 font-medium hover:bg-background/50"
              onClick={() => {
                setLeftUIState('leftCartListSelection');
              }}
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <p className="text-xs">Back</p>
            </span>
          ) : (
            <span
              className="flex cursor-pointer gap-0.5 rounded-lg bg-background px-1 py-1 font-medium hover:bg-background/50"
              onClick={() => {
                setLeftUIState('leftCartEdit');
              }}
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <p className="text-xs">Back</p>
            </span>
          )}
        </div>
        <div className="space-y-1">
          <div>
            {leftUIState === 'leftCartListSelection' ||
              (leftUIState === 'leftCartEditWithViewOffers' && (
                <p className="text-sm">{data?.numResults} Search Results</p>
              ))}
            {leftUIState === 'leftCartEdit' && (
              <p className="text-sm">{reviewData?.length} Store Offers</p>
            )}
            {leftUIState === 'leftSubmitOffer' && (
              <p className="text-sm">Submit Offer</p>
            )}
          </div>
          <div className="mx-auto flex w-min gap-2">
            <div
              className={`h-[0.6rem] w-[0.6rem] rounded-full bg-primary`}
            ></div>
            <div
              className={`h-[0.6rem] w-[0.6rem] rounded-full ${
                leftUIState === 'leftCartEdit' ||
                leftUIState === 'leftSubmitOffer'
                  ? 'bg-primary'
                  : 'bg-background'
              }`}
            ></div>
            <div
              className={`h-[0.6rem] w-[0.6rem] rounded-full ${
                leftUIState === 'leftSubmitOffer'
                  ? 'bg-primary'
                  : 'bg-background'
              }`}
            ></div>
          </div>
        </div>
        <div className="flex w-24 items-center justify-end gap-1">
          <p className="text-sm">FAQ</p>
          <QuestionMarkCircledIcon className="h-5 w-5" />
        </div>
      </div>
      {/* Body */}
      <div className=" flex gap-1">
        {/* Left Sidebar */}
        <div className="">
          <BuylistLeftSideBodyFactory leftUIState={leftUIState} />
        </div>

        {/* Content */}
        <div className="h-[75vh] w-full overflow-hidden rounded-lg">
          <ScrollArea className="h-full" type="always">
            {(leftUIState === 'leftCartListSelection' ||
              leftUIState === 'leftCartEditWithViewOffers') && (
              <>
                <div className="grid grid-cols-2 gap-1 pr-2.5 sm:grid-cols-3 md:grid-cols-4">
                  {data?.searchResults?.map((card, index) => (
                    <div className="" key={index}>
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
              </>
            )}
            {leftUIState === 'leftCartEdit' && <BuylistStoreOffers />}
            {leftUIState === 'leftSubmitOffer' && (
              <div className="col-span-1 flex h-[75vh] flex-col  space-y-1 rounded-lg border bg-card px-1 py-1">
                <div className="text flex w-full items-center justify-center gap-2 whitespace-nowrap font-semibold">
                  <Separator className="my-4 w-full" />
                  <p className="shrink-0 text-muted-foreground">Purchasing</p>
                  <Separator className="my-4 w-full" />
                </div>

                <div className="text flex w-full items-center justify-center gap-2 whitespace-nowrap font-semibold">
                  <Separator className="my-4 w-full" />
                  <p className="shrink-0 text-muted-foreground">
                    Not Purchasing
                  </p>
                  <Separator className="my-4 w-full" />
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

type BuylistCatalogItemProps = {
  cardData: any;
};

const BuylistCatalogItem = ({ cardData }: BuylistCatalogItemProps) => {
  const { currentCartId } = useBuyListStore();
  const { cartItems, updateCartItem } = useCartItems(
    currentCartId || undefined
  );
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const conditions = [
    'Near Mint',
    'Lightly Played',
    'Moderately Played',
    'Heavily Played',
    'Damaged'
  ];
  const getQuantityForCondition = (conditionName: string) => {
    if (!cartItems) return 0;
    return (
      cartItems.find(
        (item) =>
          item.card_name === cardData.name &&
          item.set_name === cardData.set &&
          item.condition_name === conditionName &&
          item.foil === cardData.foil &&
          item.rarity === cardData.rarity
      )?.quantity || 0
    );
  };

  const handleUpdateQuantity = (conditionName: string, delta: number) => {
    if (!currentCartId) return;

    const currentQuantity = getQuantityForCondition(conditionName);
    const newQuantity = currentQuantity + delta;
    if (newQuantity > 99) {
      toast.error('Max Quantity 99');
      return;
    }
    const cartItem = {
      base_card_id: cardData.baseCardId,
      card_name: cardData.name,
      set_name: cardData.set,
      game: cardData.game,
      rarity: cardData.rarity,
      condition_name: conditionName,
      foil: cardData.foil,
      image: cardData.image
    };

    updateCartItem({
      cartId: currentCartId,
      item: cartItem,
      quantity: newQuantity
    });
  };
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

              <div className="flex flex-wrap items-center gap-1 text-[0.70rem] font-medium capitalize text-primary">
                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[0.7rem]">
                  <p> {cardData.foil}</p>
                </span>
                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[0.7rem]">
                  <p> {cardData.rarity}</p>
                </span>
              </div>
            </div>
          </div>

          <Dialog>
            <DialogTitle hidden>Add To Cart</DialogTitle>
            <DialogDescription hidden>
              Add this card to your cart
            </DialogDescription>
            {Object.keys(cardData.conditions) && (
              <DialogTrigger asChild>
                <Button
                  className="border-input-none w-full rounded-b-lg font-montserrat text-xs font-semibold"
                  variant="outline"
                  onClick={(e) => {
                    // If no cart is selected, prevent dialog from opening and show create cart dialog
                    if (!currentCartId) {
                      e.preventDefault();
                      toast.error('No list selected');
                      // setCreateDialogOpen(true);
                      return;
                    }
                  }}
                >
                  Add To Cart
                </Button>
              </DialogTrigger>
            )}

            <DialogContent className="w-min px-16">
              <div className="mx-auto w-[250px] px-4">
                <CardImage imageUrl={cardData.image} alt={cardData.name} />
              </div>

              <div className="mt-2">
                <div className="text-primary-light font-montserrat text-[0.65rem] font-semibold uppercase">
                  {cardData.set}
                </div>
                <h3 className="text-[0.9rem] font-semibold capitalize">
                  {cardData.name}
                </h3>
                <div className="flex flex-wrap items-center gap-1 text-xs font-medium text-primary">
                  <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[0.9rem] capitalize">
                    <p> {cardData.rarity}</p>
                  </span>
                  <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[0.9rem]">
                    <p> {cardData.foil}</p>
                  </span>
                </div>

                {conditions.map((conditionName) => {
                  const isAvailable = Object.keys(cardData.conditions).includes(
                    conditionName
                  );
                  const quantity = getQuantityForCondition(conditionName);

                  return (
                    <div key={conditionName} className="mt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {!isAvailable && (
                            <TooltipProvider>
                              <Tooltip delayDuration={100}>
                                <TooltipTrigger asChild className="cursor-help">
                                  <ExclamationTriangleIcon className="size-4 text-red-500" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>No stores are purchasing this card</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          <p className="text-base font-medium">
                            {conditionName}
                          </p>
                        </div>
                        <div className="flex h-8 items-center rounded-xl border">
                          <Button
                            className="flex h-full w-8 items-center justify-center rounded-l-xl hover:bg-accent"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleUpdateQuantity(conditionName, -1)
                            }
                            disabled={quantity === 0}
                          >
                            <MinusIcon className="h-4 w-4" />
                          </Button>
                          <p className="w-8 bg-background text-center font-semibold">
                            {quantity}
                          </p>
                          <Button
                            className="flex h-full w-8 items-center justify-center rounded-r-xl hover:bg-accent"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleUpdateQuantity(conditionName, 1)
                            }
                          >
                            <PlusIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    </>
  );
};

const BuylistStoreOffers = () => {
  const CART_KEY = (cartId: number) => ['cart', cartId] as const;
  const {
    reviewData,
    setSelectedStoreForReview,
    currentCartId,
    setAllCartsData,
    setLeftUIState
  } = useBuyListStore();
  const { getWebsiteName, websites } = useGlobalStore();
  const { theme } = useTheme();
  const { data: connectedVendors, isLoading: isLoadingConnections } =
    useConnectedVendors();

  // Fetch current cart data
  const { data: currentCart } = useQuery<{
    success: boolean;
    cart: IBuylistCart;
  } | null>({
    queryKey: CART_KEY(currentCartId || 0),
    queryFn: async () => {
      if (!currentCartId) return null;
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_BUYLISTS_URL}/v2/carts/${currentCartId}`
      );
      return response.data;
    },
    enabled: !!currentCartId
  });

  const isVendorConnected = (vendorSlug: string) => {
    if (isLoadingConnections || !connectedVendors) return false;
    const matchingWebsite = websites.find(
      (website) => website.slug === vendorSlug
    );
    return matchingWebsite
      ? connectedVendors.includes(matchingWebsite.id)
      : false;
  };

  const cartItems = currentCart?.cart?.items || [];
  const breakdownData = reviewData || [];

  useEffect(() => {
    setAllCartsData(currentCartId);
  }, []);

  return (
    <div className=" mr-2.5 grid grid-cols-2 gap-1 rounded-lg ">
      {breakdownData.map((storeData: any, index: number) => {
        const isConnected = isVendorConnected(storeData.storeName);
        console.log(storeData.storeName, isConnected);
        return (
          <div
            className="col-span-1 space-y-2 rounded-lg border bg-card px-1 py-1 "
            key={index}
          >
            <div className="flex items-end gap-1">
              <div>
                {(() => {
                  const matchingWebsite = websites.find(
                    (website) => storeData.storeName === website.slug
                  );
                  return matchingWebsite?.meta?.branding?.icons ? (
                    <img
                      src={
                        theme === 'dark'
                          ? matchingWebsite.meta.branding.icons.dark
                          : matchingWebsite.meta.branding.icons.light
                      }
                      alt="Website"
                      className="size-8"
                    />
                  ) : null;
                })()}
              </div>
              <div className="leading-none">
                <p>{getWebsiteName(storeData.storeName)}</p>

                {isConnected ? (
                  <div className="flex items-center gap-1">
                    <div
                      className={`h-[0.6rem] w-[0.6rem] rounded-full bg-green-500`}
                    ></div>
                    <p className="text-sm leading-none text-muted-foreground">
                      Connected
                    </p>
                  </div>
                ) : (
                  <div className=" flex items-center gap-1 text-muted-foreground hover:cursor-pointer hover:text-primary">
                    <div
                      className={`h-[0.6rem] w-[0.6rem] rounded-full bg-red-500`}
                    ></div>
                    <p className="text-sm leading-none">Extension Required</p>
                    <ExternalLink className="size-4  " />
                  </div>
                )}
              </div>
            </div>
            <div className="leading-none">
              <p>Summary</p>
            </div>
            <div className="storeData.items.length space-y-1 text-sm font-normal leading-none">
              <div className="flex justify-between">
                <p>Cash</p>
                <p>${storeData.cashSubtotal}</p>
              </div>
              <div className="flex justify-between">
                <p>Credit</p>
                <p>${storeData.creditSubtotal}</p>
              </div>{' '}
              <div className="flex justify-between">
                <p>Buying</p>
                <p>
                  {storeData.items.length}/
                  {storeData.items.length +
                    storeData.unableToPurchaseItems.length}
                </p>
              </div>
            </div>
            <div>
              <Button
                className="h-9 w-full"
                disabled={!isConnected}
                onClick={() => {
                  setLeftUIState('leftSubmitOffer');
                }}
              >
                Submit Offer
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
