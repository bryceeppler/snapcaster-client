import { Card } from '@/components/ui/card';
import CardImage from '../ui/card-image';
import { Button } from '../ui/button';
import React, { memo } from 'react';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import useBuyListStore from '@/stores/buyListStore';
import { useCartItems } from '@/hooks/useCartItems';

type Props = { cardData: any };
const conditions = [
  'Near Mint',
  'Lightly Played',
  'Moderately Played',
  'Heavily Played',
  'Damaged'
];
const BuyListCatalogItem = memo(function ResultCard({ cardData }: Props) {
  const { currentCart } = useBuyListStore();
  const { cartItems, updateCartItem } = useCartItems(currentCart?.id);

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
    if (!currentCart?.id) return;
    
    const currentQuantity = getQuantityForCondition(conditionName);
    const newQuantity = currentQuantity + delta;

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
      cartId: currentCart.id,
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
            {Object.keys(cardData.conditions) && (
              <DialogTrigger className="w-full">
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
                            <ExclamationTriangleIcon className="size-4 text-red-500" />
                          )}
                          <p className="text-base font-medium">
                            {conditionName}
                          </p>
                        </div>
                        <div className="flex h-8 items-center rounded-xl border">
                          <button
                            className="flex h-full w-8 items-center justify-center rounded-l-xl hover:bg-accent"
                            onClick={() =>
                              handleUpdateQuantity(conditionName, -1)
                            }
                            disabled={quantity === 0}
                          >
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          <p className="w-8 bg-background text-center font-semibold">
                            {quantity}
                          </p>
                          <button
                            className="flex h-full w-8 items-center justify-center rounded-r-xl hover:bg-accent"
                            onClick={() =>
                              handleUpdateQuantity(conditionName, 1)
                            }
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
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
