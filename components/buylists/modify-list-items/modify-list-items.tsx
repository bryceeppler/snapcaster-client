//hooks and store states
import useBuyListStore, { IBuylistCart } from '@/stores/useBuylistStore';
import { useQuery } from '@tanstack/react-query';
//components
import { CurrentListHeader } from '../header/header';
import { CartItem } from './list-item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
//icons
import { AlertCircle } from 'lucide-react';
//other
import axiosInstance from '@/utils/axiosWrapper';

export const LeftCartEditWithViewOffers = () => {
  const CART_KEY = (cartId: number) => ['cart', cartId] as const;
  const { currentCartId } = useBuyListStore();
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
    <div className="col-span-1 flex h-[75vh] w-full flex-col space-y-1 rounded-lg bg-card  md:w-80">
      <div>
        <CurrentListHeader />
        <Separator className=" bg-background" />
      </div>

      <div className="flex-1 overflow-hidden rounded-lg bg-card">
        <ScrollArea className="h-full" type="always">
          <div
            className={`flex h-[calc(75vh-4rem)] flex-col items-center ${
              currentCart?.cart?.items && currentCart.cart.items.length > 0
                ? ''
                : 'pt-[calc(25vh-2rem)]'
            }`}
          >
            <div className="w-full px-1">
              {currentCart?.cart?.items && currentCart.cart.items.length > 0 ? (
                <>
                  <Separator className="mb-2" />
                  {currentCart.cart.items.map((item, index) => (
                    <div key={index}>
                      <CartItem item={item} />
                      <Separator className="mb-2" />
                    </div>
                  ))}
                </>
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
    </div>
  );
};
