import { FilterOption } from '@/types/query';
import { FilterDropdown } from '@/components/ui/filter-dropdown';
import { FilterScrollArea } from '@/components/search-ui/filter-scroll-area';

type FilterSelectorProps = {
  filterOption: FilterOption;
  setFilter: (filterField: string, value: string, selected: boolean) => void;
  keyIndex: number;
};

export default function FilterSelector({
  filterOption,
  setFilter,
  keyIndex
}: FilterSelectorProps) {
  return (
    <FilterDropdown
      key={keyIndex}
      triggerLabel={filterOption.name}
      title={filterOption.name}
      selectedCount={
        filterOption.values.filter((value) => value.selected).length
      }
    >
      <FilterScrollArea
        key={filterOption.field}
        filterOption={filterOption}
        setFilter={setFilter}
        setCurrentPage={() => {}}
        applyFilters={async () => {}}
      />
    </FilterDropdown>
  );
}
