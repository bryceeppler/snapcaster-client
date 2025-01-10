import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { useSingleSearchStore } from '@/stores/useSingleSearchStore';

import useGlobalStore from '@/stores/globalStore';
import useAuthStore from '@/stores/authStore';
import { createCheckoutSession } from '@/lib/utils';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Separator } from '@radix-ui/react-dropdown-menu';
import SingleSortBy from '../single-search/single-sort-by';
import useBuyListStore from '@/stores/buyListStore';
import {
  FilterOption,
  FilterOptionValues,
  singleSortByLabel
} from '@/types/query';
import SearchSortBy from './search-sort-by';
type Prop = {
  filterOptions: any;
  searchType: string;
  fetchCards: () => Promise<void>;
  clearFilters: () => void;
};
const FilterSection: React.FC<Prop> = memo(
  ({ filterOptions, searchType, fetchCards, clearFilters }) => {
    const { isAuthenticated } = useAuthStore();
    const { sortBy, setSortBy, setCurrentPage } = useSingleSearchStore();
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
                      searchType={searchType}
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>
          <div className="border-1 mb-4 flex flex-col gap-2 border p-4 text-left text-sm">
            <p>
              Support us with{' '}
              <span className="font-bold text-primary">Snapcaster Pro</span> and
              remove promoted results with reduced ads for $2.99/mo.
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
  searchType: string;
}

const FilterScrollArea: React.FC<FilterScrollAreaProps> = ({
  filterOption,
  searchType
}) => {
  return (
    <div>
      <div className="flex">
        <ScrollArea className="90 max-h-48 w-full rounded-lg  px-3">
          <FilterFactory filterOption={filterOption} searchType={searchType} />
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </div>
    </div>
  );
};

interface FilterFactoryProps {
  filterOption: FilterOption;
  searchType: string;
}

const FilterFactory: React.FC<FilterFactoryProps> = ({
  filterOption,
  searchType
}) => {
  const singleSearchStore = useSingleSearchStore();
  const buylistSearchStore = useBuyListStore();
  // Dynamically determine the functions based on the search type
  const { setFilter, setCurrentPage, applyFilters } = (() => {
    switch (searchType) {
      case 'single':
        return singleSearchStore;
      case 'buylist':
        return buylistSearchStore;

      default:
        throw new Error(`Unknown search type: ${searchType}`);
    }
  })();

  const handleOptionChange = (
    filter: FilterOption,
    option: FilterOptionValues
  ) => {
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
              checked={option.selected}
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
