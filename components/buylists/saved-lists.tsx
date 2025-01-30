import { useState } from 'react';
import useBuyListStore from '@/stores/buyListStore';
import CardImage from '../ui/card-image';
import { ScrollArea } from '../ui/scroll-area';
import { MinusIcon, PlusIcon, SquarePen } from 'lucide-react';
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

export default function SavedLists() {
  const {
    updateCartItemPending,
    updateCartItemAPI,
    currentCart,
    currentCartData,
    setCurrentCart,
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

  return (
    <>
      <div className="min-h-svh-80  mb-8 ">
        <div className="mb-1 flex flex-col gap-1 rounded-lg border bg-popover px-2 py-1">
          {/* <div className=" text-center text-lg font-medium">
            Your Saved Carts
          </div> */}
          <div>
            <Select
              value={currentCart?.id?.toString()}
              onValueChange={(value) => {
                const selectedCart = carts.find(
                  (cart: any) => cart.id.toString() === value
                );
                setCurrentCart(selectedCart);
              }}
            >
              <SelectTrigger className="border-grey-500 w-full  bg-popover focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="Please Select a List" />
              </SelectTrigger>
              <SelectContent>
                {carts &&
                  carts.map((cart: any) => (
                    <SelectItem key={cart.id} value={cart.id.toString()}>
                      {cart.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild className="focus:ring-0 ">
                <Button className="   w-full gap-2 border  " variant={'ghost'}>
                  <PlusIcon className="size-5" />
                  Create New Cart
                </Button>
              </DialogTrigger>

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
              <DialogTrigger asChild className="focus:ring-0 ">
                <Button
                  className="   w-full gap-2 border  "
                  variant={'ghost'}
                  disabled={!currentCart}
                >
                  <SquarePen className="size-5" />
                  Edit Cart
                </Button>
              </DialogTrigger>
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
          </div>
        </div>

        <div className="rounded-lg border bg-popover px-3 py-1">
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
        </div>
      </div>
    </>
  );
}
