import { useEffect, useState } from 'react';
import { CaretDownIcon } from '@radix-ui/react-icons';
import useBuyListStore from '@/stores/buyListStore';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Props {
  values: { key: string; value: string }[];
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
  const { checkAtleastOneFilter, atLeastOneFilter, selectedTCG } =
    useBuyListStore();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSelectChange = (value: string) => {
    setSelectedItems((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const isOptionSelected = (value: string) => selectedItems.includes(value);

  useEffect(() => {
    setFilterFunction(selectedItems);
    checkAtleastOneFilter();
  }, [selectedItems, setFilterFunction, checkAtleastOneFilter]);

  useEffect(() => {
    setFilterFunction([]);
    setSelectedItems([]);
  }, [selectedTCG, setFilterFunction]);

  useEffect(() => {
    if (!atLeastOneFilter) setSelectedItems([]);
  }, [atLeastOneFilter]);

  return (
    <DropdownMenu>
      <span className="flex items-center gap-2">
        <p className="text-sm">{filterName}:</p>
        <p className="text-sm">
          {selectedItems.length > 0 ? `(${selectedItems.length})` : 'Any'}
        </p>
      </span>

      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex gap-2 font-bold">
          <span className="w-full font-medium">{filterName}</span>
          <CaretDownIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="max-h-80 w-[--radix-dropdown-menu-trigger-width]"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DropdownMenuLabel>Select {filterName}:</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="max-h-80 overflow-y-auto">
          {values.map(({ key, value }) => (
            <DropdownMenuCheckboxItem
              key={key}
              checked={isOptionSelected(key)}
              onCheckedChange={() => handleSelectChange(key)}
              onSelect={(e) => e.preventDefault()}
            >
              {value}
            </DropdownMenuCheckboxItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
