import { useEffect, useState } from 'react';
import useBuyListStore from '@/stores/useBuylistStore';
import { useConnectedVendors } from '@/hooks/useConnectedVendors';
import { useVendors } from '@/hooks/queries/useVendors';
import { SubmitOfferPanel } from './submit-offer-panel';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { BadgeDollarSign, ExternalLink } from 'lucide-react';
import { getVendorIcon, getVendorNameBySlug } from '../utils/utils';

export const SubmitOffer = () => {
  const { reviewData, selectedStoreForReview } = useBuyListStore();
  const { vendors } = useVendors();
  const { data: connectedVendors, isLoading: isLoadingConnections } =
    useConnectedVendors();

  const [isVendorConnected, setIsVendorConnected] = useState(false);

  const breakdownData = reviewData?.find(
    (store: any) => store.storeName === selectedStoreForReview
  );

  const submitData = reviewData?.find(
    (store: any) => store.storeName === selectedStoreForReview
  );

  useEffect(() => {
    if (isLoadingConnections || !connectedVendors) return;
    const matchingWebsite = vendors.find(
      (website) => website.slug === submitData?.storeName
    );
    if (matchingWebsite) {
      setIsVendorConnected(connectedVendors.includes(matchingWebsite.id));
    }
  }, [connectedVendors, isLoadingConnections, submitData?.storeName]);

  return (
    <div className="col-span-1 flex h-full min-h-svh w-full flex-1 rounded-lg  bg-card p-0.5">
      <div className=" md:flex">
        <div className="mr-2.5 flex w-full flex-col space-y-2 px-2 py-2 md:mr-1 md:py-0">
          <div className="flex items-end gap-1 md:hidden">
            <div>
              <img
                src={getVendorIcon(submitData.storeName, vendors) || undefined}
                alt="Vendor Icon"
                className="size-8"
              />
            </div>
            <div className="leading-none">
              <p>{getVendorNameBySlug(submitData.storeName, vendors)}</p>

              <div className="flex items-center gap-1">
                {isVendorConnected ? (
                  <div className="flex items-center gap-1">
                    <div
                      className={`h-[0.6rem] w-[0.6rem] rounded-full bg-green-500`}
                    ></div>
                    <p className="text-sm leading-none text-muted-foreground">
                      Connected
                    </p>
                  </div>
                ) : (
                  <div className=" flex items-center gap-1 text-muted-foreground hover:cursor-pointer hover:text-primary">
                    <div
                      className={`h-[0.6rem] w-[0.6rem] rounded-full bg-red-500`}
                    ></div>
                    <a
                      href={
                        'https://chromewebstore.google.com/detail/snapcaster/abelehkkdaejkofgdpnnecpipaaikflb?hl=en'
                      }
                      target="_blank"
                      className="text-sm leading-none"
                    >
                      Link to Extension
                    </a>
                    <ExternalLink className="size-4  " />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className=" w-full items-center gap-0.5 whitespace-nowrap  pb-1 font-semibold ">
            <div className="flex w-full items-center justify-between gap-0.5 whitespace-nowrap font-medium ">
              <div className="flex  items-center space-x-2 leading-none">
                <Separator
                  orientation="vertical"
                  className="h-6  w-[3px] bg-primary"
                />
                <p className="shrink-0 text-lg"> Purchasing</p>
              </div>
              <p className="shrink-0  font-extralight">
                {breakdownData.items.length} items
              </p>
            </div>
          </div>

          <div className="flex flex-col ">
            {breakdownData.items.length > 0 && <Separator className="mb-2" />}

            {breakdownData.items.map((cardData: any, index: number) => (
              <div className="flex flex-col" key={index}>
                <div key={index}>
                  <PurchasingCardSubmitDetails cardData={cardData} />
                  <Separator className="my-2" />
                </div>
              </div>
            ))}
          </div>

          {breakdownData.unableToPurchaseItems.length > 0 && (
            <>
              <div className=" w-full items-center gap-0.5 whitespace-nowrap  pb-1 font-semibold ">
                <div className="flex w-full items-center justify-between gap-0.5 whitespace-nowrap font-medium ">
                  <div className="flex  items-center space-x-2 leading-none">
                    <Separator
                      orientation="vertical"
                      className="h-6  w-[3px] bg-red-500"
                    />
                    <p className="shrink-0 text-lg"> Not Purchasing</p>
                  </div>
                  <p className="shrink-0  font-extralight">
                    {breakdownData.unableToPurchaseItems.length} items
                  </p>
                </div>
              </div>
              <div className="flex flex-col ">
                <Separator className="mb-2" />
                {breakdownData.unableToPurchaseItems.map(
                  (cardData: any, index: number) => (
                    <div className="flex flex-col " key={index}>
                      <span key={index}>
                        <NotPurchasingCardSubmitDetails cardData={cardData} />
                        <Separator className="my-2" />
                      </span>
                    </div>
                  )
                )}
              </div>
            </>
          )}
        </div>
        <div className="sticky self-start p-2 md:top-[164px] md:w-3/5">
          <SubmitOfferPanel />
        </div>
      </div>
    </div>
  );
};

type SubmitCardDetailsProps = {
  cardData: any;
};
const PurchasingCardSubmitDetails = ({ cardData }: SubmitCardDetailsProps) => {
  return (
    <div className="flex w-full items-stretch space-x-1   pr-1">
      <div className="shrink-0 self-center">
        <img
          className="w-20 object-contain"
          src={cardData.image}
          alt={cardData.name}
        />
      </div>

      <div className="flex w-full flex-col justify-between space-y-0.5 py-1">
        <div className="space-y-0.5 px-2">
          <p className="text-xs  leading-none text-muted-foreground">
            {cardData.setName}
          </p>
          <p className="text-sm font-medium leading-none">
            {cardData.cardName}
          </p>
          <div className="font-0 flex flex-wrap items-center gap-1 text-xs text-primary">
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

        <div className="flex flex-col space-y-0.5">
          <div className="flex justify-between ">
            <div className="flex items-center gap-0.5 pl-2">
              <p className="text-xs  leading-none text-muted-foreground ">
                Purchasing - Limit {cardData.maxPurchaseQuantity}
              </p>
            </div>
            <div className="flex space-x-1">
              <p className="text-xs font-medium leading-none">
                {cardData.purchaseQuantity}
              </p>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-0.5 pl-2">
              <p className="text-xs  leading-none text-muted-foreground">
                Credit - ${cardData.creditPrice} ea
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
              <p className="text-xs font-medium leading-none ">
                $
                {(
                  Number(cardData.creditPrice) * cardData.purchaseQuantity
                ).toFixed(2)}
              </p>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-0.5 pl-2">
              <p className="text-xs leading-none text-muted-foreground">
                Cash - ${cardData.cashPrice} ea
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
              <p className="text-xs font-medium leading-none ">
                $
                {(
                  Number(cardData.cashPrice) * cardData.purchaseQuantity
                ).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const NotPurchasingCardSubmitDetails = ({
  cardData
}: SubmitCardDetailsProps) => {
  return (
    <div className="flex w-full items-stretch space-x-1  pr-1">
      <div className="shrink-0 self-center">
        <img
          className="w-20 object-contain"
          src={cardData.image}
          alt={cardData.name}
        />
      </div>

      <div className="flex w-full flex-col justify-between py-1 ">
        <div className="space-y-0.5 px-2">
          <p className="text-xs  leading-none text-muted-foreground">
            {cardData.setName}
          </p>
          <p className="text-sm font-medium leading-none">
            {cardData.cardName}
          </p>
          <div className="font-0 flex flex-wrap items-center gap-1 text-xs text-primary">
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

        <div className="flex flex-col space-y-0.5">
          <div className="flex justify-between">
            <div className="flex items-center gap-0.5 pl-2">
              <p className="text-xs leading-none text-muted-foreground">
                Unable To Purchase
              </p>
            </div>
            <div className="flex space-x-1">
              <p className="text-xs font-medium leading-none">
                {cardData.unableToPurchaseQuantity}
              </p>
            </div>
          </div>
          <div className="flex justify-between pl-2">
            <p className="  text-xs leading-none text-muted-foreground">
              Credit
            </p>

            <div className="flex space-x-1">
              <p className="text-xs font-semibold leading-none ">-</p>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-0.5 pl-2">
              <p className=" text-xs leading-none text-muted-foreground">
                Cash
              </p>
            </div>
            <div className="flex space-x-1">
              <p className="text-xs font-semibold leading-none ">-</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
