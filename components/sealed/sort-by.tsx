import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from '@/components/ui/dropdown-menu';

// Type for sort options - consistent with search-filter-container.tsx
export type SortByOption = string;

type Props = {
  sortBy: SortByOption;
  setSortBy: (sortBy: SortByOption) => void;
  sortByLabel: Record<string, string>;
};

export default function SortBy({ sortBy, setSortBy, sortByLabel = {} }: Props) {
  const handleSortByChange = (value: SortByOption) => {
    setSortBy(value);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="w-min" asChild variant={'noOutline'}>
          <Button
            variant="outline"
            className="flex h-min  w-full shrink-0 items-center justify-center bg-popover md:w-min"
          >
            <div className="flex items-center">
              <span className="text-sm">{sortByLabel[sortBy]}</span>
              <ChevronDown className="ml-2 h-4 w-4" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width] min-w-[200px]"
          align="end"
        >
          <DropdownMenuRadioGroup
            value={sortBy}
            onValueChange={handleSortByChange}
          >
            {Object.entries(sortByLabel).map(([key, label]) => (
              <DropdownMenuRadioItem key={key} value={key}>
                {label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
