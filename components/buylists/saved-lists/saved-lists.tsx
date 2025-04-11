//hooks and store states
import React from 'react';
import { useState } from 'react';
import useBuyListStore from '@/stores/useBuylistStore';
import { useUserCarts } from '@/hooks/useUserCarts';
//components
import { ListItem } from './saved-list-item';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
//icons
import { PlusIcon } from 'lucide-react';

export const LeftCartListSelection = () => {
  const { setLeftUIState } = useBuyListStore();
  const { carts, createCart, isCreating } = useUserCarts();
  const [newCartName, setNewCartName] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  return (
    <div className="col-span-1 flex h-[75vh] w-full flex-col space-y-1 rounded-lg border bg-card md:w-80 ">
      <span className="hidden md:block">
        <ListSelectionHeader />
      </span>

      {/* <div className=" flex  justify-between px-1">
        <div className="flex h-10 w-16 items-center justify-start gap-1"></div>
        <div className="flex items-center gap-1">
          <p className="truncate text-sm font-semibold"> Saved Lists</p>
        </div>
        <div className="flex w-16 items-center justify-end gap-1 ">
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild onClick={() => setCreateDialogOpen(true)}>
              <PlusIcon className="h-6 w-6 cursor-pointer" />
            </DialogTrigger>
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
                  onClick={() => {
                    createCart(newCartName);
                    setNewCartName('');
                    setCreateDialogOpen(false);
                    setLeftUIState('leftCartEditWithViewOffers');
                  }}
                  disabled={isCreating || !newCartName.trim()}
                >
                  {isCreating ? 'Creating...' : 'Create'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div> */}
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

export const ListSelectionHeader = () => {
  const { setLeftUIState } = useBuyListStore();
  const { carts, createCart, isCreating } = useUserCarts();
  const [newCartName, setNewCartName] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  return (
    <div className=" flex justify-between bg-card px-1">
      <div className="flex h-10 w-16 items-center justify-start gap-1"></div>
      <div className="flex items-center gap-1">
        <p className="truncate text-sm font-semibold"> Saved Lists</p>
      </div>
      <div className="flex w-16 items-center justify-end gap-1 ">
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild onClick={() => setCreateDialogOpen(true)}>
            <PlusIcon className="h-6 w-6 cursor-pointer" />
          </DialogTrigger>
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
                onClick={() => {
                  createCart(newCartName);
                  setNewCartName('');
                  setCreateDialogOpen(false);
                  setLeftUIState('leftCartEditWithViewOffers');
                }}
                disabled={isCreating || !newCartName.trim()}
              >
                {isCreating ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
