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
  const { hasActiveSubscription, isAuthenticated } = useAuthStore();

  const freeFilters = ['condition', 'finish'];

  const handleClearFilters = () => {
    clearFilters();
    fetchCards();
  };

  return (
    <div className="mx-auto w-full rounded-lg bg-popover p-4 text-left shadow-md md:max-w-sm">
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
        <div className="border-1 mb-4 flex flex-col gap-2 border p-4 text-left text-sm">
          <p>
            Snapcaster <span className="font-bold text-primary">Pro</span>{' '}
            members get advanced filtering options.
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
        <ScrollArea className="max-h-48 w-full rounded-lg border px-3">
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
  const { fetchCards, setFilter, filters, setCurrentPage, applyFilters } =
    useSingleSearchStore();
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
        filterOption.values.map((option) => (
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
