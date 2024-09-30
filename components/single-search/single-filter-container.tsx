import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { useSingleSearchStore } from '@/stores/useSingleSearchStore';
import {
  FilterOptionValues,
  FilterOption
} from '@/stores/useSingleSearchStore';
import useGlobalStore from '@/stores/globalStore';
import useAuthStore from '@/stores/authStore';
import { createCheckoutSession } from '@/lib/utils';

export default function FilterSection(): JSX.Element {
  const { filterOptions, fetchCards, clearFilters } = useSingleSearchStore();
  const { hasActiveSubscription } = useAuthStore();

  const freeFilters = ['condition', 'finish'];

  const handleClearFilters = () => {
    clearFilters();
    fetchCards();
  };

  return (
    <div className="mx-auto w-full md:max-w-sm rounded-lg bg-popover text-left shadow-md p-4">
      <h2 className="mb-6 text-2xl font-bold">Filters</h2>

      {filterOptions &&
        filterOptions.map((filterOption) => {
          if (
            hasActiveSubscription ||
            freeFilters.includes(filterOption.field)
          ) {
            return (
              <FilterScrollArea
                key={filterOption.field}
                filterOption={filterOption}
              />
            );
          }
        })}

        {!hasActiveSubscription && (
          <div className="p-4 text-sm text-center border border-1 mb-4">
            <p>
              Snapcaster <span className="text-primary font-bold">Pro</span> members get advanced filtering options{' '}
              <Button onClick={createCheckoutSession}>Subscribe</Button>
            </p>
          </div>
        )}

      <Button onClick={handleClearFilters} className="w-full">
        Clear Filters
      </Button>
    </div>
  );
}

interface FilterScrollAreaProps {
  filterOption: FilterOption;
}

const FilterScrollArea: React.FC<FilterScrollAreaProps> = ({
  filterOption
}) => {
  return (
    <div className="mb-4">
      <h3 className="mb-2 text-lg font-semibold capitalize">
        {filterOption.name}
      </h3>
      <div className="flex">
        <ScrollArea className="max-h-48 w-full rounded-md border px-3">
          <FilterFactory filterOption={filterOption} />
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </div>
    </div>
  );
};

interface FilterFactoryProps {
  filterOption: FilterOption;
}

const FilterFactory: React.FC<FilterFactoryProps> = ({ filterOption }) => {
  const { fetchCards, setFilter, filters, setCurrentPage } =
    useSingleSearchStore();
  const handleOptionChange = (
    filter: FilterOption,
    option: FilterOptionValues
  ) => {
    setFilter(filter.field, option.value, !option.selected);
    setCurrentPage(1);
    fetchCards();
  };
  const { getWebsiteName } = useGlobalStore();
  return (
    <div className="space-y-3">
      {filterOption &&
        filterOption.values.map((option) => (
          <div key={option.value} className="flex items-start">
            <input
              type="checkbox"
              id={option.value}
              checked={option.selected}
              onChange={(e) => handleOptionChange(filterOption, option)}
              className="mr-2 mt-1"
            />
            <label htmlFor={option.value} className="leading-5 text-sm">
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
