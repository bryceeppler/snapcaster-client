import { useEffect, useRef } from 'react';
import useBuyListStore from '@/stores/useBuylistStore';
import { useConnectedVendors } from '@/hooks/useConnectedVendors';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LeftCartEditWithViewOffers } from '../modify-list-items/modify-list-items';
import { ExternalLink, AlertCircle, Info as InfoIcon } from 'lucide-react';
import { useVendors } from '@/hooks/queries/useVendors';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

export const BuylistStoreOffers = () => {
  const {
    reviewData,
    setSelectedStoreForReview,
    currentCartId,
    setAllCartsData,
    setBuylistUIState
  } = useBuyListStore();

  const { vendors, getVendorIcon, getVendorNameBySlug } = useVendors();
  const { data: connectedVendors, isLoading: isLoadingConnections } =
    useConnectedVendors();
  console.log(connectedVendors);

  const isVendorConnected = (vendorSlug: string) => {
    if (isLoadingConnections || !connectedVendors) return false;
    const matchingWebsite = vendors.find(
      (website) => website.slug === vendorSlug
    );
    return matchingWebsite
      ? connectedVendors.includes(matchingWebsite.slug)
      : false;
  };

  const storeOffersData = reviewData || [];

  // Add a ref to track if we've already called setAllCartsData
  const hasCalledSetAllCartsData = useRef(false);

  useEffect(() => {
    if (!hasCalledSetAllCartsData.current && currentCartId) {
      setAllCartsData(currentCartId);
      hasCalledSetAllCartsData.current = true;
    }
  }, [currentCartId]);

  return (
    <div className="flex w-full md:gap-1">
      <span className="hidden md:block">
        <LeftCartEditWithViewOffers />
      </span>

      <div className="flex h-full w-full flex-1 rounded-lg  ">
        <ScrollArea className="h-full w-full " type="always">
          <div
            className={`flex h-full flex-col items-center ${
              storeOffersData.length <= 0 && 'pt-[calc(25vh-2rem)]'
            }`}
          >
            <div className="w-full ">
              {storeOffersData.length > 0 ? (
                <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
                  {storeOffersData.map((storeOfferData: any, index: number) => {
                    const isConnected = isVendorConnected(
                      storeOfferData.storeName
                    );
                    const vendor = vendors.find(
                      (vendor) => vendor.slug === storeOfferData.storeName
                    );

                    return (
                      <div
                        className="col-span-1 flex h-full flex-col justify-between rounded-lg bg-card px-3 py-3 shadow-md"
                        key={index}
                      >
                        <div className="space-y-2">
                          <div className="flex items-end gap-1">
                            <div>
                              <img
                                src={getVendorIcon(vendor) || undefined}
                                alt="Vendor Icon"
                                className="size-8"
                              />
                            </div>
                            <div className="leading-none">
                              <p>
                                {getVendorNameBySlug(storeOfferData.storeName)}
                              </p>

                              {isConnected ? (
                                <div className="flex items-center gap-1">
                                  <div className="h-[0.6rem] w-[0.6rem] rounded-full bg-green-500"></div>
                                  <p className="text-sm leading-none text-muted-foreground">
                                    Connected
                                  </p>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-muted-foreground hover:cursor-pointer hover:text-primary">
                                  <div className="h-[0.6rem] w-[0.6rem] rounded-full bg-red-500"></div>
                                  <a
                                    href={
                                      'https://chromewebstore.google.com/detail/snapcaster/abelehkkdaejkofgdpnnecpipaaikflb?hl=en'
                                    }
                                    target="_blank"
                                    className="text-sm leading-none"
                                  >
                                    Connect Via Extension
                                  </a>
                                  <ExternalLink className="size-4" />
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="leading-none">
                            <p>Summary</p>
                          </div>
                          <div className="storeData.items.length space-y-1 text-sm font-normal leading-none">
                            <div className="flex justify-between">
                              <p>Credit</p>
                              <p className="font-light">
                                ${storeOfferData.creditSubtotal}
                              </p>
                            </div>
                            <div className="flex justify-between">
                              <p>Cash</p>
                              <p className="font-light">
                                ${storeOfferData.cashSubtotal}
                              </p>
                            </div>

                            <div className="flex justify-between">
                              <p>Buying</p>
                              <p className="font-light">
                                {storeOfferData.items.length}/
                                {storeOfferData.items.length +
                                  storeOfferData.unableToPurchaseItems.length}
                              </p>
                            </div>
                          </div>
                          {storeOfferData.storeName === 'exorgames' &&
                            (storeOfferData.cashSubtotal > 250 ||
                              storeOfferData.creditSubtotal > 250) && (
                              <div className="rounded-md border border-green-200 bg-green-50 p-2 dark:border-green-900 dark:bg-green-950/50">
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-sm font-medium text-green-700 dark:text-green-300">
                                      Get an extra $15 on orders over $250
                                    </span>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger>
                                          <InfoIcon className="size-4 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200" />
                                        </TooltipTrigger>
                                        <TooltipContent className="z-40 max-w-xs p-4">
                                          <div className="space-y-2">
                                            <p className="border-b pb-1 text-sm font-semibold text-primary">
                                              $15 Bonus Offer Details
                                            </p>
                                            <p className="text-xs">
                                              Here's how it works:
                                            </p>
                                            <ul className="space-y-1.5 pl-1 text-xs">
                                              <li className="flex items-start gap-1.5">
                                                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"></span>
                                                <span>
                                                  Submit your buylist to Exor
                                                  Games
                                                </span>
                                              </li>
                                              <li className="flex items-start gap-1.5">
                                                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"></span>
                                                <span>
                                                  If it totals $250 or more, and
                                                  the submission is accepted,
                                                  they'll tack on an extra $15
                                                  to your payout to help cover
                                                  shipping.
                                                </span>
                                              </li>
                                            </ul>
                                          </div>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                </div>
                                <div className="mt-2 border-t border-green-200 pt-1.5 dark:border-green-900">
                                  <a
                                    href="https://exorgames.com/pages/selling-policy"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-xs text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                                  >
                                    <span>View full selling policy</span>
                                    <ExternalLink className="size-3" />
                                  </a>
                                </div>
                              </div>
                            )}
                        </div>

                        <div className="mt-4 pt-2">
                          <Button
                            className="h-9 w-full"
                            onClick={() => {
                              setBuylistUIState('finalSubmissionState');
                              setSelectedStoreForReview(
                                storeOfferData.storeName
                              );
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                          >
                            Submit Offer
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2">
                  <AlertCircle></AlertCircle>
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-lg font-semibold">No Offers</p>
                    <p className="text-sm text-muted-foreground">
                      No stores are offering cash or credit from your buylist
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
