import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import { CaretDownIcon } from '@radix-ui/react-icons';
import useBuyListStore from '@/stores/buyListStore';

interface Props {
  values: {
    key: string;
    value: string;
  }[];
  filterName: string;
  setFilterFunction: (filters: string[]) => void;
}

export default function FilterDropDownMultiple({
  values,
  filterName,
  setFilterFunction
}: Props) {
  const { checkAtleastOneFilter, atLeastOneFilter } = useBuyListStore();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const handleSelectChange = (value: string) => {
    if (!selectedItems.includes(value)) {
      setSelectedItems((prev) => [...prev, value]);
    } else {
      const referencedArray = [...selectedItems];
      const indexOfItemToBeRemoved = referencedArray.indexOf(value);
      referencedArray.splice(indexOfItemToBeRemoved, 1);
      setSelectedItems(referencedArray);
    }
  };

  const isOptionSelected = (value: string): boolean => {
    return selectedItems.includes(value) ? true : false;
  };

  useEffect(() => {
    setFilterFunction(selectedItems);
    checkAtleastOneFilter();
  }, [selectedItems]);

  useEffect(() => {
    if (atLeastOneFilter == false) {
      setSelectedItems([]);
    }
  }, [atLeastOneFilter]);

  return (
    <DropdownMenu>
      <span>
        <span className="flex">
          <p className="text-sm">{filterName}:</p> &nbsp;
          {selectedItems.length > 0 ? (
            <p className="text-sm">({selectedItems.length})</p>
          ) : (
            <p className="text-sm">Any</p>
          )}
        </span>

        <DropdownMenuTrigger
          asChild
          className="border-border-colour mx-auto  h-8  w-full bg-popover focus:ring-0 sm:w-[180px] "
        >
          <Button variant="outline" className="flex gap-2 text-left font-bold">
            <span className="w-full font-medium"> {filterName}</span>
            {/* <p className="w-full font-medium">{filterName}</p> */}
            <CaretDownIcon></CaretDownIcon>
          </Button>
        </DropdownMenuTrigger>
      </span>

      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width]"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DropdownMenuLabel>Select {filterName}:</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Array.isArray(values) &&
          values.map((value: Props['values'][0], index: number) => {
            return (
              <DropdownMenuCheckboxItem
                onSelect={(e) => e.preventDefault()}
                key={index}
                checked={isOptionSelected(value.key)}
                onCheckedChange={() => handleSelectChange(value.key)}
              >
                {value.value}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
