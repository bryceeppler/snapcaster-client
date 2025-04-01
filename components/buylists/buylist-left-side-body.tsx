import useBuyListStore, {
  IBuylistCart,
  IBuylistCartItem,
  LeftUIState
} from '@/stores/useBuylistStore';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import {
  MixerHorizontalIcon,
  QuestionMarkCircledIcon,
  PlusIcon,
  MinusIcon
} from '@radix-ui/react-icons';
import {
  ArrowLeftIcon,
  CheckCircle,
  Minus,
  MoreVertical,
  Plus,
  Trash2
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosWrapper';
import { useEffect, useState } from 'react';
import React from 'react';
import { useUserCarts } from '@/hooks/useUserCarts';
import { Badge } from '../ui/badge';
import CardImage from '../ui/card-image';
import { useCartItems } from '@/hooks/useCartItems';
import { Separator } from '../ui/separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList
} from '@/components/ui/command';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '../ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';
import { Label } from '../ui/label';

// Define a props interface
interface BuylistLeftSideBodyProps {
  leftUIState: LeftUIState;
}

// Update the component to use props
const BuylistLeftSideBodyFactory = ({
  leftUIState
}: BuylistLeftSideBodyProps) => {
  switch (leftUIState) {
    case 'leftCartListSelection':
      return <LeftCartListSelection />;
    case 'leftCartEditWithViewOffers':
      return <LeftCartEditWithViewOffers />;
    case 'leftCartEdit':
      return <LeftCartEditWithViewOffers />;
    case 'leftSubmitOffer':
      return <LeftSubmitOffer />;
    default:
      return null; // Add a default case
  }
};

