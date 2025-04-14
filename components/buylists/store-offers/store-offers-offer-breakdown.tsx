//hooks and store states
import { useEffect, useState } from 'react';
import useBuyListStore from '@/stores/useBuylistStore';
//components
import { SubmitOfferPanel } from './submit-offer-panel';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
//icons
import { BadgeDollarSign, ExternalLink } from 'lucide-react';
import { useConnectedVendors } from '@/hooks/useConnectedVendors';
import useGlobalStore from '@/stores/globalStore';
import { useTheme } from 'next-themes';

export const BuylistStoreOfferBreakdown = () => {
  const { reviewData, selectedStoreForReview } = useBuyListStore();
  const { getWebsiteName, websites } = useGlobalStore();
  const { theme } = useTheme();

  const breakdownData = reviewData?.find(
    (store: any) => store.storeName === selectedStoreForReview
  );

  const submitData = reviewData?.find(
    (store: any) => store.storeName === selectedStoreForReview
  );
  const { data: connectedVendors, isLoading: isLoadingConnections } =
    useConnectedVendors();
  const [isVendorConnected, setIsVendorConnected] = useState(false);

  useEffect(() => {
    if (isLoadingConnections || !connectedVendors) return;
    const matchingWebsite = websites.find(
      (website) => website.slug === submitData?.storeName
    );
    if (matchingWebsite) {
      setIsVendorConnected(connectedVendors.includes(matchingWebsite.id));
    }
  }, [connectedVendors, isLoadingConnections, submitData?.storeName]);

  return (
    <div className="col-span-1  h-[75vh] rounded-lg  bg-card p-0.5">
      <ScrollArea className="h-full " type="always">
        <div className="mr-2.5 md:flex">
          <div className="mr-2.5 flex w-full flex-col space-y-2 px-2 py-2 md:mr-1 md:py-0">
            <div className="flex items-end gap-1 md:hidden">
              <div>
                {(() => {
                  const matchingWebsite = websites.find(
                    (website) => submitData.storeName === website.slug
                  );
                  return matchingWebsite?.meta?.branding?.icons ? (
                    <img
                      src={
                        theme === 'dark'
                          ? matchingWebsite.meta.branding.icons.dark
                          : matchingWebsite.meta.branding.icons.light
                      }
                      alt="Website"
                      className="size-8"
                    />
                  ) : null;
                })()}
              </div>
              <div className="leading-none">
                <p>{getWebsiteName(submitData?.storeName)}</p>

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

            <div className=" w-full items-center gap-0.5 whitespace-nowrap text-xl font-semibold ">
              <div className="flex w-full items-center justify-between gap-0.5 whitespace-nowrap text-base font-medium ">
                <div className="flex h-5 items-center space-x-2 leading-none">
                  <Separator
                    orientation="vertical"
                    className="w-[2px] bg-primary"
                  />
                  <p className="shrink-0"> Purchasing</p>
                </div>
                <p className="shrink-0 text-sm font-extralight">
                  {breakdownData.items.length} items
                </p>
              </div>
            </div>

            <div className="flex flex-col space-y-1.5">
              {breakdownData.items.map((cardData: any, index: number) => (
                <div className="flex flex-col space-y-3" key={index}>
                  <Separator></Separator>
                  <span key={index}>
                    <PurchasingCardSubmitDetails cardData={cardData} />
                  </span>
                </div>
              ))}
            </div>

            {breakdownData.unableToPurchaseItems.length > 0 && (
              <>
                <div className="flex w-full items-center justify-between gap-0.5 whitespace-nowrap text-base font-medium ">
                  <div className="flex h-5 items-center space-x-2 leading-none">
                    <Separator
                      orientation="vertical"
                      className="w-[2px] bg-red-500"
                    />
                    <p className="shrink-0"> Not Purchasing</p>
                  </div>

                  <p className="shrink-0 text-sm font-extralight">
                    {breakdownData.unableToPurchaseItems.length} items
                  </p>
                </div>
                <div className="flex flex-col space-y-1.5">
                  {breakdownData.unableToPurchaseItems.map(
                    (cardData: any, index: number) => (
                      <div className="flex flex-col space-y-3" key={index}>
                        <Separator />
                        <span key={index}>
                          <NotPurchasingCardSubmitDetails cardData={cardData} />
                        </span>
                      </div>
                    )
                  )}
                </div>
              </>
            )}
          </div>
          <div className="sticky top-0 self-start p-2 md:w-3/5">
            <SubmitOfferPanel />
          </div>
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
    <div className="flex w-full items-stretch space-x-1   pr-1">
      <div className="shrink-0 self-center">
        <img
          className="w-20 object-contain"
          src={cardData.image}
          alt={cardData.name}
        />
      </div>

      <div className="flex w-full flex-col justify-between py-1">
        <div className="space-y-0.5">
          <p className="text-sm font-medium leading-none">
            {cardData.cardName}
          </p>
          <p className="text-xs  leading-none text-muted-foreground">
            {cardData.setName}
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

        <div>
          <div className="flex justify-between">
            <div className="flex items-center gap-0.5">
              <p className="text-xs  leading-none text-muted-foreground">
                Purchasing (Limit {cardData.maxPurchaseQuantity})
              </p>
            </div>
            <div className="flex space-x-1">
              <p className="text-xs font-medium leading-none">
                {cardData.purchaseQuantity}
              </p>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-0.5">
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
            <div className="flex items-center gap-0.5">
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

      <div className="flex w-full flex-col justify-between py-1">
        <div className="space-y-0.5">
          <p className="text-sm font-medium leading-none">
            {cardData.cardName}
          </p>
          <p className="text-xs  leading-none text-muted-foreground">
            {cardData.setName}
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

        <div>
          <div className="flex justify-between">
            <div className="flex items-center gap-0.5">
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
          <div className="flex justify-between">
            {/* <div className="flex items-center gap-0.5"> */}
            <p className="text-xs  leading-none text-muted-foreground">
              Credit
            </p>
            {/* </div> */}
            <div className="flex space-x-1">
              <p className="text-xs font-semibold leading-none ">-</p>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-0.5">
              <p className="text-xs leading-none text-muted-foreground">Cash</p>
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
