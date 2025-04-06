import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import {
  ArrowLeftIcon,
  MixerHorizontalIcon,
  QuestionMarkCircledIcon
} from '@radix-ui/react-icons';
import FilterSection from '@/components/search-ui/search-filter-container';
import useBuyListStore from '@/stores/useBuylistStore';
import { useBuylistSearch } from '@/hooks/queries/useBuylistSearch';

export const BuylistHeader = () => {
  const {
    searchTerm,
    tcg,
    filterOptions,
    filters,
    setFilter,
    reviewData,
    defaultSortBy,
    sortBy,
    setSortBy,
    sortByOptions,
    clearFilters,
    setLeftUIState,
    leftUIState,
    searchResultCount
  } = useBuyListStore();

  return (
    <div className="mx-auto flex w-full items-center justify-between rounded-lg border bg-card px-1 py-0.5 ">
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
                sortBy={sortBy ? sortBy : defaultSortBy}
                fetchCards={async () => {
                  //   refetch();
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
              setLeftUIState('leftCartEditWithViewOffers');
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
          {(leftUIState === 'leftCartListSelection' ||
            leftUIState === 'leftCartEditWithViewOffers') && (
            <p className="text-sm">{searchResultCount} Search Results</p>
          )}
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
              leftUIState === 'leftSubmitOffer' ? 'bg-primary' : 'bg-background'
            }`}
          ></div>
        </div>
      </div>
      <div className="flex w-24 items-center justify-end gap-1">
        <p className="text-sm">FAQ</p>
        <QuestionMarkCircledIcon className="h-5 w-5" />
      </div>
    </div>
  );
};
