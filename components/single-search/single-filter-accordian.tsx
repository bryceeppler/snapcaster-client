import React from 'react';
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

import useSingleStore from '@/stores/singleSearchStore';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

type Props = {
  filters: any;
  filterOption: string;
  header: string;
  handleFilterChange: any;
};

const SingleFilterAccordian = ({
  filters,
  filterOption,
  header,
  handleFilterChange
}: Props) => {
  const { filteredResults } = useSingleStore();

  return (
    <AccordionItem value={filterOption}>
      <AccordionTrigger className="text-base">{header}</AccordionTrigger>
      <AccordionContent>
        <ScrollArea className="flex max-h-[200px] flex-col overflow-y-auto">
          <div className="grid gap-2">
            {Array.from(
              new Set(
                filteredResults
                  .map((product) => product[filterOption])
                  .filter((value) => value && value.trim() !== '')
              )
            )
              .sort()
              .map((option) => (
                <Label
                  key={option}
                  className="flex items-center gap-2 overflow-clip text-left text-xs font-normal capitalize"
                >
                  <Checkbox
                    checked={filters[filterOption].includes(option)}
                    onCheckedChange={() =>
                      handleFilterChange(
                        filterOption,
                        filters[filterOption].includes(option)
                          ? filters[filterOption].filter(
                              (s: any) => s !== option
                            )
                          : [...filters[filterOption], option]
                      )
                    }
                  />
                  <div className="line-clamp-1">{option}</div>
                </Label>
              ))}
          </div>
          <ScrollBar orientation="vertical" />{' '}
        </ScrollArea>
      </AccordionContent>
    </AccordionItem>
  );
};
export default SingleFilterAccordian;
