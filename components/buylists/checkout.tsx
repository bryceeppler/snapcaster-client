import useBuyListStore from '@/stores/buyListStore';
import useGlobalStore from '@/stores/globalStore';
import { useTheme } from 'next-themes';
import { AlertCircle, Ban, Circle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import BuylistCardDetails from './buylist-card-details';
type Props = {
  setCurrentStep: (step: number) => void;
};
export default function Checkout({ setCurrentStep }: Props) {
  const { buylistCheckoutBreakdownData } = useBuyListStore();
  const { getWebsiteName, websites } = useGlobalStore();
  const { theme } = useTheme();
  return (
    <>
      <div className="mb-8 grid gap-2 md:grid-cols-2">
        {buylistCheckoutBreakdownData &&
          buylistCheckoutBreakdownData.map((storeData: any, index: number) => (
            <div
              key={index}
              className="col-span-2 mb-1 h-min rounded-lg border bg-popover p-4"
            >
              <div className="flex flex-row items-center">
                {(() => {
                  const matchingWebsite = websites.find(
                    (website) => storeData.storeName === website.slug
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
                <div className="mx-3 flex flex-col justify-center">
                  <p className="font-bold ">
                    {getWebsiteName(storeData.storeName)}
                  </p>
                  <div className="flex flex-row items-center gap-1">
                    <Circle className="size-3 fill-green-500 stroke-none" />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <p className="text-xs text-muted-foreground">
                            Connected
                          </p>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            You've connected to this store with the Snapcaster
                            Chrome Extension
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>

              <Accordion
                type="single"
                collapsible
                className="mt-2 w-full space-y-2"
              >
                <AccordionItem
                  value="item-1"
                  className="rounded border border-border px-4"
                >
                  <AccordionTrigger className="py-2 text-sm hover:no-underline">
                    Purchasing {storeData.items.length} Card(s)
                  </AccordionTrigger>
                  <AccordionContent className="p-2">
                    {storeData.items.map((item: any, itemIndex: number) => (
                      <BuylistCardDetails
                        key={itemIndex}
                        cardName={item.cardName}
                        condition={item.condition}
                        setName={item.setName}
                        rarity={item.rarity}
                        foil={item.foil}
                        cashPrice={item.cashPrice}
                        creditPrice={item.creditPrice}
                        purchaseQuantity={item.purchaseQuantity}
                        bestCashOffer={item.bestCashOffer}
                        bestCreditOffer={item.bestCreditOffer}
                      />
                    ))}
                  </AccordionContent>
                </AccordionItem>
                {storeData.unableToPurchaseItems.length > 0 && (
                  <AccordionItem
                    value="item-2"
                    className="rounded border border-border px-4"
                  >
                    <AccordionTrigger className="py-2 text-sm hover:no-underline">
                      Not Purchasing {storeData.unableToPurchaseItems.length}{' '}
                      Card(s)
                    </AccordionTrigger>
                    <AccordionContent>
                      {storeData.unableToPurchaseItems.map(
                        (item: any, itemIndex: number) => (
                          <div key={itemIndex} className="mb-2">
                            <div>
                              <h3 className="text-[0.9rem] font-semibold capitalize">
                                {item.cardName} ({item.condition})
                              </h3>
                              <div className="font-montserrat text-[0.65rem] font-semibold uppercase text-primary">
                                {item.setName}
                              </div>
                              <p className="text- font-semibold capitalize text-muted-foreground">
                                {item.rarity} - {item.foil}
                              </p>
                              <Badge className="bg-red-500/80 hover:bg-red-500/80">
                                <span className="flex items-center gap-1 ">
                                  {item.reason == 'Card not available' ? (
                                    <Ban className="size-4 "></Ban>
                                  ) : (
                                    <AlertCircle className="size-4 "></AlertCircle>
                                  )}

                                  <p
                                    className={`text-[0.75rem] font-semibold capitalize`}
                                  >
                                    {item.reason}
                                  </p>
                                </span>
                              </Badge>
                            </div>
                          </div>
                        )
                      )}
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
              <div className="my-4 flex w-full flex-row">
                <div className="flex w-1/2 flex-col items-center">
                  <p className="font-montserrat text-sm uppercase">Cash</p>
                  <p className="text-lg font-bold">${storeData.cashSubtotal}</p>
                </div>
                <div className="flex w-1/2 flex-col items-center border-l border-border">
                  <p className="font-montserrat text-sm uppercase">Credit</p>
                  <p className="text-lg font-bold">
                    ${storeData.creditSubtotal}
                  </p>
                </div>
              </div>
              <div className="my-2">
                <Button
                  onClick={() => {
                    setCurrentStep(3);
                  }}
                  className="h-8 w-full"
                >
                  Sell to {getWebsiteName(storeData.storeName)}
                </Button>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
