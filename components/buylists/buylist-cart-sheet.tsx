import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2 } from 'lucide-react';
import useBuyListStore, { IBuylistCartItem, IBuylistCart } from '@/stores/buyListStore';
import { useCartItems } from '@/hooks/useCartItems';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosWrapper';
import { Badge } from '@/components/ui/badge';

const CART_KEY = (cartId: number) => ['cart', cartId] as const;

type Props = {
  setCurrentStep: (step: number) => void;
};

export default function BuylistCartSheet({ setCurrentStep }: Props) {
  const { currentCartId } = useBuyListStore();
  const { updateCartItem } = useCartItems(currentCartId || undefined);

  // Fetch cart data using React Query
  const { data: currentCart, isLoading } = useQuery<{ success: boolean; cart: IBuylistCart } | null>({
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

  if (isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <p className="text-muted-foreground">Loading cart...</p>
      </div>
    );
  }

  if (!currentCart?.cart || currentCart.cart.items.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <p className="text-muted-foreground">Your cart is empty</p>
      </div>
    );
  }

  // Group items by store
  const itemsByStore = currentCart.cart.items.reduce<{ [key: string]: IBuylistCartItem[] }>((acc, item) => {
    const storeName = item.game;
    if (!acc[storeName]) {
      acc[storeName] = [];
    }
    acc[storeName].push(item);
    return acc;
  }, {});

  const calculateTotal = () => {
    return currentCart.cart.items.reduce((acc: number, item: IBuylistCartItem) => acc + item.quantity, 0);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium">{currentCart.cart.name}</h4>
      </div>
      <Separator className="my-4" />
      <ScrollArea className="flex-1">
        <div className="space-y-6">
          {Object.entries(itemsByStore).map(([storeName, items]) => (
            <div key={storeName} className="space-y-4">
              <h3 className="font-semibold">{storeName}</h3>
              {items.map((item: IBuylistCartItem) => (
                <div
                  key={item.id}
                  className="flex flex-col space-y-2 rounded-lg border p-3"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{item.card_name}</p>
                      <div className="flex flex-wrap gap-1 items-center">
                        <p className="text-sm text-muted-foreground">
                          {item.set_name}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {item.condition_name}
                        </Badge>
                        {item.foil !== 'Normal' && (
                          <Badge variant="secondary" className="text-xs">
                            {item.foil}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        currentCartId &&
                        updateCartItem({
                          cartId: currentCartId,
                          item,
                          quantity: 0
                        })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          currentCartId &&
                          updateCartItem({
                            cartId: currentCartId,
                            item,
                            quantity: Math.max(0, item.quantity - 1)
                          })
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          currentCartId &&
                          updateCartItem({
                            cartId: currentCartId,
                            item,
                            quantity: item.quantity + 1
                          })
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="font-medium">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
              <Separator />
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="mt-auto space-y-4 pt-6">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium">Total Items</span>
          <span className="text-lg font-medium">{calculateTotal()}</span>
        </div>
        <Button className="w-full" size="lg" onClick={() => setCurrentStep(2)}>
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
} 
