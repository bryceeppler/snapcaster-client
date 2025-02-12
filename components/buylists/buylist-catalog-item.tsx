import { Card } from '@/components/ui/card';
import CardImage from '../ui/card-image';
import { Button } from '../ui/button';
import React, { memo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import useBuyListStore, { IBuylistCart } from '@/stores/buyListStore';
import { useCartItems } from '@/hooks/useCartItems';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosWrapper';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { toast } from 'sonner';
type Props = { cardData: any };
const conditions = [
  'Near Mint',
  'Lightly Played',
  'Moderately Played',
  'Heavily Played',
  'Damaged'
];

const CART_KEY = (cartId: number) => ['cart', cartId] as const;

const BuyListCatalogItem = memo(function ResultCard({ cardData }: Props) {
  const { currentCartId } = useBuyListStore();
  const { cartItems, updateCartItem } = useCartItems(
    currentCartId || undefined
  );

  // Fetch cart data using React Query
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

  const getQuantityForCondition = (conditionName: string) => {
    if (!cartItems) return 0;
    return (
      cartItems.find(
        (item) =>
          item.card_name === cardData.name &&
          item.set_name === cardData.set &&
          item.condition_name === conditionName &&
          item.foil === cardData.foil &&
          item.rarity === cardData.rarity
      )?.quantity || 0
    );
  };

  const handleUpdateQuantity = (conditionName: string, delta: number) => {
    if (!currentCartId) return;

    const currentQuantity = getQuantityForCondition(conditionName);
    const newQuantity = currentQuantity + delta;
    if (newQuantity > 99) {
      toast.error('Max Quantity 99');
      return;
    }
    const cartItem = {
      base_card_id: cardData.baseCardId,
      card_name: cardData.name,
      set_name: cardData.set,
      game: cardData.game,
      rarity: cardData.rarity,
      condition_name: conditionName,
      foil: cardData.foil,
      image: cardData.image
    };

    updateCartItem({
      cartId: currentCartId,
      item: cartItem,
      quantity: newQuantity
    });
  };

  return (
    <Card className="h-full">
      <div className="flex h-full flex-col rounded-md bg-popover p-4">
        <div className="mx-auto max-w-[150px] px-4 md:max-w-[250px]">
          <CardImage imageUrl={cardData.image} alt={cardData.name} />
        </div>

        <div className="mt-2 flex flex-1 flex-col justify-between">
          <div>
            <div className="text-primary-light font-montserrat text-[0.65rem] font-semibold uppercase">
              {cardData.set}
            </div>
            <h3 className="text-[0.9rem] font-semibold capitalize">
              {cardData.name}
            </h3>
            <p className="text-sm font-semibold capitalize text-muted-foreground">
              {cardData.rarity} - {cardData.foil}
            </p>
          </div>

          <Dialog>
            <DialogTitle hidden>Add To Cart</DialogTitle>
            <DialogDescription hidden>
              Add this card to your cart
            </DialogDescription>
            {Object.keys(cardData.conditions) && (
              <DialogTrigger asChild>
                <Button
                  className="w-full rounded-b-lg font-montserrat text-xs uppercase"
                  variant="outline"
                >
                  Add To Cart
                </Button>
              </DialogTrigger>
            )}

            <DialogContent className="w-min px-16">
              <div className="mx-auto w-[250px] px-4">
                <CardImage imageUrl={cardData.image} alt={cardData.name} />
              </div>

              <div className="mt-2">
                <div className="text-primary-light font-montserrat text-[0.65rem] font-semibold uppercase">
                  {cardData.set}
                </div>
                <h3 className="text-[0.9rem] font-semibold capitalize">
                  {cardData.name}
                </h3>
                <p className="text-sm font-semibold capitalize text-muted-foreground">
                  {cardData.rarity} - {cardData.foil}
                </p>

                {conditions.map((conditionName) => {
                  const isAvailable = Object.keys(cardData.conditions).includes(
                    conditionName
                  );
                  const quantity = getQuantityForCondition(conditionName);

                  return (
                    <div key={conditionName} className="mt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {!isAvailable && (
                            <TooltipProvider>
                              <Tooltip delayDuration={100}>
                                <TooltipTrigger asChild className="cursor-help">
                                  <ExclamationTriangleIcon className="size-4 text-red-500" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>No stores are purchasing this card</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          <p className="text-base font-medium">
                            {conditionName}
                          </p>
                        </div>
                        <div className="flex h-8 items-center rounded-xl border">
                          <Button
                            className="flex h-full w-8 items-center justify-center rounded-l-xl hover:bg-accent"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleUpdateQuantity(conditionName, -1)
                            }
                            disabled={quantity === 0}
                          >
                            <MinusIcon className="h-4 w-4" />
                          </Button>
                          <p className="w-8 bg-background text-center font-semibold">
                            {quantity}
                          </p>
                          <Button
                            className="flex h-full w-8 items-center justify-center rounded-r-xl hover:bg-accent"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleUpdateQuantity(conditionName, 1)
                            }
                          >
                            <PlusIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Card>
  );
});

export default BuyListCatalogItem;
