import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosWrapper';

import { useAuth } from '@/hooks/useAuth';
import useBuyListStore, {
  IBuylistCart,
  IBuylistCartItem
} from '@/stores/buyListStore';
import { useUserCarts } from '@/hooks/useUserCarts';

import Info from './info';
import Search from './search';
import Review from './review/review';
import Submit from './submit';
import BuylistCartSheet from './buylist-cart-sheet';

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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '../ui/dialog';
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
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetTrigger
} from '@/components/ui/sheet';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import {
  ChevronDown,
  MoreVertical,
  PlusIcon,
  ShoppingCartIcon,
  SlidersHorizontal
} from 'lucide-react';
import { Input } from '../ui/input';
import { Mode } from '@/types/buylists';
import FilterSection from '../search-ui/search-filter-container';
import SearchPagination from '../search-ui/search-pagination';

const steps = [
  { label: 'Info', mode: 'info' },
  { label: 'Search', mode: 'search' },
  { label: 'Review', mode: 'review' },
  { label: 'Submit', mode: 'submit' }
];

const modeToStep = (mode: Mode) => {
  switch (mode) {
    case 'info':
      return 0;
    case 'search':
      return 1;
    case 'review':
      return 2;
    case 'submit':
      return 3;
    default:
      return 0;
  }
};

