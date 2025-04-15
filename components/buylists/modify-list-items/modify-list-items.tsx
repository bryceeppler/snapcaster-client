//components
import { CurrentListHeader } from '../header/header';
import { CartItem } from './list-item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
//icons
import { AlertCircle } from 'lucide-react';
//other
import { getCurrentCart } from '../utils/utils';

export const LeftCartEditWithViewOffers = () => {
  const currentCart = getCurrentCart();

  return (
    <div className="col-span-1 flex min-h-svh w-full flex-col space-y-1 rounded-lg bg-card md:sticky md:top-[162px] md:min-h-[80svh] md:w-80">
      <div>
        <CurrentListHeader />
        <Separator className=" bg-background" />
      </div>

      <ScrollArea className="h-[75svh]" type="always">
        <div
          className={`currentCart?.cart?.items && currentCart.cart.items.length <=  0 
            mr-1 flex h-[calc(75vh-4rem)] flex-col items-center `}
        >
          <div className="w-full  px-1">
            {currentCart?.cart?.items && currentCart.cart.items.length > 0 ? (
              <>
                <Separator className="mb-2" />
                {currentCart.cart.items.map((item, index) => (
                  <div key={index}>
                    <CartItem item={item} />
                    <Separator className="my-2" />
                  </div>
                ))}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 pt-[calc(25vh-2rem)]">
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
        </div>
      </ScrollArea>
    </div>
  );
};
