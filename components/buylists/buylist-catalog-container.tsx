//hooks and store states
import React from 'react';
import useBuyListStore from '@/stores/useBuylistStore';
//components
import BuylistLeftSideBodyFactory from './buylist-factory/left-factory';
import BuylistRightSideBodyFactory from './buylist-factory/right-factory';
import { ScrollArea } from '../ui/scroll-area';
import { BuylistHeader } from './header/header';

export default function BuylistCatalog() {
  const { leftUIState } = useBuyListStore();

  return (
    <div className="flex flex-col gap-1">
      {/* Header */}
      <span className="hidden md:block">
        <BuylistHeader />
      </span>

      {/* Body */}
      <div className="flex md:gap-1">
        {/* <div className="flex"> */}
        {/* Body - Left Sidebar */}
        {/* <div>
          <BuylistLeftSideBodyFactory leftUIState={leftUIState} />
        </div> */}
        {/* Body - Content */}
        {/* <div className="h-[75vh] w-full overflow-hidden rounded-lg border bg-card p-0.5">
          <ScrollArea className="h-full" type="scroll">
            <BuylistRightSideBodyFactory leftUIState={leftUIState} />
          </ScrollArea>
        </div> */}
        {/* <div className="h-[75vh] w-full overflow-hidden rounded-lg border bg-card p-0.5"> */}
        {/* <ScrollArea className="h-full" type="scroll"> */}
        <BuylistRightSideBodyFactory leftUIState={leftUIState} />
        {/* </ScrollArea> */}
        {/* </div> */}
      </div>
    </div>
  );
}
