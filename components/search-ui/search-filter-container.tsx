import { Separator } from '@radix-ui/react-dropdown-menu';
import React, { memo } from 'react';

import { ScrollArea, ScrollBar } from '../ui/scroll-area';

import SearchSortBy from './search-sort-by';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { useVendors } from '@/hooks/queries/useVendors';
import { useAuth } from '@/hooks/useAuth';
import { createCheckoutSession } from '@/lib/utils';
import type { FilterOption, FilterOptionValues } from '@/types/query';

// Type for the sort options - matches what's in the provided data
export type SortByOption = string;

// Props for the FilterSection component
type FilterSectionProps = {
  filterOptions: FilterOption[];
  defaultSortBy?: SortByOption;
  sortBy: SortByOption;
  fetchCards: () => Promise<void>;
  clearFilters: () => void;
  setFilter: (filterField: string, value: string, selected: boolean) => void;
  setCurrentPage: (currentPage: number) => void;
  applyFilters: () => Promise<void>;
  setSortBy: (sortBy: SortByOption) => void;
  handleSortByChange: (value: SortByOption) => void;
  sortByOptions: Record<string, string>;
  hidePromo?: boolean;
};

const FilterSection: React.FC<FilterSectionProps> = memo(
  ({
    filterOptions,
    sortBy,
    fetchCards,
    clearFilters,
    setFilter,
    setCurrentPage,
    applyFilters,
    setSortBy,
    sortByOptions,
    hidePromo = false
  }) => {
    const { isAuthenticated, hasActiveSubscription } = useAuth();
    const handleClearFilters = () => {
      clearFilters();
      fetchCards();
    };
    return (
      <ScrollArea className="flex max-h-[95svh] flex-col overflow-y-auto rounded">
        <div className="sticky top-5 mx-auto h-1/4 w-full rounded-lg  px-3 py-2 text-left shadow-md md:max-w-sm">
          <div className=" border-b ">
            {/* {sortByOptions && <p>its here</p>} */}
            <div className="flex w-full justify-center">
              <SearchSortBy
                sortBy={sortBy}
                setSortBy={setSortBy}
                fetchCards={fetchCards}
                setCurrentPage={setCurrentPage}
                sortByOptions={sortByOptions}
              />
            </div>
          </div>
          <Accordion type="multiple" className="w-full  ">
            {filterOptions &&
              filterOptions.map((filterOption: FilterOption, i: number) => (
                <AccordionItem value={filterOption.field} key={i}>
                  <AccordionTrigger className="hover:no-underline">
                    {filterOption.name}
                  </AccordionTrigger>
                  <AccordionContent>
                    <FilterScrollArea
                      key={filterOption.field}
                      filterOption={filterOption}
                      setFilter={setFilter}
                      setCurrentPage={setCurrentPage}
                      applyFilters={applyFilters}
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>
          {!hasActiveSubscription && !hidePromo && (
            <div className="border-1 mb-4 flex flex-col gap-2 border p-4 text-left text-sm">
              <p>
                Support us with{' '}
                <span className="font-bold text-primary">Snapcaster Pro</span>{' '}
                and remove promoted results with reduced ads for $2.99/mo.
              </p>
              <Button
                onClick={
                  isAuthenticated
                    ? createCheckoutSession
                    : () => (window.location.href = '/signin')
                }
              >
                Subscribe
              </Button>
            </div>
          )}

          <Button onClick={handleClearFilters} className="w-full">
            Clear Filters
          </Button>
          <Separator className="mx-2" />
        </div>
      </ScrollArea>
    );
  }
);

interface FilterScrollAreaProps {
  filterOption: FilterOption;
  setFilter: (filterField: string, value: string, selected: boolean) => void;
  setCurrentPage: (currentPage: number) => void;
  applyFilters: () => Promise<void>;
}

const FilterScrollArea: React.FC<FilterScrollAreaProps> = ({
  filterOption,
  setFilter,
  setCurrentPage,
  applyFilters
}) => {
  return (
    <div>
      <div className="flex">
        <ScrollArea className="90 max-h-48 w-full rounded-lg  px-3">
          <FilterFactory
            filterOption={filterOption}
            setFilter={setFilter}
            setCurrentPage={setCurrentPage}
            applyFilters={applyFilters}
          />
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </div>
    </div>
  );
};

interface FilterFactoryProps {
  filterOption: FilterOption;
  setFilter: (filterField: string, value: string, selected: boolean) => void;
  setCurrentPage: (currentPage: number) => void;
  applyFilters: () => Promise<void>;
}

const FilterFactory: React.FC<FilterFactoryProps> = ({
  filterOption,
  setFilter,
  setCurrentPage,
  applyFilters
}) => {
  const { getVendorNameBySlug } = useVendors();
  const [localSelections, setLocalSelections] = React.useState<{
    [key: string]: boolean;
  }>({});
  React.useEffect(() => {
    const selections = filterOption.values.reduce((acc, option) => {
      acc[option.value] = option.selected;
      return acc;
    }, {} as { [key: string]: boolean });
    setLocalSelections(selections);
  }, [filterOption]);

  const handleOptionChange = (
    filter: FilterOption,
    option: FilterOptionValues
  ) => {
    const newSelected = !localSelections[option.value];
    setLocalSelections((prev) => ({
      ...prev,
      [option.value]: newSelected
    }));
    setFilter(filter.field, option.value, !option.selected);
    setCurrentPage(1);
    applyFilters();
  };

  return (
    <div className="space-y-3 py-2">
      {filterOption &&
        filterOption.values.map((option: FilterOptionValues) => (
          <div key={option.value} className="flex items-start">
            <input
              type="checkbox"
              id={option.value}
              checked={localSelections[option.value] ?? option.selected}
              onChange={() => handleOptionChange(filterOption, option)}
              className="mr-2 mt-1"
            />
            <label htmlFor={option.value} className="text-sm leading-5">
              {filterOption.field === 'vendor'
                ? getVendorNameBySlug(option.value)
                : option.label}{' '}
              ({option.count})
            </label>
          </div>
        ))}
    </div>
  );
};
export default memo(FilterSection);
