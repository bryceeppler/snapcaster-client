import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { CaretDownIcon } from '@radix-ui/react-icons';
import useBuyListStore from '@/stores/buyListStore';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Props {
  values: {
    key: string;
    value: string;
  }[];
  filterName: string;
  setFilterFunction: (filters: string[]) => void;
  selectedZustandFilters: string[];
}

export default function FilterDropDownMultiple({
  values,
  filterName,
  setFilterFunction,
  selectedZustandFilters
}: Props) {
  const { checkAtleastOneFilter, atLeastOneFilter } = useBuyListStore();

  const handleSelectChange = (value: string) => {
    const newSelectedItems = selectedZustandFilters.includes(value)
      ? selectedZustandFilters.filter((item) => item !== value) // Deselect
      : [...selectedZustandFilters, value]; // Select

    setFilterFunction(newSelectedItems); // Update Zustand store
    checkAtleastOneFilter(); // Check if at least one filter is selected
  };

  return (
    <DropdownMenu>
      <span className="flex-1">
        <span className="flex">
          <p className="text-sm">{filterName}:</p> &nbsp;
          {selectedZustandFilters.length > 0 ? (
            <p className="text-sm">({selectedZustandFilters.length})</p>
          ) : (
            <p className="text-sm">Any</p>
          )}
        </span>

        <DropdownMenuTrigger
          asChild
          className="border-border-colour h-8 w-full bg-popover  focus:ring-0 "
        >
          <Button variant="outline" className="flex gap-2 text-left font-bold">
            <span className="w-full font-medium"> {filterName}</span>
            <CaretDownIcon />
          </Button>
        </DropdownMenuTrigger>
      </span>

      <DropdownMenuContent
        className="max-h-85 w-[--radix-dropdown-menu-trigger-width]"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DropdownMenuLabel>Select {filterName}:</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea
          className="flex max-h-80 flex-col overflow-y-auto"
          type="always"
        >
          {Array.isArray(values) &&
            values.map((value, index) => (
              <DropdownMenuCheckboxItem
              onSelect={(e) => e.preventDefault()}
              key={index}
                checked={selectedZustandFilters.includes(value.key)}
                onCheckedChange={() => handleSelectChange(value.key)}
                className="capitalize"
              >
                {value.value}
              </DropdownMenuCheckboxItem>
            ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
