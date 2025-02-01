import { useState } from 'react';
import useBuyListStore from '@/stores/buyListStore';
import { useUserCarts } from '@/hooks/useUserCarts';
import { PlusIcon, SquarePen, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

export default function SavedLists({
  setCurrentStep
}: {
  setCurrentStep: (step: number) => void;
}) {
  const { currentCartId, setCurrentCartId } = useBuyListStore();

  const {
    carts,
    isLoading,
    createCart,
    deleteCart,
    renameCart,
    isCreating,
    isDeleting,
    isRenaming
  } = useUserCarts();

  const [activeDialogId, setActiveDialogId] = useState<number | null>(null);
  const [newCartName, setNewCartName] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [cartToDelete, setCartToDelete] = useState<any>(null);

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="text-muted-foreground">Loading carts...</div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-svh-80 sm:container">
        {carts && carts.length === 0 && (
          <div className="my-8 flex flex-col items-center justify-center">
            <h3 className="text-2xl font-bold">You have no saved buylists</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Here you can create and manage your saved buylists. Create a
              buylist to get started!
            </p>
            <Button
              onClick={() => setCreateDialogOpen(true)}
              disabled={isCreating}
            >
              {isCreating ? 'Creating...' : 'Create new list'}
            </Button>
          </div>
        )}
        {carts && carts.length > 0 && (
          <div className="mb-1 flex flex-col gap-4 py-1">
            <div className="flex flex-row items-center justify-end">
              <Button
                className="w-fit"
                onClick={() => setCreateDialogOpen(true)}
                disabled={isCreating}
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                {isCreating ? 'Creating...' : 'New List'}
              </Button>
            </div>
            <div className="flex flex-col gap-4">
              {carts.map((cart) => (
                <div
                  key={cart.id}
                  className="flex flex-col rounded border bg-popover"
                >
                  <div
                    className="flex flex-row items-center justify-between border-b p-3"

                  >
                    <span className="font-medium">{cart.name}</span>
                    <div className="flex flex-row gap-2">
                      <Button 
                                            onClick={() => {
                                              setCurrentCartId(cart.id);
                                              setCurrentStep(1);
                                            }}
                        >Select</Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentCartId(cart.id);
                          setActiveDialogId(cart.id);
                        }}
                      >
                        <SquarePen className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCartToDelete(cart);
                        }}
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                  <div className="p-3">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="items" className="border-none">
                        <AccordionTrigger
                          className={`group flex items-center gap-2 py-0 ${
                            cart.items?.length
                              ? 'cursor-pointer hover:no-underline'
                              : 'cursor-default hover:no-underline [&>svg]:hidden'
                          }`}
                          onClick={(e) =>
                            cart.items?.length && e.stopPropagation()
                          }
                          disabled={!cart.items?.length}
                        >
                          <span className="text-sm text-popover-foreground transition-colors group-hover:text-primary">
                            {cart.items?.reduce(
                              (acc, item) => acc + item.quantity,
                              0
                            ) || 0}{' '}
                            items
                          </span>
                          {cart.items?.length > 0 && (
                            <span className="text-xs text-popover-foreground transition-colors group-hover:text-primary/50">
                              (click to view)
                            </span>
                          )}
                        </AccordionTrigger>
                        <AccordionContent className="pb-0">
                          <div className="mt-2 space-y-2 rounded-lg bg-background p-2 text-sm text-muted-foreground">
                            {cart.items
                              ?.slice(0, 20)
                              .map((item, index: number) => (
                                <div
                                  key={index}
                                  className="flex flex-col pl-2 text-foreground"
                                >
                                  <span>
                                    {item.quantity} x {item.card_name} (
                                    {item.condition_name}){' '}
                                    {item.foil ? '(Foil)' : ''}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {item.set_name}
                                  </span>
                                </div>
                              ))}
                            {cart.items && cart.items.length > 20 && (
                              <div className="pl-2 italic text-muted-foreground/50">
                                ...and {cart.items.length - 20} more
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create Cart Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
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
            />
            <Button
              onClick={() => {
                createCart(newCartName);
                setCreateDialogOpen(false);
                setNewCartName('');
              }}
              disabled={isCreating || !newCartName.trim()}
            >
              {isCreating ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rename Cart Dialog */}
      <Dialog
        open={!!activeDialogId}
        onOpenChange={(open) => !open && setActiveDialogId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Buylist</DialogTitle>
            <DialogDescription>
              Enter a new name for your buylist.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input
              placeholder="Enter new buylist name"
              value={newCartName}
              onChange={(e) => setNewCartName(e.target.value)}
            />
            <Button
              onClick={() => {
                if (activeDialogId) {
                  renameCart({ id: activeDialogId, name: newCartName, items: [] });
                  setActiveDialogId(null);
                  setNewCartName('');
                }
              }}
              disabled={isRenaming || !newCartName.trim()}
            >
              {isRenaming ? 'Renaming...' : 'Rename'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Cart Dialog */}
      <AlertDialog
        open={!!cartToDelete}
        onOpenChange={(open) => !open && setCartToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your buylist "{cartToDelete?.name}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (cartToDelete) {
                  deleteCart(cartToDelete.id);
                  if (currentCartId === cartToDelete.id) {
                    setCurrentCartId(null);
                  }
                  setCartToDelete(null);
                }
              }}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
