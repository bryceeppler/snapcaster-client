//hooks and store states
import useBuyListStore, { IBuylistCart } from '@/stores/useBuylistStore';
//components
import FilterSection from '@/components/search-ui/search-filter-container';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
//icons
import {
  ArrowLeftIcon,
  MixerHorizontalIcon,
  QuestionMarkCircledIcon
} from '@radix-ui/react-icons';
import { ListSelectionHeader } from '../saved-lists/saved-lists';
import { ShoppingCart } from 'lucide-react';
import { LeftCartEditWithViewOffers } from '../modify-list-items/modify-list-items';
import { useState } from 'react';
import axiosInstance from '@/utils/axiosWrapper';
import { useQuery } from '@tanstack/react-query';

export const BuylistHeader = () => {
  const {
    filterOptions,
    setFilter,
    reviewData,
    defaultSortBy,
    sortBy,
    setSortBy,
    sortByOptions,
    clearFilters,
    setLeftUIState,
    leftUIState,
    searchResultCount,
    currentCart,
    setCurrentCartId,
    setCurrentCart
  } = useBuyListStore();

  return (
    <div>
      {/* MOBILE HEADER FOR LIST SELECTION */}
      {leftUIState === 'leftCartListSelection' && (
        <div className="block md:hidden">
          <ListSelectionHeader />
        </div>
      )}
      <div
        className={`mx-auto flex h-8 w-full items-center justify-between bg-card px-1 py-0.5 md:rounded-lg md:border ${
          leftUIState === 'leftCartListSelection' ? 'hidden md:flex' : ''
        }`}
      >
        {/* LEFT SECTION */}
        <div className="flex w-24 items-center justify-start gap-1">
          {/* step 2 */}

          {leftUIState === 'leftCartListSelection' && (
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
                  sortBy={sortBy ? sortBy : defaultSortBy}
                  fetchCards={async () => {}}
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
          )}
          {/* step 3 */}
          {leftUIState === 'leftCartEditWithViewOffers' && (
            <Sheet>
              <SheetTitle hidden>Filters</SheetTitle>
              <SheetDescription hidden>
                Filter your search results
              </SheetDescription>
              <SheetTrigger asChild className=" ">
                <MixerHorizontalIcon className="h-6 w-6 cursor-pointer" />
              </SheetTrigger>
              <SheetContent side="left">
                <FilterSection
                  filterOptions={filterOptions}
                  sortBy={sortBy ? sortBy : defaultSortBy}
                  fetchCards={async () => {}}
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
          )}

          {/* step 4 view offers*/}
          {leftUIState === 'leftCartEdit' && (
            <span
              className="flex cursor-pointer gap-0.5 rounded-lg bg-background px-1 py-1 font-medium hover:bg-background/50"
              onClick={() => {
                setLeftUIState('leftCartEditWithViewOffers');
              }}
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <p className="text-xs">Back</p>
            </span>
          )}

          {leftUIState === 'leftSubmitOffer' && (
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

        {/* MIDDLE SECTION */}
        <div className="my-0.25">
          <div className="max-w-full overflow-hidden">
            {(leftUIState === 'leftCartListSelection' ||
              leftUIState === 'leftCartEditWithViewOffers') && (
              <p className="truncate text-sm">{searchResultCount} Results</p>
            )}
            {leftUIState === 'leftCartEdit' && (
              <p className="truncate text-sm">
                {reviewData?.length} Store Offers
              </p>
            )}
            {leftUIState === 'leftSubmitOffer' && (
              <p className="truncate text-sm">Submit Offer</p>
            )}
          </div>
        </div>
        {/* RIGHT SECTION */}
        <div className="flex w-24 items-center justify-end gap-1">
          <a href="/faq#buylists" target="_blank">
            <span className="flex cursor-pointer items-center gap-1">
              <p className="text-sm">FAQ</p>
              <QuestionMarkCircledIcon className="h-5 w-5" />
            </span>
          </a>
        </div>
      </div>

      {/* step 5 */}
      <SelectedCartHeader />
    </div>
  );
};

export const SearchResultsHeader = () => {
  const {
    filterOptions,
    setFilter,
    reviewData,
    defaultSortBy,
    sortBy,
    setSortBy,
    sortByOptions,
    clearFilters,
    setLeftUIState,
    leftUIState,
    searchResultCount,
    currentCart,
    setCurrentCartId,
    setCurrentCart
  } = useBuyListStore();
  return (
    <div>
      <div className="mx-auto flex w-full items-center justify-between bg-card px-1 py-0.5 md:rounded-lg md:border ">
        <div className="flex w-24 items-center justify-start gap-1">
          <Sheet>
            <SheetTitle hidden>Filters</SheetTitle>
            <SheetDescription hidden>
              Filter your search results
            </SheetDescription>
            <SheetTrigger asChild className="">
              <MixerHorizontalIcon className="h-6 w-6 cursor-pointer" />
            </SheetTrigger>
            <SheetContent side="left">
              <FilterSection
                filterOptions={filterOptions}
                sortBy={sortBy ? sortBy : defaultSortBy}
                fetchCards={async () => {}}
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

          {leftUIState === 'leftCartEdit' && (
            <span
              className="flex cursor-pointer gap-0.5 rounded-lg bg-background px-1 py-1 font-medium hover:bg-background/50"
              onClick={() => {
                setLeftUIState('leftCartEditWithViewOffers');
              }}
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <p className="text-xs">Back</p>
            </span>
          )}
        </div>
        <div className="my-0.25">
          <div className="max-w-full overflow-hidden">
            {(leftUIState === 'leftCartListSelection' ||
              leftUIState === 'leftCartEditWithViewOffers') && (
              <p className="truncate text-sm">{searchResultCount} Results</p>
            )}
          </div>
          <div className="mx-auto my-1 flex w-min items-center gap-2">
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
          <a href="/faq#buylists" target="_blank">
            <span className="flex cursor-pointer items-center gap-1">
              <p className="text-sm">FAQ</p>
              <QuestionMarkCircledIcon className="h-5 w-5" />
            </span>
          </a>
        </div>
      </div>

      <SelectedCartHeader />
    </div>
  );
};

export const CartHeader = () => {
  const {
    filterOptions,
    setFilter,
    reviewData,
    defaultSortBy,
    sortBy,
    setSortBy,
    sortByOptions,
    clearFilters,
    setLeftUIState,
    leftUIState,
    searchResultCount,
    currentCart,
    setCurrentCartId,
    setCurrentCart
  } = useBuyListStore();
  return (
    <div>
      <div className="mx-auto flex w-full items-center justify-between bg-card px-1 py-0.5 md:rounded-lg md:border ">
        <div className="flex w-24 items-center justify-start gap-1">
          <p
            className="cursor-pointer text-xs font-medium underline"
            onClick={() => {
              setLeftUIState('leftCartEditWithViewOffers');
            }}
          >
            Search
          </p>
        </div>
        <div className="my-0.25">
          <div className="mx-auto my-1 flex w-min items-center gap-2">
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
          <a href="/faq#buylists" target="_blank">
            <span className="flex cursor-pointer items-center gap-1">
              <p className="text-sm">FAQ</p>
              <QuestionMarkCircledIcon className="h-5 w-5" />
            </span>
          </a>
        </div>
      </div>

      <SelectedCartHeader />
    </div>
  );
};

export const SelectedCartHeader = () => {
  const {
    filterOptions,
    setFilter,
    reviewData,
    defaultSortBy,
    sortBy,
    setSortBy,
    sortByOptions,
    clearFilters,
    setLeftUIState,
    leftUIState,
    searchResultCount,
    currentCartId,
    currentCart,
    setCurrentCartId,
    setCurrentCart
  } = useBuyListStore();
  const [cartDialogOpen, setCartDialogOpen] = useState(false);
  const CART_KEY = (cartId: number) => ['cart', cartId] as const;
  const { data: currentCartt } = useQuery<{
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
  return (
    <>
      {currentCart && (
        <>
          <div className="mx-1 block  w-full border-t md:hidden "></div>
          <div className="mx-auto flex h-8 w-full items-center justify-between bg-card px-1  md:hidden">
            <div className="flex w-16 items-center justify-start gap-1">
              <span
                className="flex cursor-pointer gap-0.5 rounded-lg  px-1 py-1 font-medium underline"
                onClick={() => {
                  setLeftUIState('leftCartListSelection');
                  setCurrentCartId(null);
                  setCurrentCart(null);
                }}
              >
                <p className="text-xs">My Lists</p>
              </span>
            </div>
            <div className="mx-auto flex w-min gap-2">
              <p className="truncate text-sm">{currentCartt?.cart?.name} s</p>
            </div>
            <div className="flex w-16 items-center justify-end gap-1">
              <Dialog open={cartDialogOpen} onOpenChange={setCartDialogOpen}>
                <DialogTrigger asChild>
                  <ShoppingCart className="h-5 w-5 cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="flex h-screen w-screen max-w-none flex-col gap-0 space-y-3  ">
                  <DialogHeader className="mt-4 h-min space-y-1.5">
                    <DialogTitle>Confirm Your Buylist</DialogTitle>
                    <DialogDescription>
                      Make sure your buylist is correct before submitting.
                    </DialogDescription>
                  </DialogHeader>
                  <LeftCartEditWithViewOffers
                    closeMobileCartDialog={() => {
                      setCartDialogOpen(false);
                    }}
                  />
                </DialogContent>
              </Dialog>

              {/* <LeftCartEditWithViewOffers></LeftCartEditWithViewOffers> */}
              {/* <Sheet>
                <SheetTitle hidden>Filters</SheetTitle>
                <SheetDescription hidden>
                  Filter your search results
                </SheetDescription>
                <SheetTrigger asChild className="">
                  <ShoppingCart className="h-5 w-5 cursor-pointer" />
                </SheetTrigger>
                <SheetContent side="left">
                  <LeftCartEditWithViewOffers></LeftCartEditWithViewOffers>
                </SheetContent>
              </Sheet> */}
            </div>
          </div>
        </>
      )}
    </>
  );
};
export const AllStoreOffersHeader = () => {
  const {
    filterOptions,
    setFilter,
    reviewData,
    defaultSortBy,
    sortBy,
    setSortBy,
    sortByOptions,
    clearFilters,
    setLeftUIState,
    leftUIState,
    searchResultCount,
    currentCart,
    setCurrentCartId,
    setCurrentCart
  } = useBuyListStore();
  return (
    <div>
      <div className="mx-auto flex w-full items-center justify-between bg-card px-1 py-0.5 md:rounded-lg md:border ">
        <div className="flex w-24 items-center justify-start gap-1">
          {leftUIState === 'leftCartEdit' && (
            <span
              className="flex cursor-pointer gap-0.5 rounded-lg bg-background px-1 py-1 font-medium hover:bg-background/50"
              onClick={() => {
                setLeftUIState('leftCartEditWithViewOffers');
              }}
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <p className="text-xs">Back</p>
            </span>
          )}
        </div>
        <div className="my-0.25">
          <div className="max-w-full overflow-hidden">
            {(leftUIState === 'leftCartListSelection' ||
              leftUIState === 'leftCartEditWithViewOffers') && (
              <p className="truncate text-sm">{searchResultCount} Results</p>
            )}
            {leftUIState === 'leftCartEdit' && (
              <p className="truncate text-sm">
                {reviewData?.length} Store Offers
              </p>
            )}
            {leftUIState === 'leftSubmitOffer' && (
              <p className="truncate text-sm">Submit Offer</p>
            )}
          </div>
          <div className="mx-auto my-1 flex w-min items-center gap-2">
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
          <a href="/faq#buylists" target="_blank">
            <span className="flex cursor-pointer items-center gap-1">
              <p className="text-sm">FAQ</p>
              <QuestionMarkCircledIcon className="h-5 w-5" />
            </span>
          </a>
        </div>
      </div>

      {/* {currentCart && (
        <>
          <div className="mx-1 block  w-full border-t md:hidden "></div>
          <div className="mx-auto flex h-8 w-full items-center justify-between bg-card px-1  md:hidden">
            <div className="flex w-16 items-center justify-start gap-1">
              <span
                className="flex cursor-pointer gap-0.5 rounded-lg  px-1 py-1 font-medium underline"
                onClick={() => {
                  setLeftUIState('leftCartListSelection');
                  setCurrentCartId(null);
                  setCurrentCart(null);
                }}
              >
                <p className="text-xs">My Lists</p>
              </span>
            </div>
            <div className="mx-auto flex w-min gap-2">
              <p className="truncate text-sm">{currentCart.name}</p>
            </div>
            <div className="flex w-16 items-center justify-end gap-1"></div>
          </div>
        </>
      )} */}
    </div>
  );
};
