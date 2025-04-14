//hooks and store states
import useBuyListStore, { IBuylistCart } from '@/stores/useBuylistStore';
import { useQuery } from '@tanstack/react-query';
//components
import { CartItem } from './list-item';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
//icons
import { AlertCircle } from 'lucide-react';
//other
import axiosInstance from '@/utils/axiosWrapper';

export const VerifyListContainer = () => {
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
    <div className="h-[calc(75vh-4rem)]">
      <ScrollArea className="h-full" type="always">
        <div
          className={`flex h-full flex-col items-center ${
            currentCart?.cart?.items && currentCart.cart.items.length > 0
              ? ''
              : 'pt-[calc(25vh-2rem)]'
          }`}
        >
          <div className="w-full ">
            {currentCart?.cart?.items && currentCart.cart.items.length > 0 ? (
              <div>
                <Separator className="my-2" />
                {currentCart.cart.items.map((item: any, index) => (
                  <div key={index}>
                    <CartItem item={item} />
                    <Separator className="my-2" />
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
