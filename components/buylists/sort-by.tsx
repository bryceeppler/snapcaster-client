import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { SortByProps, SortOption } from '@/types/sorting';

export default function SearchSortBy({
  sortBy,
  setSortBy,
  fetchCards,
  setCurrentPage,
  sortByOptions,
  triggerClassName
}: SortByProps) {
  const handleSortByChange = (value: SortOption) => {
    setSortBy(value);
    setCurrentPage(1);
    fetchCards();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn('flex items-center gap-1 bg-card', triggerClassName)}
        >
          <span className="truncate text-sm font-medium">Sort By</span>
          <ChevronDown className="h-4 w-4 text-primary" />
          <span className="sr-only">Sort By</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('w-60 p-0')} align="start">
        <ScrollArea className="h-fit max-h-60">
          <div className="p-4">
            <RadioGroup
              value={sortBy}
              onValueChange={handleSortByChange}
              className="flex flex-col gap-2"
            >
              {sortByOptions &&
                Object.entries(sortByOptions).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`sort-${key}`} />
                    <Label
                      htmlFor={`sort-${key}`}
                      className={cn(
                        'cursor-pointer',
                        sortBy === key && 'font-medium'
                      )}
                    >
                      {label as string}
                    </Label>
                  </div>
                ))}
            </RadioGroup>
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
