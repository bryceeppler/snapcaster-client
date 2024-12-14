import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from '@/components/ui/dropdown-menu';
import { SortOptions } from '@/stores/useSingleSearchStore';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useSingleSearchStore } from '@/stores/useSingleSearchStore';

export default function SingleSortBy() {
  const { sortBy, setSortBy, fetchCards, setCurrentPage } =
    useSingleSearchStore();

  const handleSortByChange = (value: SortOptions) => {
    setSortBy(value);
    setCurrentPage(1);
    fetchCards();
  };

  const sortByLabel = {
    score: 'Relevance',
    'price-asc': 'Price: Low to High',
    'price-desc': 'Price: High to Low',
    'name-asc': 'Name: A-Z',
    'name-desc': 'Name: Z-A'
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="w-min px-0"
          asChild
          variant={'noOutline'}
        >
          <Button
            variant="outline"
            className="flex h-min  shrink-0 items-center justify-center bg-popover"
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
