import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { useSingleSearchStore } from '@/stores/useSingleSearchStore';
import { FilterOptionValues, FilterOption } from '@/stores/useSingleSearchStore';
import useGlobalStore from '@/stores/globalStore';

export default function FilterSection(): JSX.Element {
  const { filterOptions, fetchCards, clearFilters } = useSingleSearchStore();

  const handleClearFilters = () => {
    clearFilters();
    fetchCards();
  }

  return (
    <div className="mx-auto w-full max-w-sm rounded-lg bg-background text-left shadow-md">
      <h2 className="mb-6 text-2xl font-bold">Filters</h2>

      {filterOptions &&
        filterOptions.map((filterOption) => (
          <FilterScrollArea
            key={filterOption.field}
            filterOption={filterOption}
          />
        ))}

      <Button onClick={handleClearFilters} className="w-full">
        Clear Filters
      </Button>
    </div>
  );
}

interface FilterScrollAreaProps {
  filterOption: FilterOption
}

const FilterScrollArea: React.FC<FilterScrollAreaProps> = ({ filterOption }) => {
  return (
    <div className="mb-4">
      <h3 className="mb-2 text-xl font-semibold capitalize">{filterOption.name}</h3>
      <div className="flex">
      <ScrollArea className="max-h-48 w-full rounded-md border p-3">
        <FilterFactory filterOption={filterOption}/>
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
  const { fetchCards, setFilter, filters } = useSingleSearchStore();
  const handleOptionChange = (filter: FilterOption, option: FilterOptionValues) => {
    setFilter(filter.field, option.value, !option.selected);
    fetchCards();
  }
  const { getWebsiteName } = useGlobalStore();
  return (
    <div className="space-y-3">
      {filterOption && filterOption.values.map((option) => (
        <div key={option.value} className="flex items-start">
          <input
            type="checkbox"
            id={option.value}
            checked={option.selected}
            onChange={(e) => handleOptionChange(filterOption, option)}
            className="mr-2 mt-1"
          />
          <label htmlFor={option.value} className="leading-5">{
          filterOption.field === 'vendor' ? getWebsiteName(option.value) : option.label} ({option.count})</label>
          </div>
      ))}
    </div>
  );
};
