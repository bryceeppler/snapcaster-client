//hooks and store states
import { useState } from 'react';
import useBuyListStore, { IBuylistCart } from '@/stores/useBuylistStore';
import { useUserCarts } from '@/hooks/useUserCarts';
//components
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
//icons
import { CheckCircle } from 'lucide-react';

export const ListItem = ({ cart }: { cart: IBuylistCart }) => {
  const { setBuylistUIState, currentCartId, setCurrentCartId, setCurrentCart } =
    useBuyListStore();
  const { deleteCart, renameCartMutation, isDeleting, isRenaming } =
    useUserCarts();
  const [newCartName, setNewCartName] = useState('');
  //Popup Dialog states (For edit name and delete)
  const [cartToDelete, setCartToDelete] = useState<IBuylistCart | null>(null);
  const [dialogJustClosed, setDialogJustClosed] = useState(false);
  const [activeDialogId, setActiveDialogId] = useState<number | null>(null);
  //Dropdown Menu State on the edit button
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div
      className=" mb-1 flex h-14 cursor-pointer flex-col  justify-between rounded-lg border bg-accent px-1 py-1 shadow-sm hover:bg-accent/50"
      onClick={() => {
        if (!dialogJustClosed) {
          setBuylistUIState('searchResultsState');
          setCurrentCartId(cart.id);
          setCurrentCart(cart);
        }
      }}
    >
      <div className="flex justify-between">
        <p className="text-sm font-normal ">{cart.name}</p>
      </div>
      <div className="flex justify-between">
        {/* Rename Cart Dialog */}
        <p className="text-xs font-semibold text-zinc-400">
          {cart.items.length} items
        </p>
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger
            asChild
            className="w-min flex-shrink-0 bg-transparent"
            variant={null}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs font-semibold  text-zinc-400 underline hover:text-primary">
              Edit
            </p>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-min"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setActiveDialogId(cart.id);
                  setDropdownOpen(false); // Close the dropdown
                }}
              >
                <p>Rename</p>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setCartToDelete(cart);
                  setDropdownOpen(false); // Close the dropdown
                }}
              >
                <p className="text-red-500">Delete</p>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* Rename List Dialog */}
      <Dialog
        open={activeDialogId === cart.id}
        onOpenChange={(open) => {
          if (!open) {
            setActiveDialogId(null);
            // Set this flag when dialog closes
            setDialogJustClosed(true);
            // Reset the flag after a short delay
            setTimeout(() => {
              setDialogJustClosed(false);
            }, 100);
          }
        }}
      >
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Edit List Name</DialogTitle>
            <DialogDescription>
              Change the name of your list below:
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input
              placeholder="Enter new list name..."
              value={newCartName}
              onChange={(e) => setNewCartName(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()} // Needed to capture typing due to the dialog component being nexted in the drop down component
              maxLength={25}
            />
            <Button
              onClick={async () => {
                if (activeDialogId) {
                  try {
                    await renameCartMutation.mutateAsync({
                      id: cart.id,
                      name: newCartName,
                      items: []
                    });
                    setNewCartName('');
                    setActiveDialogId(null);
                    setBuylistUIState('searchResultsState');
                    setCurrentCartId(cart.id);
                    setCurrentCart(cart);
                  } catch (error) {
                    setNewCartName('');
                    setActiveDialogId(null);
                  }
                }
              }}
              disabled={isRenaming || !newCartName.trim()}
            >
              {isRenaming ? 'Renaming...' : 'Rename'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Delete List Dialog */}
      <Dialog
        open={!!cartToDelete}
        onOpenChange={(open) => {
          if (!open) {
            setCartToDelete(null);
            // Set this flag when dialog closes
            setDialogJustClosed(true);
            // Reset the flag after a short delay
            setTimeout(() => {
              setDialogJustClosed(false);
            }, 100);
          }
        }}
      >
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Delete List</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete "{cartToDelete?.name}
              "? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 ">
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                setCartToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                if (cartToDelete) {
                  deleteCart(cartToDelete.id);
                  if (currentCartId === cartToDelete.id) {
                    setCurrentCartId(null);
                    setCurrentCart(null);
                    setBuylistUIState('listSelectionState');
                  }
                  setCartToDelete(null);
                }
              }}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
