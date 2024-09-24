import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from '@/components/ui/dropdown-menu';

import { SortOptions } from '@/stores/useSingleSearchStore';
import { Button } from '@/components/ui/button';
import { ArrowUpDownIcon } from 'lucide-react';
import { useSingleSearchStore } from '@/stores/useSingleSearchStore';

export default function SingleSortBy() {

  const { sortBy, setSortBy, fetchCards, setCurrentPage } = useSingleSearchStore();

  const handleSortByChange = (value: SortOptions) => {
    setSortBy(value);
    setCurrentPage(1);
    fetchCards();

  }


  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex h-10 w-full shrink-0 items-center"
          >
            <span>Sort by</span>
            <ArrowUpDownIcon className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width] min-w-[200px]"
          align="end"
        >
          <DropdownMenuRadioGroup
            value={sortBy}
            onValueChange={(value) => handleSortByChange(value as SortOptions)}
          >
            <DropdownMenuRadioItem value="score">
              Relevance
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="price-asc">
              Price: Low to High
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="price-desc">
              Price: High to Low
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="name-asc">
              Name: A-Z
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="name-desc">
              Name: Z-A
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
