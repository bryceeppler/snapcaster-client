//hooks and store states
import { useCartItems } from '@/hooks/useCartItems';
import useBuyListStore, { IBuylistCartItem } from '@/stores/useBuylistStore';
//components
import { Button } from '@/components/ui/button';
import { MinusIcon, Plus } from 'lucide-react';

export const CartItem = ({ item }: { item: IBuylistCartItem }) => {
  const { currentCartId, buylistUIState, setAllCartsData } = useBuyListStore();

  const { updateCartItem } = useCartItems(currentCartId || undefined);
  return (
    <div className="flex  rounded-lg  px-1 py-1 ">
      <div>
        <img
          className="w-20 object-contain"
          src={item.image}
          alt="card_image"
        />
      </div>
      <div className="flex w-full flex-col gap-0.5  space-y-1 px-1">
        <p className="text-[0.6rem] text-xs font-semibold    leading-none text-muted-foreground">
          {item.set_name}
        </p>

        <p className="text-[0.7rem] text-xs font-semibold leading-none">
          {item.card_name}
        </p>

        <div className="flex flex-wrap items-center gap-1 text-xs font-medium capitalize text-primary">
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[0.65rem]">
            <p> {item.condition_name}</p>
          </span>
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[0.65rem]">
            <p> {item.foil}</p>
          </span>
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[0.65rem] ">
            <p> {item.rarity}</p>
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-1">
        <div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={async () => {
              if (currentCartId) {
                try {
                  // First update the cart item
                  await updateCartItem({
                    cartId: currentCartId,
                    item,
                    quantity: item.quantity + 1
                  });

                  // Wait a moment to ensure the update is processed
                  await new Promise((resolve) => setTimeout(resolve, 200));

                  // Then fetch the updated checkout data
                  if (buylistUIState === 'viewAllOffersState') {
                    await setAllCartsData(currentCartId);
                  }
                } catch (error) {
                  console.error('Failed to update cart:', error);
                }
              }
            }}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        <div>
          <p className="text-xs">{item.quantity}</p>
        </div>
        <div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => {
              currentCartId &&
                updateCartItem({
                  cartId: currentCartId,
                  item,
                  quantity: Math.max(0, item.quantity - 1)
                });
              if (buylistUIState === 'viewAllOffersState') {
                setAllCartsData(currentCartId);
              }
            }}
          >
            <MinusIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
