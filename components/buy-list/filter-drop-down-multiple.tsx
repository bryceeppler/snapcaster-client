import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { useState } from 'react';
import { CaretDownIcon } from '@radix-ui/react-icons';

interface Props {
  values: {
    key: string;
    value: string;
  }[];
  filterName: string;
}

export default function FilterDropDownMultiple({ values, filterName }: Props) {
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

  return (
    <DropdownMenu>
      <span>
        <p className="text-sm">{filterName}</p>
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
