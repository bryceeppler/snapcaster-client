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
import { Checkbox } from '@/components/ui/checkbox';
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
  AlertDialogTitle,
  AlertDialogTrigger
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
import useGlobalStore from '@/stores/globalStore';

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

  const {
    carts,

    createCart,

    isCreating
  } = useUserCarts();
  const [newCartName, setNewCartName] = useState('');
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
  //   useEffect(() => {
  //     if (carts?.length && !value) {
  //       setValue(carts[0].name);
  //       setCurrentCartId(carts[0].id);
  //     } else {
  //       const selectedCart = carts?.find((cart) => cart.name === value);
  //       setCurrentCartId(selectedCart?.id ?? null);
  //     }
  //   }, [value, carts]);

  useEffect(() => {
    if (currentCartId && carts?.length) {
      const currentCart = carts.find((cart) => cart.id === currentCartId);
      if (currentCart) {
        setValue(currentCart.name);
      }
    }
  }, [currentCartId, carts]);
  ///////////////////////////////////////////////////////////////////////////////////
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  return (
    <div className="col-span-1 flex h-[75vh] w-80 flex-col space-y-1 rounded-lg border bg-card">
      <div className="flex justify-between  px-1">
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
                    setCreateDialogOpen(false); // Close the dialog
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
      <div className="overflow-hidden ">
        <ScrollArea className="h-full" type="always">
          <div className="mr-1.5 px-1 ">
            <div>
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
  const { setLeftUIState, leftUIState, setCurrentCartId } = useBuyListStore();
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

  return (
    <div className="col-span-1 flex h-[75vh] w-80 flex-col space-y-1 rounded-lg border bg-card">
      <div className="flex justify-between px-1">
        <div className="flex h-10 w-16 items-center justify-start gap-1">
          {/* <span
            className="cursor-pointer"
            onClick={() => {
              setLeftUIState('leftCartListSelection');
              setCurrentCartId(null);
            }}
          >
            <p className="text-xs font-medium underline">View Lists</p>
          </span> */}
          <span
            className="flex cursor-pointer gap-0.5 rounded-lg bg-background px-1 py-1 font-medium hover:bg-background/50"
            onClick={() => {
              setLeftUIState('leftCartListSelection');
              setCurrentCartId(null);
            }}
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <p className="text-xs">Lists</p>
          </span>
        </div>
        <div className="flex w-full flex-1 items-center gap-1 overflow-hidden text-center">
          <p className="w-full truncate text-sm font-semibold">
            {currentCart?.cart?.name}
          </p>
        </div>
        <div className="flex w-16 items-center justify-end gap-1 "></div>
      </div>
      <div className="flex-1 overflow-hidden ">
        <ScrollArea className="h-full" type="always">
          <div className="mr-1.5 space-y-1  px-1 ">
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

const LeftSubmitOffer = () => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { reviewData, selectedStoreForReview } = useBuyListStore();
  const breakdownData = reviewData || [];
  const submitData = reviewData?.find(
    (store: any) => store.storeName === selectedStoreForReview
  );
  console.log('submitData', submitData);
  const { getWebsiteName } = useGlobalStore();
  return (
    <div className="col-span-1 flex h-[75vh] w-80 flex-col justify-between space-y-1 rounded-lg border bg-card px-1 py-1">
      <div className="col-span-1 space-y-2  ">
        <div className="flex items-end gap-1">
          <div>
            <img
              src="https://cdn.snapcaster.ca/icons/exorgames-icon.png"
              alt="Website"
              className="size-8"
            />
          </div>
          <div className="leading-none">
            <p>{getWebsiteName(submitData?.storeName)}</p>

            <div className="flex items-center gap-1">
              <div
                className={`h-[0.6rem] w-[0.6rem] rounded-full bg-green-500`}
              ></div>
              <p className="text-sm leading-none text-muted-foreground">
                Connected
              </p>
            </div>
          </div>
        </div>
        <div className="font-semibold leading-none">
          <p>Summary</p>
        </div>
        <div className="storeData.items.length space-y-1 text-sm font-normal leading-none">
          <div className="flex justify-between">
            <p>Cash</p>
            <p>${submitData?.cashSubtotal}</p>
          </div>
          <div className="flex justify-between">
            <p>Credit</p>
            <p>${submitData?.creditSubtotal}</p>
          </div>{' '}
          <div className="flex justify-between">
            <p>Buying</p>
            <p>
              {submitData?.items.length}/
              {submitData?.items.length +
                submitData?.unableToPurchaseItems.length}
            </p>
          </div>
        </div>
      </div>
      <div className="">
        <div className="flex  space-x-2 ">
          <div>
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked === true)}
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label
              htmlFor="terms"
              className="text-sm font-medium  peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I have read and understood{' '}
              <a href="#" className="text-primary ">
                right of cancellation
              </a>
              .
            </label>
            <p className=" text-xs text-muted-foreground">
              Please wait for a final adjusted email offer from Obsidian Games.
              If you are not dropping off your cards in person, we recommend
              recommend purchasing shipping insurance.
            </p>
            <p className=" text-xs text-muted-foreground">
              Your offer may be adjusted due to market fluctuations, misgraded
              conditions, or other discrepancies.
            </p>
          </div>
        </div>

        <div className="flex justify-between space-x-2 ">
          <Button className="h-9 w-full" disabled={!termsAccepted}>
            Request Cash
          </Button>
          <Button className="h-9 w-full" disabled={!termsAccepted}>
            Request Credit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BuylistLeftSideBodyFactory;

const ListItem = ({ cart }: { cart: IBuylistCart }) => {
  const { setLeftUIState, leftUIState, currentCartId, setCurrentCartId } =
    useBuyListStore();
  const { deleteCart, renameCart, isDeleting, isRenaming } = useUserCarts();
  const [cartToDelete, setCartToDelete] = useState<IBuylistCart | null>(null);
  const [dialogJustClosed, setDialogJustClosed] = useState(false);
  const [activeDialogId, setActiveDialogId] = useState<number | null>(null);
  const [newCartName, setNewCartName] = useState('');
  const { createCart, isCreating } = useUserCarts();

  // Add state to control dropdown open state
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div
      className=" mb-1 cursor-pointer space-y-2 rounded-lg border bg-accent px-1  py-1"
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
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete your buylist "{cartToDelete?.name}
              ". This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 pt-4">
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
                    setLeftUIState('leftCartListSelection');
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

const CartItem = ({ item }: { item: IBuylistCartItem }) => {
  const { currentCartId, leftUIState } = useBuyListStore();
  const { setAllCartsData } = useBuyListStore();
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

        <div className="flex flex-wrap items-center gap-1 text-xs font-medium capitalize text-primary">
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[0.65rem]">
            <p> {item.condition_name}</p>
          </span>
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[0.65rem]">
            <p> {item.foil}</p>
          </span>
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[0.65rem] ">
            <p> {item.rarity}</p>
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-1">
        <div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={async () => {
              if (currentCartId) {
                try {
                  // First update the cart item
                  await updateCartItem({
                    cartId: currentCartId,
                    item,
                    quantity: item.quantity + 1
                  });

                  // Wait a moment to ensure the update is processed
                  await new Promise((resolve) => setTimeout(resolve, 200));

                  // Then fetch the updated checkout data
                  if (leftUIState === 'leftCartEdit') {
                    await setAllCartsData(currentCartId);
                  }
                } catch (error) {
                  console.error('Failed to update cart:', error);
                }
              }
            }}
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
            onClick={() => {
              currentCartId &&
                updateCartItem({
                  cartId: currentCartId,
                  item,
                  quantity: Math.max(0, item.quantity - 1)
                });
              if (leftUIState === 'leftCartEdit') {
                setAllCartsData(currentCartId);
              }
            }}
          >
            <MinusIcon className="h-5 w-5"></MinusIcon>
          </Button>
        </div>
      </div>
    </div>
  );
};
