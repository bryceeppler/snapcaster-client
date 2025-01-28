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
type Props = {
  setCurrentStep: (step: number) => void;
};
export default function Checkout({ setCurrentStep }: Props) {
  const { buylistCheckoutBreakdownData } = useBuyListStore();
  const { getWebsiteName, websites } = useGlobalStore();
  const { theme } = useTheme();
  return (
    <>
      <div className="mb-8 grid  gap-x-1 md:grid-cols-2">
        {buylistCheckoutBreakdownData &&
          buylistCheckoutBreakdownData.map((storeData: any, index: number) => (
            <div
              key={index}
              className="col-span-1 mb-1 h-min rounded-lg border bg-popover px-2"
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
                  <p className="text-xl font-bold ">
                    {getWebsiteName(storeData.storeName)}
                  </p>
                  <div className="flex flex-row items-center gap-1">
                    <Circle className="size-4 fill-green-500 stroke-none" />
                    <p className="text-sm text-muted-foreground">Connected</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Purchasing {storeData.items.length}/
                {storeData.items.length +
                  storeData.unableToPurchaseItems.length}{' '}
                cards
              </p>
              <div className="flex justify-between  px-12">
                <div>
                  <p className="text-lg font-semibold">Cash Subtotal</p>
                  <p className="text-center font-medium">
                    ${storeData.cashSubtotal}
                  </p>
                </div>
                <div>
                  <p className="text-lg font-semibold">Credit Subtotal</p>
                  <p className="text-center font-medium">
                    ${storeData.creditSubtotal}
                  </p>
                </div>
              </div>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="py-2 text-sm hover:no-underline">
                    Purchasing {storeData.items.length} Card(s)
                  </AccordionTrigger>
                  <AccordionContent>
                    {storeData.items.map((item: any, itemIndex: number) => (
                      <div key={itemIndex} className="mb-2">
                        <div>
                          <h3 className="text-[0.9rem] font-semibold capitalize">
                            {item.cardName} ({item.condition})
                          </h3>
                          <div className="font-montserrat text-[0.65rem] font-semibold uppercase text-primary">
                            {item.setName}
                          </div>
                          <p className="text-sm font-semibold capitalize text-muted-foreground">
                            {item.rarity} - {item.foil}
                          </p>
                        </div>

                        <div className="flex flex-col ">
                          <div className="flex items-center justify-between gap-1">
                            <span>
                              <p className="text-sm font-medium">Cash:</p>
                            </span>
                            <span className="flex items-center ">
                              <p>
                                ${item.cashPrice.toFixed(2)} x{' '}
                                {item.purchaseQuantity}
                              </p>
                              {item.bestCashOffer ? (
                                <img
                                  src="/best-cash-icon.svg"
                                  alt="Best Cash Offer"
                                  className="h-6 w-6"
                                />
                              ) : (
                                <span className="h-6 w-6"></span>
                              )}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-1">
                            <span>
                              <p className="text-sm font-medium">Credit</p>
                            </span>
                            <span className="flex items-center ">
                              <p>
                                ${item.creditPrice.toFixed(2)} x{' '}
                                {item.purchaseQuantity}
                              </p>
                              {item.bestCashOffer ? (
                                <img
                                  src="/best-credit-icon.svg"
                                  alt="Best Credit Offer"
                                  className="h-6 w-6"
                                />
                              ) : (
                                <span className="h-6 w-6"></span>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
                {storeData.unableToPurchaseItems.length > 0 && (
                  <AccordionItem value="item-2">
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
              <div className="my-2">
                <Button
                  onClick={() => {
                    setCurrentStep(3);
                  }}
                  className="h-8 w-full"
                >
                  Submit
                </Button>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