const LeftCartListSelection = () => {
  const { setLeftUIState, currentCartId, setCurrentCartId } = useBuyListStore();

  ///////////////////////////////////////////////////////////////////////////////////

  const { carts } = useUserCarts();

  //Dialogs

  const [value, setValue] = React.useState('');

  //Update Current Cart
  const CART_KEY = (cartId: number) => ['cart', cartId] as const;
  const { data: currentCart } = useQuery<{
    success: boolean;
    cart: IBuylistCart;
  } | null>({
    queryKey: CART_KEY(currentCartId || 0),
    queryFn: async () => {
      if (!currentCartId) return null;
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_BUYLISTS_URL}/v2/carts/${currentCartId}`
      );
      return response.data;
    },
    enabled: !!currentCartId
  });
  const cartItemCount =
    currentCart?.cart?.items?.reduce(
      (total: number, item: IBuylistCartItem) => total + item.quantity,
      0
    ) || 0;
  useEffect(() => {
    if (carts?.length && !value) {
      setValue(carts[0].name);
      setCurrentCartId(carts[0].id);
    } else {
      const selectedCart = carts?.find((cart) => cart.name === value);
      setCurrentCartId(selectedCart?.id ?? null);
    }
  }, [value, carts]);

  useEffect(() => {
    if (currentCartId && carts?.length) {
      const currentCart = carts.find((cart) => cart.id === currentCartId);
      if (currentCart) {
        setValue(currentCart.name);
      }
    }
  }, [currentCartId, carts]);
  ///////////////////////////////////////////////////////////////////////////////////

  return (
    <div className="col-span-1 flex h-[75vh] w-80 flex-col space-y-1 rounded-lg border bg-card">
      <div className="flex justify-between border-b px-1">
        <div className="flex h-10 w-16 items-center justify-start gap-1"></div>
        <div className="flex items-center gap-1">
          <p className="truncate text-sm font-semibold">List Selection</p>
        </div>
        <div className="flex w-16 items-center justify-end gap-1 ">
          <PlusIcon className="h-6 w-6 cursor-pointer" />
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" type="always">
          <div className="mr-1.5 space-y-2 px-1 ">
            <div className="space-y-6">
              {carts?.map((cart, index) => (
                // <p key={index}>{cart.name}</p>
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

const LeftCartEditWithViewOffers = () => {
  const { setLeftUIState, leftUIState } = useBuyListStore();
  const { currentCartId } = useBuyListStore();
  const { carts } = useUserCarts();
  //Update Current Cart
  const CART_KEY = (cartId: number) => ['cart', cartId] as const;
  const { data: currentCart } = useQuery<{
    success: boolean;
    cart: IBuylistCart;
  } | null>({
    queryKey: CART_KEY(currentCartId || 0),
    queryFn: async () => {
      if (!currentCartId) return null;
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_BUYLISTS_URL}/v2/carts/${currentCartId}`
      );
      return response.data;
    },
    enabled: !!currentCartId
  });
  useEffect(() => {
    console.log(currentCart);
  }, [currentCart]);
  return (
    <div className="col-span-1 flex h-[75vh] w-80 flex-col space-y-1 rounded-lg border bg-card">
      <div className="flex justify-between  px-1">
        <div className="flex h-10 w-16 items-center justify-start gap-1">
          {leftUIState === 'leftCartEdit' ? (
            <span
              className="flex cursor-pointer gap-0.5 rounded-lg  bg-background px-1 py-1 font-medium hover:bg-background/50"
              onClick={() => {
                setLeftUIState('leftCartListSelection');
              }}
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <p className="text-xs ">Back</p>
            </span>
          ) : (
            <span
              className="cursor-pointer"
              onClick={() => {
                setLeftUIState('leftCartListSelection');
              }}
            >
              <p className="text-xs font-medium underline">View Lists</p>
            </span>
          )}
        </div>
        <div className="flex w-full flex-1 items-center gap-1 overflow-hidden text-center">
          <p className="w-full truncate text-sm font-semibold">
            {currentCart?.cart?.name}
          </p>
        </div>
        <div className="flex w-16 items-center justify-end gap-1 "></div>
      </div>
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" type="always">
          <div className="mr-1.5 space-y-1 px-1 ">
            {currentCart?.cart?.items?.map((item, index) => (
              <div key={index}>
                <CartItem item={item} />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      {leftUIState === 'leftCartEditWithViewOffers' && (
        <div className=" ">
          <Button
            className="w-full rounded-t-none"
            onClick={() => {
              setLeftUIState('leftCartEdit');
            }}
          >
            View Offers
          </Button>
        </div>
      )}
    </div>
  );
};

const LeftCartEdit = () => {
  return <div>LeftCartEdit</div>;
};

const LeftSubmitOffer = () => {
  return <div>LeftSubmitOffer</div>;
};

export default BuylistLeftSideBodyFactory;

const ListItem = ({ cart }: { cart: IBuylistCart }) => {
  const { setLeftUIState, setCurrentCartId, currentCartId } = useBuyListStore();
  const [cartToDelete, setCartToDelete] = useState<any>(null);
  const [activeDialogId, setActiveDialogId] = useState<number | null>(null);
  const [newCartName, setNewCartName] = useState('');
  const {
    createCart,
    deleteCart,
    renameCart,
    isCreating,
    isDeleting,
    isRenaming
  } = useUserCarts();

  // Add this state to track if a dialog was just closed
  const [dialogJustClosed, setDialogJustClosed] = useState(false);

  // Add state to control dropdown open state
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div
      className=" cursor-pointer space-y-2 rounded-lg border bg-background px-1 py-1"
      onClick={() => {
        // Only navigate if no dialog was just closed
        if (!dialogJustClosed) {
          setLeftUIState('leftCartEditWithViewOffers');
          setCurrentCartId(cart.id);
        }
      }}
    >
      <div className="flex justify-between">
        <p className="text-sm font-semibold ">{cart.name}</p>
        <CheckCircle className="h-4 w-4 text-zinc-400"></CheckCircle>
      </div>
      <div className="flex justify-between">
        {/* Rename Cart Dialog */}
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger
            asChild
            className="w-min flex-shrink-0 bg-transparent"
            variant={null}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs font-semibold text-zinc-400 underline hover:text-primary">
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
                  setCartToDelete(cart);
                  setDropdownOpen(false); // Close the dropdown
                }}
              >
                <p className="text-red-500">Delete</p>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <p className="text-xs font-semibold text-zinc-400">
          {cart.items.length} items
        </p>
      </div>

      {/* Move the Dialog outside the DropdownMenu */}
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
              onKeyDown={(e) => e.stopPropagation()} // Needed to capture typing due to the dialog component being nexted in the drop down component
              maxLength={20}
            />
            <Button
              onClick={() => {
                if (activeDialogId) {
                  renameCart({
                    id: cart.id,
                    name: newCartName,
                    items: []
                  });
                  setNewCartName('');
                  setActiveDialogId(null);
                  setLeftUIState('leftCartEditWithViewOffers');
                  setCurrentCartId(cart.id);
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
        onOpenChange={(open: boolean) => !open && setCartToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your buylist "{cartToDelete?.name}
              ". This action cannot be undone.
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
    </div>
  );
};

const CartItem = ({ item }: { item: IBuylistCartItem }) => {
  const { currentCartId } = useBuyListStore();
  const { updateCartItem } = useCartItems(currentCartId || undefined);
  return (
    <div className="flex items-center rounded-lg border px-1 py-1 ">
      <div>
        <img
          className="w-20 object-contain"
          src={item.image}
          alt="card_image"
        />
      </div>
      <div className="flex w-full flex-col gap-0.5  space-y-1 px-0.5">
        <p className="text-[0.6rem] text-xs font-semibold uppercase   leading-none text-muted-foreground">
          {item.set_name}
        </p>

        <p className="text-[0.70rem] text-xs font-semibold leading-none">
          {item.card_name}
        </p>

        <div className="flex flex-wrap items-center gap-1 text-xs font-medium text-primary">
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[0.65rem]">
            <p> {item.condition_name}</p>
          </span>
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[0.65rem]">
            <p> {item.foil ? 'Foil' : 'Non-Foil'}</p>
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-1">
        <div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() =>
              currentCartId &&
              updateCartItem({
                cartId: currentCartId,
                item,
                quantity: item.quantity + 1
              })
            }
          >
            <Plus className="h-5 w-5" />
          </Button>
          {/* <PlusIcon className="h-5 w-5 cursor-pointer"></PlusIcon> */}
        </div>
        <div>
          <p className="text-xs">{item.quantity}</p>
        </div>
        <div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() =>
              currentCartId &&
              updateCartItem({
                cartId: currentCartId,
                item,
                quantity: Math.max(0, item.quantity - 1)
              })
            }
          >
            <MinusIcon className="h-5 w-5"></MinusIcon>
          </Button>
        </div>
      </div>
    </div>
  );
};
