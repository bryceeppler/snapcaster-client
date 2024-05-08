'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Filter } from '@/stores/advancedStore';

type Props = {
  option: Filter[];
  label: string;
  selectedList: string[];
  selectCount: number;
  toggle(field: string, category: string): void;
};

export function FilterDropdownBox(props: Props) {
  const [open, setOpen] = React.useState(false);
  const [selectedFields, setSelectedFields] = useState<Record<string, boolean>>(
    props.option.reduce(
      (obj, state) => ({ ...obj, [state.abbreviation]: false }),
      {}
    )
  );

  useEffect(() => {
    props.option.sort(function (a, b) {
      return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
    });
  }, []);

  return (
    <div>
      <div className="mb-1">
        <label className="text-midTone  mb-2 truncate pb-1 text-sm">
          <div className="flex">
            <p className="font-medium">{props.label}</p>
            <p className="pl-1 text-green-600">
              {props.selectCount > 0 ? `+${props.selectCount}` : ''}
            </p>
          </div>
        </label>
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between overflow-hidden  text-ellipsis whitespace-nowrap "
          >
            <p className="truncate capitalize">
              {props.selectedList.length > 0 ? `${props.selectedList}` : 'Any'}
            </p>

            <ChevronsUpDown className={`ml-2 h-4 w-4 shrink-0 opacity-50 `} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width]">
          <Command>
            <CommandInput
              tabIndex={-1}
              placeholder={`Search ${props.label}...`}
            />
            <ScrollArea className=" h-80">
              <CommandEmpty>No {props.label} found.</CommandEmpty>
              <CommandGroup>
                {props.option.map((state) => (
                  <CommandList key={state.name}>
                    <CommandItem
                      className=" font-serif font-medium hover:cursor-pointer"
                      key={state.name}
                      value={state.name}
                      onSelect={(currentValue) => {
                        setSelectedFields({
                          ...selectedFields
                          // [state.abbreviation]: e.target.checked
                        });
                        props.toggle(state.abbreviation, props.label);
                      }}
                    >
                      <div className="flex">
                        <Check
                          className={cn(
                            'mr-1 min-w-5 max-w-5',
                            props.selectedList.includes(state.abbreviation)
                              ? 'text-green-600 opacity-100'
                              : 'opacity-0'
                          )}
                        />
                        <p className="capitalize">{state.name}</p>
                      </div>
                    </CommandItem>
                  </CommandList>
                ))}
              </CommandGroup>
            </ScrollArea>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
