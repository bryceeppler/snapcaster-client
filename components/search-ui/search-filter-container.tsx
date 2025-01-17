import React, { memo } from 'react';
import useGlobalStore from '@/stores/globalStore';
import useAuthStore from '@/stores/authStore';
import { createCheckoutSession } from '@/lib/utils';
import {
  FilterOption,
  FilterOptionValues,
  singleSortByLabel
} from '@/types/query';

import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Separator } from '@radix-ui/react-dropdown-menu';
import SearchSortBy from './search-sort-by';

type Prop = {
  filterOptions: any;
  sortBy: any;
  fetchCards: () => Promise<void>;
  clearFilters: () => void;
  setFilter: (filterField: string, value: string, selected: boolean) => void;
  setCurrentPage: (currentPage: number) => void;
  applyFilters: () => Promise<void>;
  setSortBy: (sortBy: any) => void;
};

const FilterSection: React.FC<Prop> = memo(
  ({
    filterOptions,
    sortBy,
    fetchCards,
    clearFilters,
    setFilter,
    setCurrentPage,
    applyFilters,
    setSortBy
  }) => {
    const { isAuthenticated, hasActiveSubscription } = useAuthStore();
    const handleClearFilters = () => {
      clearFilters();
      fetchCards();
    };

    return (
      <ScrollArea className="flex max-h-[95svh] flex-col overflow-y-auto rounded">
        <div className="sticky top-5 mx-auto h-1/4 w-full rounded-lg bg-popover px-3 py-2 text-left shadow-md md:max-w-sm">
          <div className=" border-b md:hidden">
            <SearchSortBy
              sortBy={sortBy}
              setSortBy={setSortBy}
              fetchCards={fetchCards}
              setCurrentPage={setCurrentPage}
              sortByLabel={singleSortByLabel}
            />
          </div>
          <Accordion type="multiple" className="w-full  ">
            {filterOptions &&
              filterOptions.map((filterOption: any, i: number) => (
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
          {!hasActiveSubscription && (
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

  const { getWebsiteName } = useGlobalStore();
  return (
    <div className="space-y-3 py-2">
      {filterOption &&
        filterOption.values.map((option: any) => (
          <div key={option.value} className="flex items-start">
            <input
              type="checkbox"
              id={option.value}
              checked={localSelections[option.value] ?? option.selected}
              onChange={(e) => handleOptionChange(filterOption, option)}
              className="mr-2 mt-1"
            />
            <label htmlFor={option.value} className="text-sm leading-5">
              {filterOption.field === 'vendor'
                ? getWebsiteName(option.value)
                : option.label}{' '}
              ({option.count})
            </label>
          </div>
        ))}
    </div>
  );
};
export default memo(FilterSection);
