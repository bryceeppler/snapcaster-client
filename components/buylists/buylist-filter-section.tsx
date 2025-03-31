import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { FilterOption, FilterOptionValues } from '@/types/query';

interface BuylistFilterSectionProps {
  filterOptions: FilterOption[] | undefined;
  sortBy: string;
  setSortBy: (sortBy: string | null) => void;
  fetchCards: () => Promise<void>;
  clearFilters: () => void;
  setFilter: (filterField: string, value: string, selected: boolean) => void;
  setCurrentPage: (page: number) => void;
  applyFilters: () => Promise<void>;
  sortByOptions: Record<string, string>;
}

export default function BuylistFilterSection({
  filterOptions,
  fetchCards,
  clearFilters,
  setFilter,
  setCurrentPage,
  applyFilters,
  sortByOptions
}: BuylistFilterSectionProps) {
  return (
    <div className="h-full py-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium leading-none">Filters</h4>
        {filterOptions && (
          <Button
            variant="ghost"
            className="text-xs font-medium"
            onClick={() => {
              clearFilters();
              fetchCards();
            }}
          >
            Clear filters
          </Button>
        )}
      </div>
      <Separator className="my-4" />
      {filterOptions && (
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-6">
            {filterOptions.map((filter) => (
              <div key={filter.field} className="space-y-4">
                <h4 className="text-sm font-medium leading-none">
                  {filter.name}
                </h4>
                <div className="space-y-3">
                  {filter.values.map((option: FilterOptionValues) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        id={option.value}
                        checked={option.selected}
                        onChange={() => {
                          setFilter(
                            option.value,
                            option.label,
                            !option.selected
                          );
                          setCurrentPage(1);
                          applyFilters();
                        }}
                        className="mr-2"
                      />
                      <Label htmlFor={option.value} className="text-sm">
                        {option.label} ({option.count})
                      </Label>
                    </div>
                  ))}
                </div>
                <Separator />
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
