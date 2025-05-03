import React from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type FilterDropdownProps = {
  triggerLabel: string;
  title: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  selectedCount?: number;
};

export function FilterDropdown({
  triggerLabel,
  title,
  children,
  className,
  contentClassName,
  selectedCount = 0
}: FilterDropdownProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn('relative flex items-center gap-1 bg-card', className)}
        >
          <span className="truncate text-sm font-medium">{triggerLabel}</span>
          <ChevronDown className="h-4 w-4 text-primary" />
          <span className="sr-only">{title}</span>
          {selectedCount > 0 && (
            <Badge
              variant="default"
              className="absolute -right-2 -top-2 h-5 min-w-5 items-center justify-center px-1 text-xs font-medium"
            >
              {selectedCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn('w-60 p-0', contentClassName)}
        align="start"
      >
        <ScrollArea className="h-[var(--radix-popover-content-available-height)] max-h-60">
          <div className="p-4">{children}</div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
