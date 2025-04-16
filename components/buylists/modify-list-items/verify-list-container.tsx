import { CartItem } from './list-item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle } from 'lucide-react';
import { getCurrentCart } from '../utils/utils';

export const VerifyListContainer = () => {
  const currentCart = getCurrentCart();

  return (
    <div className="h-full">
      <ScrollArea className="h-full" type="always">
        <div
          className={`mr-2.5 flex h-full flex-col items-center ${
            currentCart?.cart?.items &&
            currentCart.cart.items.length <= 0 &&
            'pt-[calc(25vh-2rem)]'
          }`}
        >
          <div className="w-full ">
            {currentCart?.cart?.items && currentCart.cart.items.length > 0 ? (
              <div className=" space-y-1">
                {currentCart.cart.items.map((item: any, index) => (
                  <div key={index} className="bg-card p-2">
                    <CartItem item={item} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2">
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
