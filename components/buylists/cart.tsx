import { AlertCircle } from 'lucide-react';

import { CartItem } from './modify-list-items/list-item';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle
} from '@/components/ui/sheet';
import { useUserCarts } from '@/hooks/useUserCarts';
import useBuyListStore from '@/stores/useBuylistStore';
const Cart = () => {
  const { getCurrentCart } = useUserCarts();
  const currentCart = getCurrentCart();
  const {
    setBuylistUIState,
    openCart: sheetOpen,
    setOpenCart: setSheetOpen
  } = useBuyListStore();

  const handleViewOffers = () => {
    setBuylistUIState('viewAllOffersState');
    setSheetOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasItems =
    currentCart?.cart?.items && currentCart.cart.items.length > 0;

  const cartContent = (
    <Card className="flex h-full flex-col rounded-none border">
      {/* Header - Fixed at top */}
      <CardHeader className="sticky top-0 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Your Cart</h3>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {currentCart?.cart?.name || '(No List Selected)'}
          </p>
          {hasItems && (
            <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
              {currentCart.cart.items.length} items
            </span>
          )}
        </div>
      </CardHeader>

      {/* Content - Scrollable middle section */}
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="flex flex-col pt-4">
            {hasItems ? (
              <>
                {currentCart.cart.items.map((item, index) => (
                  <div key={index}>
                    <CartItem item={item} />
                    <Separator className="my-2" />
                  </div>
                ))}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 py-8">
                <AlertCircle />
                <div className="flex flex-col items-center justify-center">
                  <p className="text-lg font-semibold">No Items</p>
                  <p className="text-sm text-muted-foreground">
                    Add items to your list to see them here
                  </p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      {/* Footer with View Offers button - Fixed at bottom */}
      {hasItems && (
        <div className="sticky bottom-0 z-10 border-t bg-card p-4 shadow-md">
          <Button
            variant="default"
            size="default"
            className="w-full"
            onClick={handleViewOffers}
          >
            View Offers
          </Button>
        </div>
      )}
    </Card>
  );

  return (
    <>
      {/* Mobile version (collapsible Sheet) - No visible trigger button, controlled by navbar */}
      <div className="lg:hidden">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetDescription className="hidden">Cart</SheetDescription>
          <SheetContent
            side="right"
            className="flex w-[85vw] flex-col p-0 sm:max-w-md"
          >
            <SheetTitle className="hidden">Cart</SheetTitle>
            {cartContent}
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop version (always visible) */}
      <div className="hidden h-full lg:block">
        <div className="h-full overflow-hidden">{cartContent}</div>
      </div>
    </>
  );
};

export default Cart;
