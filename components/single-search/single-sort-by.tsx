import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from '@/components/ui/dropdown-menu';

import { Button } from '@/components/ui/button';
import { ArrowUpDownIcon } from 'lucide-react';
import { useSingleSearchStore } from '@/stores/useSingleSearchStore';

export default function SingleSortBy() {

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
            value={"price-asc"}
            onValueChange={() => {}}
          >
            <DropdownMenuRadioItem value="price-asc">
              Price: Low to High
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="price-desc">
              Price: High to Low
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="name-asc">
              Name A-Z
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="name-desc">
              Name Z-A
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="set-asc">
              Set A-Z
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="set-desc">
              Set Z-A
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="website-asc">
              Vendor A-Z
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="website-desc">
              Vendor Z-A
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
