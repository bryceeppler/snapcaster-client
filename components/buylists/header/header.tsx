import useBuyListStore from '@/stores/useBuylistStore';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { useUserCarts } from '@/hooks/useUserCarts';

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
import {
  ChevronLeft,
  ListIcon,
  PlusIcon,
  SlidersHorizontal
} from 'lucide-react';

import SearchSortBy from '@/components/buylists/sort-by';
import FilterSelector from '@/components/buylists/filter-selector';
import FilterSheet from '@/components/buylists/filter-sheet';
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
interface SearchResultsHeaderProps {
  isMobile?: boolean;
}

export const SearchResultsHeader = ({
  isMobile
}: SearchResultsHeaderProps = {}) => {
  const {
    filterOptions,
    setFilter,
    defaultSortBy,
    sortBy,
    setSortBy,
    sortByOptions,
    clearFilters,
    searchResultCount,
    buylistUIState,
    setBuylistUIState
  } = useBuyListStore();
  const { getCurrentCart } = useUserCarts();
  const { isAuthenticated } = useAuth();
  const { openListSelection, setOpenListSelection } = useBuyListStore();
  const [openFilterSheet, setOpenFilterSheet] = useState(false);
  const currentCart = getCurrentCart();

  return (
    <div className="mx-auto flex w-full flex-col space-y-2">
      {/* List Selection Button */}
      <div className="flex w-full items-center gap-2 lg:hidden">
        <Button
          variant="outline"
          size="sm"
          className="flex w-full items-center gap-2 bg-card"
          onClick={() => setOpenListSelection(!openListSelection)}
        >
          <ListIcon className="h-4 w-4" />
          <span>My Lists</span>
        </Button>
      </div>

      {/* Mobile: Filter Sheet Button */}
      <div className="flex w-full items-center gap-2 lg:hidden">
        <Button
          variant="outline"
          size="sm"
          className="flex w-full items-center gap-2 bg-card"
          onClick={() => setOpenFilterSheet(!openFilterSheet)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filters</span>
        </Button>
      </div>

      {/* Mobile: Filter Sheet Component */}
      <FilterSheet open={openFilterSheet} onOpenChange={setOpenFilterSheet} />

      {/* Desktop: Filter Dropdowns */}
      <div className="hidden w-full lg:flex lg:flex-wrap lg:gap-2">
        {/* Sort by dropdown */}
        <SearchSortBy
          sortBy={sortBy ?? defaultSortBy ?? 'price-asc'}
          setSortBy={setSortBy}
          fetchCards={async () => {}}
          setCurrentPage={() => {}}
          sortByOptions={sortByOptions}
        />

        {filterOptions &&
          filterOptions.map((filterOption, index) => (
            <FilterSelector
              key={index}
              keyIndex={index}
              filterOption={filterOption}
              setFilter={setFilter}
            />
          ))}

        {/* Clear Filters Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="ml-auto bg-card"
        >
          Clear Filters
        </Button>
      </div>

      {/* MIDDLE SECTION */}
      <p className="text-center text-xs text-muted-foreground">
        {searchResultCount} Results
      </p>
    </div>
  );
};

export const ViewAllOffersHeader = () => {
  const { reviewData, setBuylistUIState } = useBuyListStore();
  return (
    <div className="flex">
      <Button
        variant="outline"
        size="sm"
        className="bg-card"
        onClick={() => {
          setBuylistUIState('searchResultsState');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        <ChevronLeft className="mr-2 h-5 w-5" />
        Search
      </Button>
    </div>
  );
};

export const FinalSubmissionHeader = () => {
  const { setBuylistUIState } = useBuyListStore();
  return (
    <div className="flex">
      <Button
        variant="outline"
        size="sm"
        className="bg-card"
        onClick={() => {
          setBuylistUIState('viewAllOffersState');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        <ChevronLeft className="mr-2 h-5 w-5" />
        Offers
      </Button>
    </div>
  );
};
