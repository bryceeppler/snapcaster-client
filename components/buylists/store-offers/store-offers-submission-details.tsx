//hooks and store states
import { useEffect } from 'react';
import useBuyListStore from '@/stores/useBuylistStore';
//components
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
//icons
import { BadgeDollarSign } from 'lucide-react';

export const BuylistStoreOfferBreakdown = () => {
  const { reviewData, selectedStoreForReview } = useBuyListStore();
  const breakdownData = reviewData?.find(
    (store: any) => store.storeName === selectedStoreForReview
  );
  useEffect(() => {
    console.log('breakdown data', breakdownData);
    // console.log('selected store for review', selectedStoreForReview);
  }, [breakdownData, selectedStoreForReview]);
  return (
    <div className="col-span-1 flex h-[75vh] flex-col rounded-lg   ">
      <ScrollArea className="h-full" type="always">
        <div className="mr-2.5 flex flex-col space-y-2">
          <div className="text flex w-full items-center justify-center gap-0.5 whitespace-nowrap font-semibold ">
            <Separator className="my-4 h-0.5 w-full" />
            <p className="shrink-0 text-muted-foreground">Purchasing</p>
            <Separator className="my-4 h-0.5 w-full" />
          </div>
          {breakdownData.items.map((cardData: any, index: number) => (
            <span key={index}>
              <PurchasingCardSubmitDetails cardData={cardData} />
            </span>
          ))}
        </div>

        <div className="mr-2.5 flex flex-col space-y-2 ">
          <div className="text flex w-full items-center justify-center gap-0.5 whitespace-nowrap font-semibold ">
            <Separator className="my-4 h-0.5 w-full" />
            <p className="shrink-0 text-muted-foreground">Not Purchasing</p>
            <Separator className="my-4 h-0.5 w-full" />
          </div>
          {breakdownData.unableToPurchaseItems.map(
            (cardData: any, index: number) => (
              <span key={index}>
                <NotPurchasingCardSubmitDetails cardData={cardData} />
              </span>
            )
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

type SubmitCardDetailsProps = {
  cardData: any;
};
const PurchasingCardSubmitDetails = ({ cardData }: SubmitCardDetailsProps) => {
  return (
    <div className="flex w-full items-stretch space-x-1 rounded-lg border bg-accent p-1">
      <div className="shrink-0 self-center">
        <img
          className="w-20 object-contain"
          src={cardData.image}
          alt={cardData.name}
        />
      </div>

      <div className="flex w-full flex-col justify-between py-1">
        <div className="space-y-0.5">
          <p className="text-xs font-medium leading-none text-muted-foreground">
            {cardData.setName}
          </p>
          <p className="text-sm font-semibold leading-none">
            {cardData.cardName}
          </p>

          <div className="flex flex-wrap items-center gap-1 text-xs font-medium text-primary">
            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs capitalize">
              <p> {cardData.condition}</p>
            </span>
            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs capitalize">
              <p> {cardData.rarity}</p>
            </span>
            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs">
              <p> {cardData.foil}</p>
            </span>
          </div>
        </div>

        <div>
          <div className="flex justify-between">
            <div className="flex items-center gap-0.5">
              <p className="text-xs font-semibold leading-none text-muted-foreground">
                Purchasing (Limit {cardData.maxPurchaseQuantity})
              </p>
            </div>
            <div className="flex space-x-1">
              <p className="text-xs font-semibold leading-none">
                {cardData.purchaseQuantity}
              </p>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-0.5">
              <p className="text-xs font-semibold leading-none text-muted-foreground">
                Credit
              </p>
              {cardData.bestCreditOffer && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <BadgeDollarSign className="size-3.5 text-primary hover:cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Top Credit Unit Price</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <div className="flex space-x-1">
              <p className="text-xs font-medium leading-none text-muted-foreground">
                {`${Number(cardData.creditPrice).toFixed(2)} ea -`}
              </p>
              <p className="text-xs font-semibold leading-none ">
                $
                {(
                  Number(cardData.creditPrice) * cardData.purchaseQuantity
                ).toFixed(2)}
              </p>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-0.5">
              <p className="text-xs font-semibold leading-none text-muted-foreground">
                Cash
              </p>
              {cardData.bestCreditOffer && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <BadgeDollarSign className="size-3.5 text-primary hover:cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Top Cash Unit Price</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <div className="flex space-x-1">
              <p className="text-xs font-medium leading-none text-muted-foreground">
                {`${Number(cardData.cashPrice).toFixed(2)} ea -`}
              </p>
              <p className="text-xs font-semibold leading-none ">
                $
                {(
                  Number(cardData.cashPrice) * cardData.purchaseQuantity
                ).toFixed(2)}
              </p>
            </div>
          </div>{' '}
          {/* <div className="flex justify-between">
              <div className="flex items-center gap-0.5">
                <p className="text-xs font-semibold leading-none text-muted-foreground">
                  Quantity
                </p>
              </div>
              <div className="flex space-x-1">
                <p className="text-xs font-semibold leading-none">
                  x{cardData.purchaseQuantity}
                </p>
              </div>
            </div> */}
        </div>
      </div>
    </div>
  );
};
const NotPurchasingCardSubmitDetails = ({
  cardData
}: SubmitCardDetailsProps) => {
  return (
    <div className="flex w-full items-stretch space-x-1 rounded-lg border bg-accent p-1">
      <div className="shrink-0 self-center">
        <img
          className="w-20 object-contain"
          src={cardData.image}
          alt={cardData.name}
        />
      </div>

      <div className="flex w-full flex-col justify-between py-1">
        <div className="space-y-0.5">
          <p className="text-xs font-medium leading-none text-muted-foreground">
            {cardData.setName}
          </p>
          <p className="text-sm font-semibold leading-none">
            {cardData.cardName}
          </p>

          <div className="flex flex-wrap items-center gap-1 text-xs font-medium text-primary">
            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs capitalize">
              <p> {cardData.condition}</p>
            </span>
            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs capitalize">
              <p> {cardData.rarity}</p>
            </span>
            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs">
              <p> {cardData.foil}</p>
            </span>
          </div>
        </div>

        <div>
          <div className="flex justify-between">
            <div className="flex items-center gap-0.5">
              <p className="text-xs font-semibold leading-none text-muted-foreground">
                Unable to Purchase
              </p>
            </div>
            <div className="flex space-x-1">
              <p className="text-xs font-semibold leading-none">
                {cardData.unableToPurchaseQuantity}
              </p>
            </div>
          </div>

          <div className="flex justify-between">
            <div className="flex items-center gap-0.5">
              <p className="text-xs font-semibold leading-none text-muted-foreground">
                Credit
              </p>
            </div>
            <div className="flex space-x-1">
              <p className="text-xs font-semibold leading-none">-</p>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-0.5">
              <p className="text-xs font-semibold leading-none text-muted-foreground">
                Cash
              </p>
            </div>
            <div className="flex space-x-1">
              <p className="text-xs font-semibold leading-none">-</p>
            </div>
          </div>
          {/* <div className="flex justify-between">
              <div className="flex items-center gap-0.5">
                <p className="text-xs font-semibold leading-none text-muted-foreground">
                  Quantity
                </p>
              </div>
              <div className="flex space-x-1">
                <p className="text-xs font-semibold leading-none">
                  x{cardData.unableToPurchaseQuantity}
                </p>
              </div>
            </div> */}
        </div>
      </div>
    </div>
  );
};
