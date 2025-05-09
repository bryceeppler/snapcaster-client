import React, { useEffect, useState } from 'react';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useVendors } from '@/hooks/queries/useVendors';
import type { FilterOption, FilterOptionValues } from '@/types/query';

interface FilterScrollAreaProps {
  filterOption: FilterOption;
  setFilter: (filterField: string, value: string, selected: boolean) => void;
  setCurrentPage: (currentPage: number) => void;
  applyFilters: () => Promise<void>;
}

export const FilterScrollArea: React.FC<FilterScrollAreaProps> = ({
  filterOption,
  setFilter,
  setCurrentPage,
  applyFilters
}) => {
  return (
    <div>
      <div className="flex">
        <ScrollArea className="w-full rounded-lg px-3">
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
  const [localSelections, setLocalSelections] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
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
        filterOption.values.map((option) => (
          <div key={option.value} className="flex items-start">
            <input
              type="checkbox"
              id={`${filterOption.field}-${option.value}`}
              checked={localSelections[option.value] ?? option.selected}
              onChange={() => handleOptionChange(filterOption, option)}
              className="mr-2 mt-1"
            />
            <label
              htmlFor={`${filterOption.field}-${option.value}`}
              className="text-sm leading-5"
            >
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
