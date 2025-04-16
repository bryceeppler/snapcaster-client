import useBuyListStore from '@/stores/useBuylistStore';
import { useCartItems } from '@/hooks/useCartItems';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import CardImage from '@/components/ui/card-image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import {
  ExclamationTriangleIcon,
  MinusIcon,
  PlusIcon
} from '@radix-ui/react-icons';

type BuylistCatalogItemProps = {
  cardData: any;
};
const conditions = [
  'Near Mint',
  'Lightly Played',
  'Moderately Played',
  'Heavily Played',
  'Damaged'
];

export const BuylistCatalogItem = ({ cardData }: BuylistCatalogItemProps) => {
  const { currentCartId } = useBuyListStore();
  const { isAuthenticated } = useAuth();
  const { cartItems, updateCartItem } = useCartItems(
    currentCartId || undefined
  );

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
    <>
      <Card className="h-full border-none">
        <div className="flex h-full flex-col gap-2 rounded-md  p-4 ">
          <div className="mx-auto max-w-[150px]  md:max-w-[160px]">
            <CardImage imageUrl={cardData.image} alt={cardData.name} />
          </div>

          <div className=" flex flex-1 flex-col justify-between">
            <div className="flex w-full flex-col gap-1 space-y-0.5 px-0.5">
              <p className="overflow-hidden text-ellipsis text-[0.7rem] text-xs  font-semibold  leading-none text-muted-foreground ">
                {cardData.set}
              </p>
              <p className="overflow-hidden text-ellipsis text-[0.80rem] font-semibold leading-none ">
                {cardData.name}
              </p>

              <div className="flex flex-wrap items-center gap-1 text-[0.70rem] font-medium capitalize text-primary">
                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[0.7rem]">
                  <p> {cardData.foil}</p>
                </span>
                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[0.7rem]">
                  <p> {cardData.rarity}</p>
                </span>
              </div>
            </div>
          </div>

          <Dialog>
            <DialogTitle hidden>Add To Cart</DialogTitle>
            <DialogDescription hidden>
              Add this card to your cart
            </DialogDescription>
            {Object.keys(cardData.conditions) && (
              <DialogTrigger asChild>
                <Button
                  className="border-input-none w-full rounded-b-lg bg-card font-montserrat text-xs font-semibold"
                  variant="outline"
                  onClick={(e) => {
                    if (!isAuthenticated) {
                      e.preventDefault();
                      toast.error('Please login before adding to your cart');
                      return;
                    }
                    if (!currentCartId) {
                      e.preventDefault();
                      toast.error('No list selected');
                      return;
                    }
                  }}
                >
                  Add To Cart
                </Button>
              </DialogTrigger>
            )}

            <DialogContent className="w-[95vw] max-w-[400px] rounded-lg px-4 sm:px-6">
              <div className="mx-auto w-[200px] sm:w-[250px]">
                <CardImage imageUrl={cardData.image} alt={cardData.name} />
              </div>

              <div className="mt-2 space-y-2">
                <div className="text-primary-light font-montserrat text-[0.65rem] font-semibold uppercase text-muted-foreground">
                  {cardData.set}
                </div>
                <h3 className="text-[0.9rem] font-semibold capitalize">
                  {cardData.name}
                </h3>
                <div className="flex flex-wrap items-center gap-1 text-xs font-medium text-primary">
                  <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[0.9rem] capitalize">
                    <p> {cardData.rarity}</p>
                  </span>
                  <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[0.9rem]">
                    <p> {cardData.foil}</p>
                  </span>
                </div>

                {conditions.map((conditionName) => {
                  const isAvailable = Object.keys(cardData.conditions).includes(
                    conditionName
                  );
                  const quantity = getQuantityForCondition(conditionName);

                  return (
                    <div key={conditionName} className="mt-2">
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
                          <p className="text-sm font-medium">{conditionName}</p>
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
                          <p className="w-8 bg-background text-center ">
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
      </Card>
    </>
  );
};
