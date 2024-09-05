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

  return (
    <AccordionItem value={filterOption}>
      <AccordionTrigger className="text-base" >{header}</AccordionTrigger>
      <AccordionContent>
        <ScrollArea className="flex max-h-[200px] flex-col overflow-y-auto">
          <div className="grid gap-2">
          </div>
          <ScrollBar orientation="vertical" />{' '}
        </ScrollArea>
      </AccordionContent>
    </AccordionItem>
  );
};
export default SingleFilterAccordian;
