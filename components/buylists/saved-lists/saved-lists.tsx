//hooks and store states
import React from 'react';

import { useUserCarts } from '@/hooks/useUserCarts';
//components
import { ListItem } from './saved-list-item';

import { ScrollArea } from '@/components/ui/scroll-area';
//icons

import { SelectSeparator } from '@/components/ui/select';
import { ListSelectionHeader } from '../header/header';

export const LeftCartListSelection = () => {
  const { carts } = useUserCarts();

  return (
    <div className="col-span-1 flex h-[75vh] w-full flex-col space-y-1 rounded-lg  bg-card md:w-80 ">
      <div className="">
        <ListSelectionHeader />
        <SelectSeparator className="my-0 bg-background" />
      </div>

      <div className="overflow-hidden ">
        <ScrollArea className="h-full" type="always">
          <div className="mr-1.5 px-1 ">
            <div>
              {carts?.map((cart, index) => (
                <span key={index}>
                  <ListItem key={cart.id} cart={cart} />
                </span>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
