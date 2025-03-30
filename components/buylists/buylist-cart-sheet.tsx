import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2 } from 'lucide-react';
import useBuyListStore, {
  IBuylistCartItem,
  IBuylistCart
} from '@/stores/useBuylistStore';
import { useCartItems } from '@/hooks/useCartItems';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosWrapper';
import { Badge } from '@/components/ui/badge';
import CardImage from '../ui/card-image';

const CART_KEY = (cartId: number) => ['cart', cartId] as const;

type Props = {
  setCurrentStep: (step: any) => void;
};

export default function BuylistCartSheet({ setCurrentStep }: Props) {
  const { currentCartId } = useBuyListStore();
  const { updateCartItem } = useCartItems(currentCartId || undefined);

  // Fetch cart data using React Query
  const { data: currentCart, isLoading } = useQuery<{
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
  const itemsByStore = currentCart.cart.items.reduce<{
    [key: string]: IBuylistCartItem[];
  }>((acc, item) => {
    const storeName = item.game;
    if (!acc[storeName]) {
      acc[storeName] = [];
    }
    acc[storeName].push(item);
    return acc;
  }, {});

  const calculateTotal = () => {
    return currentCart.cart.items.reduce(
      (acc: number, item: IBuylistCartItem) => acc + item.quantity,
      0
    );
  };

  return (
    <div className="flex h-full w-full flex-col py-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium leading-none">
          {currentCart.cart.name}
        </h4>
      </div>
      <Separator className="my-4" />
      <ScrollArea className="h-[calc(100vh-200px)] w-full">
        <div className="space-y-6">
          {Object.entries(itemsByStore).map(([storeName, items]) => (
            <div key={storeName} className="space-y-4">
              <h4 className="text-sm font-medium leading-none">{storeName}</h4>
              {items.map((item: IBuylistCartItem) => (
                <div
                  key={item.id}
                  className="flex min-w-0 flex-col space-y-2 rounded-lg border p-2"
                >
                  <div className="flex min-w-0 items-start gap-1">
                    <div className="w-14 flex-shrink-0">
                      <CardImage imageUrl={item.image} alt={item.card_name} />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col px-1">
                      <div className="flex min-w-0 flex-col">
                        <p className="break-words text-sm font-medium">
                          {item.card_name}
                        </p>
                        <p className="break-words text-xs text-muted-foreground">
                          {item.set_name}
                        </p>
                      </div>
                      <div className="mt-1.5 flex min-w-0 flex-wrap items-center gap-1">
                        <Badge variant="outline" className="break-all text-xs">
                          {item.condition_name}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="break-all text-xs capitalize"
                        >
                          {item.rarity}
                        </Badge>
                        {item.foil !== 'Normal' && (
                          <Badge
                            variant="outline"
                            className="break-all text-xs capitalize"
                          >
                            {item.foil}
                          </Badge>
                        )}
                      </div>
                      <div className="mt-2 flex w-min items-center space-x-1 rounded-lg border">
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
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-4 text-center text-sm">
                          {item.quantity}
                        </span>
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
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 flex-shrink-0"
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
                </div>
              ))}
              <Separator />
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="mt-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Total Items</span>
          <span className="text-sm font-medium">{calculateTotal()}</span>
        </div>
        <Button
          className="w-full"
          onClick={() => {
            setCurrentStep('review');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            document.dispatchEvent(
              new KeyboardEvent('keydown', { key: 'Escape' })
            );
          }}
        >
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
}
