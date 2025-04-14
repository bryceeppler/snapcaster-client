//hooks and store states
import React from 'react';

import { useUserCarts } from '@/hooks/useUserCarts';
//components
import { ListItem } from './saved-list-item';

import { ScrollArea } from '@/components/ui/scroll-area';
//icons

import { SelectSeparator } from '@/components/ui/select';
import { ListSelectionHeader } from '../header/header';
import { useAuth } from '@/hooks/useAuth';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const LeftCartListSelection = () => {
  const { carts } = useUserCarts();
  const { isAuthenticated } = useAuth();
  return (
    <div className="col-span-1 flex h-[75vh] w-full flex-col space-y-1 rounded-lg bg-card md:w-80">
      <div className="">
        <ListSelectionHeader />
        <SelectSeparator className="my-0 bg-background" />
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" type="always">
          <div
            className={`flex h-[calc(75vh-4rem)] flex-col items-center ${
              !isAuthenticated || (carts && carts.length === 0)
                ? 'pt-[calc(25vh-2rem)]'
                : ''
            }`}
          >
            <div className="w-full px-1">
              {isAuthenticated ? (
                carts && carts.length > 0 ? (
                  carts.map((cart, index) => (
                    <span key={index}>
                      <ListItem key={cart.id} cart={cart} />
                    </span>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle></AlertCircle>
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-lg font-semibold">No Saved Lists</p>
                      <p className="text-sm text-muted-foreground">
                        Click the plus icon to create a new list
                      </p>
                    </div>
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center gap-2">
                  <AlertCircle></AlertCircle>
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-lg font-semibold">Login Required</p>
                    <p className="text-sm text-muted-foreground">
                      Please login to view your saved lists
                    </p>
                    <a href="/signin?redirect=%2Fbuylists">
                      <Button variant="outline" className="mt-2 w-full">
                        Continue to Log In
                      </Button>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
