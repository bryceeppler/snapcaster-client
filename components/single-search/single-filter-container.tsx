import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { useSingleSearchStore } from '@/stores/useSingleSearchStore';
import { FilterOptionValues, FilterOption } from '@/stores/useSingleSearchStore';

export default function FilterSection(): JSX.Element {
  const { filterOptions, fetchCards } = useSingleSearchStore();

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

      <Button onClick={() => fetchCards()} className="w-full">
        Apply Filters
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
      <ScrollArea className="max-h-48 w-full rounded-md border p-4">
        <FilterFactory filterOption={filterOption}/>
      </ScrollArea>
    </div>
  );
};

interface FilterFactoryProps {
  filterOption: FilterOption;
}

const FilterFactory: React.FC<FilterFactoryProps> = ({ filterOption }) => {
  const handleOptionChange = () => {}
  return (
    <div>
      {filterOption && filterOption.values.map((option) => (
        <div key={option.value} className="flex items-center">
          <input
            type="checkbox"
            id={option.value}
            checked={option.selected}
            onChange={(e) => handleOptionChange()}
            className="mr-2"
          />
          <label htmlFor={option.value}>{option.label}</label>
          </div>
      ))}
    </div>
  );
};
