import { useState } from 'react';
import useBuyListStore, { IBuylistCart } from '@/stores/buyListStore';
import CardImage from '../ui/card-image';
import { ScrollArea } from '../ui/scroll-area';
import { MinusIcon, PlusIcon, SquarePen, Trash } from 'lucide-react';
import { useDebounceCallback } from 'usehooks-ts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';
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
  const {
    updateCartItemPending,
    updateCartItemAPI,
    currentCart,
    currentCartData,
    setCurrentCart,
    getCartData,
    carts,
    deleteCart,
    renameCart,
    createCart
  } = useBuyListStore();

  const [activeDialogId, setActiveDialogId] = useState<number | null>(null);
  const [newCartName, setNewCartName] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const debouncedApiCall = useDebounceCallback(updateCartItemAPI, 500);
  const handleUpdateQuantity = (card: any, quantity: number) => {
    updateCartItemPending(card, quantity);
    debouncedApiCall(card, quantity);
  };
  const [cartToDelete, setCartToDelete] = useState<any>(null);

  return (
    <>
      <div className="min-h-svh-80  mb-8 ">
        {carts && carts.length === 0 && (
          <div className="my-8 flex flex-col items-center justify-center">
            <h3 className="text-2xl font-bold">You have no saved buylists</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Here you can create and manage your saved buylists. Create a
              buylist to get started!
            </p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              Create new list
            </Button>
          </div>
        )}
        {carts && carts.length > 0 && (
          <div className="mb-1 flex flex-col gap-4 px-2 py-1">
            <div className="flex flex-row items-center justify-end">
              <Button
                className="w-fit"
                onClick={() => setCreateDialogOpen(true)}
              >
                <PlusIcon className="mr-2 h-4 w-4" /> New List
              </Button>
            </div>
            <div className="flex flex-col gap-4">
              {carts.map((cart: IBuylistCart) => (
                <div
                  key={cart.id}
                  className="flex flex-col rounded border bg-popover"
                >
                  <div
                    className="flex cursor-pointer flex-row items-center justify-between border-b p-3 transition-all duration-300 hover:bg-background/30"
                    onClick={() => {
                      setCurrentCart(cart);
                      setCurrentStep(1);
                    }}
                  >
                    <span className="font-medium">{cart.name}</span>
                    <div className="flex flex-row gap-2">
                      <Button
                        size="icon"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentCart(cart);
                          setActiveDialogId(cart.id);
                        }}
                      >
                        <SquarePen className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 p-0"
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
                            cart.items?.length ? 'hover:no-underline cursor-pointer' : 'cursor-default hover:no-underline [&>svg]:hidden'
                          }`}
                          onClick={(e) => cart.items?.length && e.stopPropagation()}
                          disabled={!cart.items?.length}
                        >
                          <span className="text-sm text-popover-foreground transition-colors group-hover:text-primary">
                            {cart.items?.length || 0} items
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
              {/* <Select
                value={currentCart?.id?.toString()}
                onValueChange={(value) => {
                  const selectedCart = carts.find(
                    (cart: any) => cart.id.toString() === value
                  );
                  setCurrentCart(selectedCart);
                }}
              >
                <SelectTrigger className="border-grey-500 w-full  bg-popover focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="Select a list" />
                </SelectTrigger>
                <SelectContent>
                  {carts.map((cart: any) => (
                    <SelectItem key={cart.id} value={cart.id.toString()}>
                      {cart.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select> */}
            </div>
            <div className="flex gap-2"></div>
          </div>
        )}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className=" max-w-sm md:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Cart</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <Input
                placeholder="Cart name"
                value={newCartName}
                onChange={(e) => setNewCartName(e.target.value)}
              />
              <Button
                onClick={async () => {
                  if (newCartName) {
                    await createCart(newCartName);
                    setNewCartName('');
                    setCreateDialogOpen(false);
                  }
                }}
              >
                Create
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog
          open={currentCart ? activeDialogId === currentCart.id : false}
          onOpenChange={(open) => {
            if (open && currentCart) {
              setActiveDialogId(currentCart.id);
              setNewCartName(currentCart.name);
            } else {
              setActiveDialogId(null);
              setNewCartName('');
            }
          }}
        >
          <DialogContent className="max-w-sm md:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-center">
                {currentCart?.name}
              </DialogTitle>
            </DialogHeader>
            <Input
              placeholder="New Cart Name"
              value={newCartName}
              onChange={(e) => setNewCartName(e.target.value)}
            />
            <div className="mt-2 flex justify-between gap-2">
              <Button
                disabled={!newCartName || newCartName === currentCart?.name}
                onClick={async () => {
                  if (newCartName && currentCart) {
                    const success = await renameCart({
                      id: currentCart.id,
                      name: newCartName
                    });
                    if (success) {
                      setNewCartName('');
                      setActiveDialogId(null);
                    }
                  }
                }}
              >
                Rename Cart
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  await deleteCart(currentCart.id);
                  setActiveDialogId(null);
                }}
              >
                Delete Cart
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* <div className="rounded-lg border bg-popover px-3 py-1">
          <h1 className="text-center text-2xl font-bold"></h1>

          <ScrollArea className="h-[70svh]">
            <div className="grid gap-1 md:grid-cols-2">
              {currentCart &&
                currentCartData &&
                currentCartData.map((item: any, index: any) => (
                  <div key={index} className=" my-2 flex flex-row gap-3 ">
                    <div className="w-20  min-w-20">
                      <CardImage imageUrl={item.image} alt={item.card_name} />
                    </div>

                    <div className="flex flex-col justify-between ">
                      <div>
                        <p>
                          {item.card_name} ({item.condition_name})
                        </p>

                        <p className="text-sm capitalize text-muted-foreground">
                          {item.set_name}: {item.rarity}, {item.foil}
                        </p>
                      </div>
                      <p
                        className="w-min cursor-pointer text-sm font-normal underline"
                        onClick={() => handleUpdateQuantity(item, 0)}
                      >
                        Remove
                      </p>
                      <div className="grid h-9 w-28 grid-cols-3 items-center rounded-lg border px-2">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item, item.quantity - 1)
                          }
                          className="flex justify-center"
                        >
                          <MinusIcon></MinusIcon>
                        </button>

                        <p className="text-center font-mono">{item.quantity}</p>

                        <button
                          onClick={() =>
                            handleUpdateQuantity(item, item.quantity + 1)
                          }
                          className="flex justify-center"
                        >
                          <PlusIcon></PlusIcon>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </ScrollArea>
        </div> */}
      </div>
      <AlertDialog
        open={!!cartToDelete}
        onOpenChange={(open) => !open && setCartToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the list "{cartToDelete?.name}" and
              all its contents. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (cartToDelete) {
                  await deleteCart(cartToDelete.id);
                  setCartToDelete(null);
                }
              }}
            >
              Delete List
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
