import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { ScrollArea } from '../ui/scroll-area';
import { WebsiteMapping } from '@/types';

type Props = {
  websites: WebsiteMapping[];
  selectedWebsites: WebsiteMapping[];
  onWebsiteSelect: (value: WebsiteMapping) => void;
};

export function WebsiteCombobox({
  websites,
  selectedWebsites,
  onWebsiteSelect
}: Props) {
  const [open, setOpen] = React.useState(false);

  const isWebsiteSelected = (website: WebsiteMapping) =>
    selectedWebsites.some((selected) => selected.slug === website.slug);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between overflow-hidden hover:bg-background"
        >
          <span className="truncate">
            {selectedWebsites.length > 0
              ? selectedWebsites.map((website) => website.name).join(', ')
              : 'All websites'}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput tabIndex={-1} placeholder="Search website..." />
          <CommandEmpty>No website found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              <ScrollArea className=" h-72  rounded-lg ">
                <div className="pr-2">
                  {websites.map((website) => (
                    <CommandItem
                      key={website.slug}
                      value={website.name}
                      onSelect={(currentValue) => {
                        onWebsiteSelect(website);
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          isWebsiteSelected(website)
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                      {website.name}
                    </CommandItem>
                  ))}
                </div>
              </ScrollArea>
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
