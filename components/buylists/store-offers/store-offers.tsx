//hooks and store states
import { useEffect, useRef } from 'react';
import useGlobalStore from '@/stores/globalStore';
import useBuyListStore from '@/stores/useBuylistStore';
import { useConnectedVendors } from '@/hooks/useConnectedVendors';
import { useCartItems } from '@/hooks/useCartItems';
//components
import { Button } from '@/components/ui/button';
//icons
import { ExternalLink } from 'lucide-react';
//other
import { useTheme } from 'next-themes';

export const BuylistStoreOffers = () => {
  const {
    reviewData,
    setSelectedStoreForReview,
    currentCartId,
    setAllCartsData,
    setLeftUIState
  } = useBuyListStore();
  const { getWebsiteName, websites } = useGlobalStore();
  const { theme } = useTheme();
  const { data: connectedVendors, isLoading: isLoadingConnections } =
    useConnectedVendors();

  const isVendorConnected = (vendorSlug: string) => {
    if (isLoadingConnections || !connectedVendors) return false;
    const matchingWebsite = websites.find(
      (website) => website.slug === vendorSlug
    );
    return matchingWebsite
      ? connectedVendors.includes(matchingWebsite.id)
      : false;
  };

  const storeOffersData = reviewData || [];
  const { updateCartItem } = useCartItems(currentCartId || undefined);
  // Add a ref to track if we've already called setAllCartsData
  const hasCalledSetAllCartsData = useRef(false);

  useEffect(() => {
    if (!hasCalledSetAllCartsData.current && currentCartId) {
      setAllCartsData(currentCartId);
      hasCalledSetAllCartsData.current = true;
    }
  }, [currentCartId]);

  return (
    <div className=" mr-2.5 grid grid-cols-2 gap-1 rounded-lg ">
      {storeOffersData.map((storeOfferData: any, index: number) => {
        const isConnected = isVendorConnected(storeOfferData.storeName);

        return (
          <div
            className="col-span-1 space-y-2 rounded-lg border bg-accent px-1 py-1 "
            key={index}
          >
            <div className="flex items-end gap-1">
              <div>
                {(() => {
                  const matchingWebsite = websites.find(
                    (website) => storeOfferData.storeName === website.slug
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
                <p>{getWebsiteName(storeOfferData.storeName)}</p>

                {isConnected ? (
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
                      Extension Required
                    </a>
                    <ExternalLink className="size-4  " />
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
                <p>${storeOfferData.creditSubtotal}</p>
              </div>
              <div className="flex justify-between">
                <p>Cash</p>
                <p>${storeOfferData.cashSubtotal}</p>
              </div>

              <div className="flex justify-between">
                <p>Buying</p>
                <p>
                  {storeOfferData.items.length}/
                  {storeOfferData.items.length +
                    storeOfferData.unableToPurchaseItems.length}
                </p>
              </div>
            </div>
            <div>
              <Button
                className="h-9 w-full"
                disabled={!isConnected}
                onClick={() => {
                  setLeftUIState('leftSubmitOffer');
                  setSelectedStoreForReview(storeOfferData.storeName);
                }}
              >
                Submit Offer
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
