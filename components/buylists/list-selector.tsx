import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { ListItem } from './saved-lists/saved-list-item';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle
} from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';
import { useUserCarts } from '@/hooks/useUserCarts';
import useBuyListStore from '@/stores/useBuylistStore';

const ListSelector = () => {
  const { carts } = useUserCarts();
  const { isAuthenticated } = useAuth();
  const { createCart, isCreating } = useUserCarts();
  const {
    setBuylistUIState,
    openListSelection: sheetOpen,
    setOpenListSelection: setSheetOpen
  } = useBuyListStore();
  const [newCartName, setNewCartName] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const handleCreateNewList = () => {
    createCart(newCartName);
    setNewCartName('');
    setCreateDialogOpen(false);
    setBuylistUIState('searchResultsState');
    setSheetOpen(false);
  };

  const listContent = (
    <Card className="flex h-full flex-col rounded-none border">
      {/* Header */}
      <CardHeader className="sticky top-0 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Saved Lists</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Select a list to view or create a new one
        </p>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="flex flex-col space-y-2 pt-4">
            {isAuthenticated ? (
              carts && carts.length > 0 ? (
                carts.map((cart, index) => (
                  <span key={index} onClick={() => setSheetOpen(false)}>
                    <ListItem key={cart.id} cart={cart} />
                  </span>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-8">
                  <AlertCircle />
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-lg font-semibold">No Saved Lists</p>
                    <p className="text-sm text-muted-foreground">
                      Click the plus icon to create a new list
                    </p>
                  </div>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 py-8">
                <AlertCircle />
                <div className="flex flex-col items-center justify-center">
                  <p className="text-lg font-semibold">Login Required</p>
                  <p className="text-sm text-muted-foreground">
                    Please login to view your saved lists
                  </p>
                  <Link href="/signin?redirect=%2Fbuylists">
                    <Button variant="outline" className="mt-2 w-full">
                      Continue to Log In
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <div className="sticky bottom-0 border-t bg-card p-4 shadow-md">
          <DialogTrigger asChild onClick={() => setCreateDialogOpen(true)}>
            <Button className="w-full" disabled={!isAuthenticated}>
              New List
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Create New Buylist</DialogTitle>
            <DialogDescription>
              Enter a name for your new buylist.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input
              placeholder="Enter buylist name"
              value={newCartName}
              onChange={(e) => setNewCartName(e.target.value)}
              maxLength={20}
            />
            <Button
              onClick={handleCreateNewList}
              disabled={isCreating || !newCartName.trim()}
            >
              {isCreating ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );

  return (
    <>
      {/* Mobile version (collapsible Sheet) */}
      <div className="lg:hidden">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTitle hidden>My Lists</SheetTitle>
          <SheetDescription hidden>
            Select a list to view or create a new one
          </SheetDescription>
          <SheetContent side="left" className="w-[85vw] p-0 sm:max-w-md">
            {listContent}
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop version (always visible) */}
      <div className="hidden h-full lg:block">
        <div className="h-full overflow-hidden">{listContent}</div>
      </div>
    </>
  );
};

export default ListSelector;
