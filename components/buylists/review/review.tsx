import useBuyListStore, {
  IBuylistCart,
  IBuylistCartItem
} from '@/stores/buyListStore';
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
  setCurrentStep: (step: any) => void;
};

const CART_KEY = (cartId: number) => ['cart', cartId] as const;

export default function Review({ setCurrentStep }: Props) {
  const { reviewData, setSelectedStoreForReview, currentCartId } =
    useBuyListStore();
  const { getWebsiteName, websites } = useGlobalStore();
  const { theme } = useTheme();
  const { data: connectedVendors, isLoading: isLoadingConnections } =
    useConnectedVendors();

  // Fetch current cart data
  const { data: currentCart } = useQuery<{
    success: boolean;
    cart: IBuylistCart;
  } | null>({
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
    return matchingWebsite
      ? connectedVendors.includes(matchingWebsite.id)
      : false;
  };

  const cartItems = currentCart?.cart?.items || [];
  const breakdownData = reviewData || [];

  return (
    <>
      <div className=" mb-6 grid grid-cols-2 gap-1">
        {breakdownData.length === 0 && cartItems.length > 0 && (
          <div className="col-span-2 flex flex-col  px-4 py-6">
            <div className="flex flex-col items-center ">
              <div
                className="aspect-video w-full max-w-[360px] rounded-xl bg-contain bg-center bg-no-repeat "
                style={{
                  backgroundImage:
                    'url("https://cdn.prod.website-files.com/603c87adb15be3cb0b3ed9b5/670dce5f54f8d6e990f04d1a_064-min.png")'
                }}
              ></div>
              <div className="flex max-w-[480px] flex-col items-center gap-2 ">
                <p className="max-w-[480px] text-center text-lg font-bold leading-tight tracking-[-0.015em] ">
                  No Stores Are Purchasing From Your List
                </p>
              </div>
              <p className="max-w-[480px] text-center text-sm font-normal leading-normal ">
                Update your list with eligible cards for purchase.
              </p>
              <Button
                onClick={() => {
                  setCurrentStep('search');
                }}
                className="mt-6 flex h-10 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl px-4  text-sm font-bold leading-normal tracking-[0.015em] "
              >
                <span className="truncate">Back to Search</span>
              </Button>
            </div>
          </div>
        )}
        {breakdownData.length === 0 && cartItems.length === 0 && (
          <div className="col-span-2 flex flex-col  px-4 py-6">
            <div className="flex flex-col items-center ">
              <div
                className="aspect-video w-full max-w-[360px] rounded-xl bg-contain bg-center bg-no-repeat "
                style={{
                  backgroundImage:
                    'url("https://cdn.prod.website-files.com/603c87adb15be3cb0b3ed9b5/670cd8e80c2d2d95ea0f949f_082-min.png")'
                }}
              ></div>
              <div className="flex max-w-[480px] flex-col items-center gap-2 ">
                <p className="max-w-[480px] text-center text-lg font-bold leading-tight tracking-[-0.015em] ">
                  No Items Found In Your List
                </p>
                <p className="max-w-[480px] text-center text-sm font-normal leading-normal ">
                  You can add items to to your list from the search tab on the
                  buylists page.
                </p>
              </div>
              <Button
                onClick={() => {
                  setCurrentStep('search');
                }}
                className="mt-6 flex h-10 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl px-4  text-sm font-bold leading-normal tracking-[0.015em] "
              >
                <span className="truncate">Back to Search</span>
              </Button>
            </div>
          </div>
        )}

        {breakdownData.map((storeData: any, index: number) => {
          const isConnected = isVendorConnected(storeData.storeName);
          return (
            <div
              key={index}
              className="col-span-2 mb-1 h-min rounded-lg border bg-popover p-4  "
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
                                You've connected to this store with the
                                Snapcaster Chrome Extension
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
                                You need to connect to this store using the
                                Snapcaster Chrome Extension to sell cards
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
                        className={`mb-3  ${
                          itemIndex < storeData.items.length - 1
                            ? 'border-b border-border pb-3'
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
                      {storeData.unableToPurchaseItems.map(
                        (item: any, itemIndex: number) => (
                          <div
                            key={itemIndex}
                            className={`mb-3 ${
                              itemIndex <
                              storeData.unableToPurchaseItems.length - 1
                                ? 'border-b border-border pb-2'
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
                {isConnected ? (
                  <Button
                    onClick={() => {
                      setSelectedStoreForReview(storeData.storeName);
                      setCurrentStep('submit');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="h-8 w-full"
                    disabled={!isConnected}
                  >
                    Sell to {getWebsiteName(storeData.storeName)}
                  </Button>
                ) : (
                  <Alert className="border bg-background">
                    <AlertCircle className="size-4 text-muted-foreground" />
                    <AlertTitle className="text-sm font-semibold leading-none tracking-tight">
                      Store not connected
                    </AlertTitle>
                    <AlertDescription className="flex flex-col gap-3">
                      <span className="text-sm text-muted-foreground">
                        You need to connect to this store using the Snapcaster
                        Chrome Extension to sell cards.
                      </span>
                      <Link
                        href="https://chromewebstore.google.com/detail/snapcaster/abelehkkdaejkofgdpnnecpipaaikflb?hl=en"
                        target="_blank"
                        className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                      >
                        Download Snapcaster Chrome Extension
                        <ExternalLink className="size-3" />
                      </Link>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
