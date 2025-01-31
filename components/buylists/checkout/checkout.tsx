import useBuyListStore, { IBuylistCart, IBuylistCartItem } from '@/stores/buyListStore';
import useGlobalStore from '@/stores/globalStore';
import { useTheme } from 'next-themes';
import { AlertCircle, Ban, Circle, XCircle, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
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
import { useConnectedVendors } from '@/hooks/useConnectedVendors';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosWrapper';

type Props = {
  setCurrentStep: (step: number) => void;
};

const CART_KEY = (cartId: number) => ['cart', cartId] as const;

export default function Checkout({ setCurrentStep }: Props) {
  const { buylistCheckoutBreakdownData, setSelectedStoreForReview, currentCartId } = useBuyListStore();
  const { getWebsiteName, websites } = useGlobalStore();
  const { theme } = useTheme();
  const { data: connectedVendors, isLoading: isLoadingConnections } = useConnectedVendors();

  // Fetch current cart data
  const { data: currentCart } = useQuery<{ success: boolean; cart: IBuylistCart } | null>({
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

  const isVendorConnected = (vendorSlug: string) => {
    if (isLoadingConnections || !connectedVendors) return false;
    const matchingWebsite = websites.find(
      (website) => website.slug === vendorSlug
    );
    return matchingWebsite ? connectedVendors.includes(matchingWebsite.id) : false;
  };

  const cartItems = currentCart?.cart?.items || [];
  const breakdownData = buylistCheckoutBreakdownData || [];

  return (
    <>
      <div className="sm:container space-y-2">
        {breakdownData.length === 0 && cartItems.length > 0 && (
          <div className="flex flex-col items-center justify-center">
            <span className="text-sm text-muted-foreground">No stores are buying the following cards:</span>
            {cartItems.map((item: IBuylistCartItem, index: number) => (
              <span key={index} className="text-sm text-muted-foreground">
                {item.card_name} - {item.condition_name}
              </span>
            ))}
          </div>
        )}
        {breakdownData.length === 0 && cartItems.length === 0 && (
          <span className="text-sm text-muted-foreground">No cards found in your cart</span>
        )}

        {breakdownData.map((storeData: any, index: number) => {
          const isConnected = isVendorConnected(storeData.storeName);
          return (
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
                  <p className="font-bold">
                    {getWebsiteName(storeData.storeName)}
                  </p>
                  <div className="flex flex-row items-center gap-1">
                    {isConnected ? (
                      <>
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
                      </>
                    ) : (
                      <>
                        <XCircle className="size-3 text-destructive" />
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <p className="text-xs text-muted-foreground">
                                Not Connected
                              </p>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                You need to connect to this store using the Snapcaster
                                Chrome Extension to sell cards
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </>
                    )}
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
                  <AccordionTrigger className="text-sm hover:no-underline">
                    Purchasing {storeData.items.length} Card(s)
                  </AccordionTrigger>
                  <AccordionContent className="px-3">
                    {storeData.items.map((item: any, itemIndex: number) => (
                      <div
                        key={itemIndex}
                        className={`mb-3 ${
                          itemIndex < storeData.items.length - 1
                            ? 'pb-3 border-b border-border'
                            : 'mb-0'
                        }`}
                      >
                        <PurchasingCardDetails
                          cardName={item.cardName}
                          condition={item.condition}
                          setName={item.setName}
                          image={item.image}
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
                    <AccordionTrigger className="text-sm hover:no-underline">
                      Not Purchasing {storeData.unableToPurchaseItems.length}{' '}
                      Card(s)
                    </AccordionTrigger>
                    <AccordionContent className="px-3">
                      <Alert className=" text-foreground mb-3">
                        <AlertCircle className="size-4 stroke-primary/80" />
                        <AlertTitle className="text-xs">Heads up!</AlertTitle>
                        <AlertDescription className="text-xs">
                          {getWebsiteName(storeData.storeName)} is not purchasing these cards. You can still submit your order, but they may not purchase all items.
                        </AlertDescription>
                      </Alert>
                      {storeData.unableToPurchaseItems.map(
                        (item: any, itemIndex: number) => (
                          <div
                            key={itemIndex}
                            className={`mb-3 ${
                              itemIndex <
                              storeData.unableToPurchaseItems.length - 1
                                ? 'pb-2 border-b border-border'
                                : 'mb-0'
                            }`}
                          >
                            <UnpurchasableCardDetails
                              cardName={item.cardName}
                              condition={item.condition}
                              setName={item.setName}
                              image={item.image}
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
                {isConnected ? <Button
                  onClick={() => {
                    setSelectedStoreForReview(storeData.storeName);
                    setCurrentStep(3);
                  }}
                  className="h-8 w-full"
                  disabled={!isConnected}
                >
                  Sell to {getWebsiteName(storeData.storeName)}
                </Button> : <Alert className="bg-background border">
                  <AlertCircle className="size-4 text-muted-foreground" />
                  <AlertTitle className="text-sm font-semibold leading-none tracking-tight">Store not connected</AlertTitle>
                  <AlertDescription className="flex flex-col gap-3">
                    <span className="text-sm text-muted-foreground">You need to connect to this store using the Snapcaster Chrome Extension to sell cards.</span>
                    <Link 
                      href="https://chromewebstore.google.com/detail/snapcaster/abelehkkdaejkofgdpnnecpipaaikflb?hl=en" 
                      target="_blank" 
                      className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                    >
                      Download Snapcaster Chrome Extension
                      <ExternalLink className="size-3" />
                    </Link>
                  </AlertDescription>
                </Alert>}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
