import useBuyListStore from '@/stores/buyListStore';
import useGlobalStore from '@/stores/globalStore';
import { useTheme } from 'next-themes';
import { AlertCircle, Ban, Circle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Button } from '../../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import PurchasingCardDetails from './purchasing-card-details';
import UnpurchasableCardDetails from './unpurchasable-card-details';
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
                      <div
                        key={itemIndex}
                        className={`pb-2 ${
                          itemIndex < storeData.items.length - 1
                            ? 'mb-2 border-b border-border'
                            : ''
                        }`}
                      >
                        <PurchasingCardDetails
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
                      </div>
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
                      <Alert variant="destructive" className="bg-red-500/80 text-white mb-3">
                        <AlertCircle className="size-4 stroke-white" />
                        <AlertTitle className="text-xs">Heads up!</AlertTitle>
                        <AlertDescription className="text-xs">
                          {getWebsiteName(storeData.storeName)} is not purchasing these cards. You can still submit your order, but they may not purchase all items.
                        </AlertDescription>
                      </Alert>
                      {storeData.unableToPurchaseItems.map(
                        (item: any, itemIndex: number) => (
                          <div
                            key={itemIndex}
                            className={`pb-2 ${
                              itemIndex <
                              storeData.unableToPurchaseItems.length - 1
                                ? 'mb-2 border-b border-border'
                                : ''
                            }`}
                          >
                            <UnpurchasableCardDetails
                              cardName={item.cardName}
                              condition={item.condition}
                              setName={item.setName}
                              rarity={item.rarity}
                              foil={item.foil}
                              reason={item.reason}
                            />
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
