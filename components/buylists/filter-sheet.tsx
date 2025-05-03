import useBuyListStore from '@/stores/useBuylistStore';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import FilterSelector from '@/components/buylists/filter-selector';
import SearchSortBy from '@/components/buylists/sort-by';

interface FilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FilterSheet = ({ open, onOpenChange }: FilterSheetProps) => {
  const {
    filterOptions,
    setFilter,
    defaultSortBy,
    sortBy,
    setSortBy,
    sortByOptions,
    clearFilters
  } = useBuyListStore();

  const filterContent = (
    <div className="flex h-full flex-col">
      <div className="sticky top-0 border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Filters</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Refine your search results
        </p>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="flex flex-col space-y-4 p-4">
            {/* Sort by section */}
            <div className="space-y-2">
              <SearchSortBy
                sortBy={sortBy ?? defaultSortBy ?? 'price-asc'}
                setSortBy={setSortBy}
                fetchCards={async () => {}}
                setCurrentPage={() => {}}
                sortByOptions={sortByOptions}
                triggerClassName="w-full"
              />
            </div>

            <Separator className="my-2" />

            {/* Filters section */}
            <div className="space-y-2">
              <h4 className="font-medium">Filters</h4>
              <div className="flex flex-col gap-2">
                {filterOptions &&
                  filterOptions.map((filterOption, index) => (
                    <FilterSelector
                      key={index}
                      keyIndex={index}
                      filterOption={filterOption}
                      setFilter={setFilter}
                    />
                  ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      <div className="border-t bg-card p-4">
        <Button onClick={clearFilters} className="w-full">
          Clear Filters
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile version (collapsible Sheet) */}
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetTitle hidden>Filters</SheetTitle>
          <SheetDescription hidden>Refine your search results</SheetDescription>
          <SheetContent side="left" className="w-[85vw] p-0 sm:max-w-md">
            {filterContent}
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default FilterSheet;
