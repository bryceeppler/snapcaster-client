//hooks and store states
import useBuyListStore, { IBuylistCart } from '@/stores/useBuylistStore';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUserCarts } from '@/hooks/useUserCarts';
//components
import { VerifyListContainer } from '../modify-list-items/verify-list-container';
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
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
//icons
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import {
  ChevronLeft,
  ListIcon,
  PlusIcon,
  ShoppingCart,
  SlidersHorizontal
} from 'lucide-react';
//other
import axiosInstance from '@/utils/axiosWrapper';

/////////////////////////////////////////////////////////////////////////////////////
// This File Contains All the Header Components for each step in the buylist stage //
/////////////////////////////////////////////////////////////////////////////////////

export const ListSelectionHeader = () => {
  const { setBuylistUIState } = useBuyListStore();
  const { createCart, isCreating } = useUserCarts();
  const { isAuthenticated } = useAuth();
  const [newCartName, setNewCartName] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  return (
    <div className=" flex justify-between rounded-t-lg bg-card px-1">
      <div className="flex h-10 w-16 items-center justify-start gap-1"></div>
      <div className="flex items-center gap-1">
        <p className="truncate text-sm font-semibold"> Saved Lists</p>
      </div>
      <div className="flex w-16 items-center justify-end gap-1 ">
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild onClick={() => setCreateDialogOpen(true)}>
            <Button
              variant="ghost"
              size="sm"
              className="relative h-9 px-2 text-sm font-medium"
              disabled={!isAuthenticated}
            >
              <PlusIcon className="h-6 w-6 cursor-pointer" />
            </Button>
          </DialogTrigger>
          <DialogContent onClick={(e) => e.stopPropagation()}>
            <DialogHeader>
              <DialogTitle>Create New Buylist</DialogTitle>
              <DialogDescription>
                Enter a name for your new buylist.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <Input
                placeholder="Enter buylist name"
                value={newCartName}
                onChange={(e) => setNewCartName(e.target.value)}
                maxLength={20}
              />
              <Button
                onClick={() => {
                  createCart(newCartName);
                  setNewCartName('');
                  setCreateDialogOpen(false);
                  setBuylistUIState('searchResultsState');
                }}
                disabled={isCreating || !newCartName.trim()}
              >
                {isCreating ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export const CurrentListHeader = () => {
  const CART_KEY = (cartId: number) => ['cart', cartId] as const;
  const { setBuylistUIState, currentCartId, setCurrentCartId, setCurrentCart } =
    useBuyListStore();
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
  const [cartDialogOpen, setCartDialogOpen] = useState(false);
  return (
    <div className="  flex justify-between rounded-lg bg-card px-1">
      {/* LEFT SECTION */}
      <div className="flex h-10 w-16 items-center justify-start gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="relative h-9 px-2 text-sm font-medium"
          onClick={() => {
            setBuylistUIState('listSelectionState');
            setCurrentCartId(null);
            setCurrentCart(null);
          }}
        >
          <ListIcon className="h-6 w-6" />
        </Button>
      </div>
      {/* MIDDLE SECTION */}
      <div className="flex w-full flex-1 items-center gap-1 overflow-hidden text-center">
        <p className="w-full truncate text-sm font-medium">
          {currentCart?.cart?.name}
        </p>
      </div>
      {/* RIGHT SECTION */}
      <div className="flex w-16 items-center justify-end gap-1 ">
        <div className="block md:hidden">
          <Dialog open={cartDialogOpen} onOpenChange={setCartDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="relative h-9 px-2 text-sm font-medium"
              >
                <ShoppingCart className="h-5 w-5 cursor-pointer" />
              </Button>
            </DialogTrigger>
            <DialogContent className="flex h-[100dvh] max-w-none flex-col overflow-hidden p-0">
              <DialogHeader className="p-6 pb-0">
                <DialogTitle>Confirm Your Buylist</DialogTitle>
                <DialogDescription>
                  Make sure your buylist is correct before submitting.
                </DialogDescription>
              </DialogHeader>
              <div className="flex-1 overflow-hidden p-6">
                <VerifyListContainer />
              </div>
              <div className="sticky bottom-0 border-t bg-background p-4">
                <Button
                  className="w-full"
                  onClick={() => {
                    setCartDialogOpen(false);
                    setBuylistUIState('viewAllOffersState');
                  }}
                >
                  View Offers
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="hidden md:block">
          <Button
            variant="ghost"
            size="sm"
            className="relative h-9 px-2 text-sm font-medium"
            onClick={() => {
              setCartDialogOpen(false);
              setBuylistUIState('viewAllOffersState');
            }}
          >
            <ShoppingCart className="h-5 w-5 cursor-pointer" />
          </Button>
        </div>
      </div>
    </div>
  );
};

interface SearchResultsHeaderProps {
  isMobile?: true;
}

export const SearchResultsHeader = ({ isMobile }: SearchResultsHeaderProps) => {
  const {
    filterOptions,
    setFilter,
    defaultSortBy,
    sortBy,
    setSortBy,
    sortByOptions,
    clearFilters,
    searchResultCount,
    buylistUIState
  } = useBuyListStore();
  return (
    <div
      className={`mx-auto w-full items-center justify-between bg-card p-1 md:rounded-lg ${
        isMobile && buylistUIState === 'searchResultsState'
          ? 'flex md:hidden' // Show on mobile, hide on desktop when in search state
          : 'hidden md:flex' // Hide on mobile, show on desktop otherwise
      }`}
    >
      {/* LEFT SECTION */}
      <div className="flex w-24 items-center justify-start gap-1">
        <Sheet>
          <SheetTitle hidden>Filters</SheetTitle>
          <SheetDescription hidden>Filter your search results</SheetDescription>
          <SheetTrigger asChild className="">
            <Button
              variant="ghost"
              size="sm"
              className="relative h-9 text-sm font-medium"
            >
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5" />
                <p className="hidden md:block">Filters</p>
              </span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[100vw] p-0 px-3 py-6 sm:w-[400px]"
          >
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
      </div>

      {/* MIDDLE SECTION */}
      <div className="overflow-hidden">
        <p className="truncate text-sm">{searchResultCount} Results</p>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex w-24 items-center justify-end gap-1">
        <a href="/faq#buylists" target="_blank">
          <Button
            variant="ghost"
            size="sm"
            className="relative h-9 text-sm font-medium"
          >
            <span className="flex items-center gap-1">
              <QuestionMarkCircledIcon className="h-6 w-6" />
              <p className="hidden md:block">Help</p>
            </span>
          </Button>
        </a>
      </div>
    </div>
  );
};

export const ViewAllOffersHeader = () => {
  const { reviewData, setBuylistUIState, buylistUIState } = useBuyListStore();
  return (
    <div>
      <div className="mx-auto flex  w-full items-center justify-between rounded-lg bg-card p-1">
        {/* LEFT SECTION */}
        <div className="flex w-24 items-center justify-start gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="relative h-9 px-2 text-sm font-medium"
            onClick={() => {
              setBuylistUIState('searchResultsState');
            }}
          >
            <span className="flex cursor-pointer items-center gap-0.5  rounded-lg font-medium">
              <ChevronLeft className="h-5 w-5" />
              <p className="text-sm">Back</p>
            </span>
          </Button>
        </div>

        {/* MIDDLE SECTION */}
        <p className="truncate text-sm">{reviewData?.length} Store Offers</p>

        {/* RIGHT SECTION */}
        <div className="flex w-24 items-center justify-end gap-1">
          <a href="/faq#buylists" target="_blank">
            <Button
              variant="ghost"
              size="sm"
              className="relative h-9 px-2 text-sm font-medium"
              onClick={() => {
                setBuylistUIState('searchResultsState');
              }}
            >
              <span className="flex items-center gap-1">
                <QuestionMarkCircledIcon className="h-6 w-6" />
                <p className="hidden md:block">Help</p>
              </span>
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export const FinalSubmissionHeader = () => {
  const { setBuylistUIState, buylistUIState } = useBuyListStore();
  return (
    <div>
      <div
        className={`mx-auto flex  w-full items-center justify-between rounded-lg bg-card p-1  
        `}
      >
        {/* LEFT SECTION */}
        <div className="flex w-24 items-center justify-start gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="relative h-9 px-2 text-sm font-medium"
            onClick={() => {
              setBuylistUIState('viewAllOffersState');
            }}
          >
            <span className="flex cursor-pointer items-center gap-0.5  rounded-lg font-medium">
              <ChevronLeft className="h-5 w-5" />
              <p className="text-sm">Back</p>
            </span>
          </Button>
        </div>

        {/* MIDDLE SECTION */}
        <div className="my-0.25">
          <div className="max-w-full overflow-hidden">
            <p className="truncate text-sm">Submit Offer</p>
          </div>
        </div>
        {/* RIGHT SECTION */}
        <div className="flex w-24 items-center justify-end gap-1">
          <a href="/faq#buylists" target="_blank">
            <Button
              variant="ghost"
              size="sm"
              className="relative h-9 text-sm font-medium"
            >
              <span className="flex items-center gap-1">
                <QuestionMarkCircledIcon className="h-6 w-6" />
                <p className="hidden md:block">Help</p>
              </span>
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};
