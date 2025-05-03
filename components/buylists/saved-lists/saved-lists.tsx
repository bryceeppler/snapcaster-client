import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserCarts } from '@/hooks/useUserCarts';
import { ListItem } from './saved-list-item';
import { SelectSeparator } from '@/components/ui/select';
import { ListSelectionHeader } from '../header/header';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export const LeftCartListSelection = () => {
  const { carts } = useUserCarts();
  const { isAuthenticated } = useAuth();
  return (
    <div className="col-span-1 flex h-full w-full flex-col rounded-lg bg-card">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-card">
        <ListSelectionHeader />
        <SelectSeparator className="my-0 bg-background" />
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" type="always">
          <div className="flex w-full flex-col items-center px-2 py-1">
            {isAuthenticated ? (
              carts && carts.length > 0 ? (
                carts.map((cart, index) => (
                  <span key={index} className="w-full">
                    <ListItem key={cart.id} cart={cart} />
                  </span>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-16">
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
              <div className="flex flex-col items-center justify-center gap-2 py-16">
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
        </ScrollArea>
      </div>
    </div>
  );
};
