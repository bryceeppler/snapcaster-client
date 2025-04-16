import { useEffect, useRef } from 'react';
import useBuyListStore from '@/stores/useBuylistStore';
import { useConnectedVendors } from '@/hooks/useConnectedVendors';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LeftCartEditWithViewOffers } from '../modify-list-items/modify-list-items';
import { ExternalLink } from 'lucide-react';
import { AlertCircle } from 'lucide-react';
import { useVendors } from '@/hooks/queries/useVendors';

import { getVendorNameBySlug, getVendorIcon } from '../utils/utils';

export const BuylistStoreOffers = () => {
  const {
    reviewData,
    setSelectedStoreForReview,
    currentCartId,
    setAllCartsData,
    setBuylistUIState
  } = useBuyListStore();

  const { vendors } = useVendors();
  const { data: connectedVendors, isLoading: isLoadingConnections } =
    useConnectedVendors();

  const isVendorConnected = (vendorSlug: string) => {
    if (isLoadingConnections || !connectedVendors) return false;
    const matchingWebsite = vendors.find(
      (website) => website.slug === vendorSlug
    );
    return matchingWebsite
      ? connectedVendors.includes(matchingWebsite.id)
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

                    return (
                      <div
                        className="col-span-1 space-y-2 rounded-lg  bg-card px-3 py-3 shadow-md"
                        key={index}
                      >
                        <div className="flex items-end gap-1">
                          <div>
                            <img
                              src={
                                getVendorIcon(
                                  storeOfferData.storeName,
                                  vendors
                                ) || undefined
                              }
                              alt="Vendor Icon"
                              className="size-8"
                            />
                          </div>
                          <div className="leading-none">
                            <p>
                              {getVendorNameBySlug(
                                storeOfferData.storeName,
                                vendors
                              )}
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
                        <div>
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
