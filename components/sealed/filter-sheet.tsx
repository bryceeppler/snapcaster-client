import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { useSealedSearchStore } from '@/stores/useSealedSearchStore';
import { useMemo } from 'react';
import { useVendors } from '@/hooks/queries/useVendors';

interface FilterSheetProps {
  sortBy: string | null;
  setSortBy: (sortBy: string | null) => void;
  sortByLabel: Record<string, string>;
  clearFilters: () => void;
}

export default function FilterSheet({
  sortBy,
  setSortBy,
  sortByLabel,
  clearFilters
}: FilterSheetProps) {
  const { selectedFilters, toggleFilter, filterOptions } =
    useSealedSearchStore();
  const { getVendorNameBySlug } = useVendors();

  // Memoize the isSelected function to prevent unnecessary recalculations
  const isSelected = useMemo(() => {
    return (field: string, value: string) =>
      selectedFilters.some((f) => f.field === field && f.value === value);
  }, [selectedFilters]);

  return (
    <div className="flex h-full w-full flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium">Filters & Sort</h4>
        <Button variant="outline" size="sm" onClick={clearFilters}>
          Clear All
        </Button>
      </div>
      <Separator />
      <ScrollArea className="h-[calc(100vh-200px)] w-full pr-4">
        <div className="space-y-6">
          {/* Sort Options */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium leading-none">Sort By</h4>
            <RadioGroup
              value={sortBy ?? ''}
              onValueChange={(value) => setSortBy(value as string | null)}
              className="grid gap-3"
            >
              {Object.entries(sortByLabel).map(([key, label]) => (
                <div key={key} className="flex items-center space-x-2">
                  <RadioGroupItem value={key} id={key} />
                  <Label htmlFor={key}>{label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Separator />

          {/* Filters */}
          <Accordion type="multiple" className="w-full">
            {filterOptions?.map((filterOption) => (
              <AccordionItem
                value={filterOption.field}
                key={filterOption.field}
              >
                <AccordionTrigger className="text-sm font-medium">
                  {filterOption.name}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 py-2">
                    {filterOption.values.map((fValue) => (
                      <div key={fValue.value} className="flex items-start">
                        <input
                          type="checkbox"
                          id={`${filterOption.field}-${fValue.value}`}
                          checked={isSelected(filterOption.field, fValue.value)}
                          onChange={() =>
                            toggleFilter(filterOption.field, fValue.value)
                          }
                          className="mr-2 mt-1"
                        />
                        <label
                          htmlFor={`${filterOption.field}-${fValue.value}`}
                          className="text-sm leading-5"
                        >
                          {filterOption.field === 'vendor'
                            ? getVendorNameBySlug(fValue.value)
                            : fValue.label}{' '}
                          ({fValue.count})
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  );
}
