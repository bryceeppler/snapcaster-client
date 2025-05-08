import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

type SortOption = string;

type Props = {
  sortBy: SortOption;
  setSortBy: (sortBy: SortOption) => void;
  fetchCards: () => Promise<void>;
  setCurrentPage: (currentPage: number) => void;
  sortByOptions: Record<string, string>;
};

export default function SearchSortBy({
  sortBy,
  setSortBy,
  fetchCards,

  setCurrentPage,
  sortByOptions
}: Props) {
  const handleSortByChange = (value: SortOption) => {
    setSortBy(value);
    setCurrentPage(1);
    fetchCards();
  };

  return (
    <div className="w-full pb-4">
      <div className="flex flex-col gap-2">
        <div className="mb-1 flex items-center">
          <span className="text-sm font-medium text-muted-foreground">
            Sort results by
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between border border-input bg-background hover:bg-accent hover:text-accent-foreground focus:ring-2 focus:ring-ring focus:ring-offset-1"
            >
              <div className="flex items-center">
                <span className="truncate text-sm font-medium">
                  {sortByOptions?.[sortBy]}
                </span>
              </div>
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-primary" />
              <span className="sr-only">Sort by {sortByOptions?.[sortBy]}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-[220px] p-1"
            align="start"
            sideOffset={4}
          >
            <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
              Select sorting option
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={sortBy}
              onValueChange={handleSortByChange}
            >
              {sortByOptions &&
                Object.entries(sortByOptions).map(([key, label]) => (
                  <DropdownMenuRadioItem
                    key={key}
                    value={key}
                    className={cn(
                      'my-0.5 cursor-pointer rounded-md',
                      sortBy === key &&
                        'bg-accent font-medium text-accent-foreground'
                    )}
                  >
                    {label as string}
                  </DropdownMenuRadioItem>
                ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