export default function BuylistCatalog() {
  // Zustand Stores
  const {
    currentCartId,
    setCurrentCartId,
    mode,
    updateMode,
    filterOptions,
    sortBy,
    sortByOptions,
    setSortBy,
    fetchCards,
    clearFilters,
    setFilter,
    setCurrentPage,
    applyFilters,

    currentPage,
    numPages,
    setReviewData,
    setIsLoading
  } = useBuyListStore();
  const { isAuthenticated } = useAuth();
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

  //Dialogs
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [activeDialogId, setActiveDialogId] = useState<number | null>(null);
  const [newCartName, setNewCartName] = useState('');
  const [cartToDelete, setCartToDelete] = useState<any>(null);
  const [open, setOpen] = React.useState(false);
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

  // Step Animations
  const [animateToStep, setAnimateToStep] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateToStep(modeToStep(mode));
    }, 50);
    return () => clearTimeout(timer);
  }, [mode]);

  useEffect(() => {
    if (currentCartId && carts?.length) {
      const currentCart = carts.find((cart) => cart.id === currentCartId);
      if (currentCart) {
        setValue(currentCart.name);
      }
    }
  }, [currentCartId, carts]);

  return (
    <>
      <div className=" min-h-[80svh] rounded-lg ">
        <div className=" my-1 flex  flex-col  rounded-t-lg  pt-2">
          <div className="mx-auto  w-full ">
            <div className="flex items-center justify-between">
              <div className=" flex flex-grow items-center justify-between">
                {steps.map((step, index) => (
                  <div key={index} className="w-full">
                    <div className="w-full ">
                      <button
                        onClick={() => {
                          isAuthenticated
                            ? updateMode(step.mode as Mode)
                            : (updateMode('info'),
                              toast.error('Please sign in to continue'));
                        }}
                        className="flex h-7 w-full items-center justify-center font-montserrat text-sm font-medium transition-colors md:text-base"
                      >
                        {step.label}
                      </button>
                      <div className="relative h-0.5 bg-gray-500">
                        <div
                          className="absolute left-0 top-0 h-full bg-blue-500 transition-all duration-500 ease-in-out"
                          style={{
                            width: index <= animateToStep ? '100%' : '0%'
                          }}
                        />
                      </div>
                    </div>
                    {index < steps.length - 1 && <div className="hidden w-4" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {mode != 'info' && (
            <div className="flex flex-row items-center justify-between py-1">
              <span className="flex items-end ">
                <Popover open={open} onOpenChange={setOpen}>
                  <div>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[170px] justify-between border px-2"
                      >
                        <span className="truncate">
                          {value
                            ? carts?.find((cart) => cart.name === value)
                                ?.name ?? 'Select list...'
                            : 'Select list...'}
                        </span>
                        <ChevronDown className="ml-2 h-4 w-4 flex-shrink-0" />
                      </Button>
                    </PopoverTrigger>
                  </div>

                  <PopoverContent className="w-[170px] p-0">
                    <Command>
                      <CommandList>
                        <CommandEmpty>No lists found.</CommandEmpty>
                        <CommandGroup>
                          {carts?.map((cart) => (
                            <CommandItem
                              className="flex flex-row items-center justify-between px-0 pl-2"
                              key={cart.id}
                              value={cart.name}
                              onSelect={(currentValue) => {
                                setValue(currentValue);
                                setOpen(false);
                              }}
                            >
                              <span className="flex-1 truncate pr-2">
                                {cart.name}
                              </span>
                              <DropdownMenu>
                                <DropdownMenuTrigger
                                  asChild
                                  className="w-min flex-shrink-0 bg-transparent"
                                  variant={'noOutline'}
                                >
                                  <MoreVertical className="h-8 w-8 cursor-pointer" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-min">
                                  <DropdownMenuGroup>
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentCartId(cart.id);
                                        setActiveDialogId(cart.id);
                                      }}
                                    >
                                      <p>Rename</p>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setCartToDelete(cart);
                                      }}
                                    >
                                      <p className="text-red-500">Delete</p>
                                    </DropdownMenuItem>
                                  </DropdownMenuGroup>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                <Button
                  className="item w-fit  px-2"
                  onClick={() => setCreateDialogOpen(true)}
                  disabled={isCreating}
                  variant="ghost"
                >
                  <PlusIcon className=" h-5 w-5 cursor-pointer" />
                </Button>
              </span>

              {mode === 'search' && (
                <div className="hidden md:block">
                  <SearchPagination
                    currentPage={currentPage}
                    numPages={numPages}
                    fetchCards={fetchCards}
                    setCurrentPage={setCurrentPage}
                    setIsLoading={setIsLoading}
                  />
                </div>
              )}
              <div className="flex flex-row gap-1">
                {mode === 'search' && (
                  <Sheet>
                    <SheetTitle hidden>Filters</SheetTitle>
                    <SheetDescription hidden>
                      Filter your search results
                    </SheetDescription>
                    <SheetTrigger asChild className="hidden md:block">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 gap-2 text-sm font-medium"
                      >
                        <SlidersHorizontal className="h-4 w-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                      <FilterSection
                        filterOptions={filterOptions}
                        sortBy={sortBy}
                        fetchCards={fetchCards}
                        clearFilters={clearFilters}
                        setFilter={setFilter}
                        setCurrentPage={setCurrentPage}
                        applyFilters={applyFilters}
                        setSortBy={setSortBy}
                        sortByOptions={sortByOptions}
                      />
                    </SheetContent>
                  </Sheet>
                )}

                {/* Cart Sheet */}
                <Sheet
                  onOpenChange={(open) => {
                    if (!open && (mode === 'review' || mode === 'submit')) {
                      setReviewData(currentCartId);
                    }
                  }}
                >
                  <SheetTitle hidden>Cart</SheetTitle>
                  <SheetDescription hidden>View your cart</SheetDescription>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="relative mr-2 h-9"
                    >
                      <ShoppingCartIcon className=" h-4 w-4" />
                      {cartItemCount > 0 && (
                        <span className="absolute -right-2 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                          {cartItemCount}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    className="w-[1740px] max-w-[100vw] sm:max-w-[480px]"
                  >
                    <BuylistCartSheet setCurrentStep={updateMode} />
                  </SheetContent>
                </Sheet>
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
                maxLength={40}
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
                maxLength={40}
              />
              <Button
                onClick={() => {
                  if (activeDialogId) {
                    renameCart({
                      id: activeDialogId,
                      name: newCartName,
                      items: []
                    });
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

        {mode === 'info' ? (
          <Info />
        ) : mode === 'search' ? (
          <Search
            createDialogOpen={createDialogOpen}
            setCreateDialogOpen={setCreateDialogOpen}
          />
        ) : mode === 'review' ? (
          <Review setCurrentStep={updateMode} />
        ) : (
          mode === 'submit' && <Submit setCurrentStep={updateMode} />
        )}
      </div>
    </>
  );
}
