import useBuyListStore from '@/stores/useBuylistStore';
import { useConnectedVendors } from '@/hooks/useConnectedVendors';
import { Button } from '@/components/ui/button';
import { ExternalLink, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useVendors } from '@/hooks/queries/useVendors';
import { ViewAllOffersHeader } from '../header/header';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// Define proper TypeScript interface for store offer data
interface StoreOfferData {
  storeName: string;
  creditSubtotal: number;
  cashSubtotal: number;
  items: unknown[];
  unableToPurchaseItems: unknown[];
}

export const BuylistStoreOffers = () => {
  const { reviewData, setSelectedStoreForReview, setBuylistUIState } =
    useBuyListStore();

  const { vendors, getVendorIcon, getVendorNameBySlug } = useVendors();
  const { data: connectedVendors, isLoading: isLoadingConnections } =
    useConnectedVendors();

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

  return (
    <div className="flex h-full w-full flex-col space-y-6 overflow-hidden">
      <ViewAllOffersHeader />

      <div className="w-full">
        {storeOffersData.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xxl:grid-cols-3">
            {storeOffersData.map(
              (storeOfferData: StoreOfferData, index: number) => {
                const isConnected = isVendorConnected(storeOfferData.storeName);
                const vendor = vendors.find(
                  (vendor) => vendor.slug === storeOfferData.storeName
                );

                const isEligibleForFreeShipping =
                  storeOfferData.storeName === 'exorgames' &&
                  (storeOfferData.cashSubtotal > 250 ||
                    storeOfferData.creditSubtotal > 250);

                return (
                  <Card
                    key={index}
                    className="flex h-full flex-col overflow-hidden transition-all duration-200 hover:shadow-lg"
                  >
                    <div className="flex flex-1 flex-col">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-3">
                          {getVendorIcon(vendor) && (
                            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded">
                              <img
                                src={getVendorIcon(vendor) || undefined}
                                alt={`${getVendorNameBySlug(
                                  storeOfferData.storeName
                                )} logo`}
                                className="h-full w-full object-contain"
                              />
                            </div>
                          )}
                          <div className="flex flex-col">
                            <p className="font-medium">
                              {getVendorNameBySlug(storeOfferData.storeName)}
                            </p>

                            {isConnected ? (
                              <Badge
                                variant="outline"
                                className="flex w-fit items-center gap-1 border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400"
                              >
                                <CheckCircle2 className="size-3" />
                                <span className="text-xs font-normal">
                                  Connected
                                </span>
                              </Badge>
                            ) : (
                              <a
                                href="https://chromewebstore.google.com/detail/snapcaster/abelehkkdaejkofgdpnnecpipaaikflb?hl=en"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex w-fit items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-normal text-red-800 transition-colors hover:bg-red-100 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50"
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                                <span>Connect Via Extension</span>
                                <ExternalLink className="size-3 transition-transform group-hover:translate-x-0.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="flex-1">
                        <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                          Summary
                        </h3>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-sm">Credit</p>
                            <p className={'text-sm font-medium'}>
                              $
                              {typeof storeOfferData.creditSubtotal === 'number'
                                ? storeOfferData.creditSubtotal.toFixed(2)
                                : parseFloat(
                                    String(storeOfferData.creditSubtotal)
                                  ).toFixed(2) || '0.00'}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            <p className="text-sm">Cash</p>
                            <p className={'text-sm font-medium'}>
                              $
                              {typeof storeOfferData.cashSubtotal === 'number'
                                ? storeOfferData.cashSubtotal.toFixed(2)
                                : parseFloat(
                                    String(storeOfferData.cashSubtotal)
                                  ).toFixed(2) || '0.00'}
                            </p>
                          </div>

                          <Separator className="my-1" />

                          <div className="flex items-center justify-between">
                            <p className="text-sm">Buying</p>
                            <div className="flex items-center">
                              <span className="text-sm font-medium">
                                {storeOfferData.items.length}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                /
                                {storeOfferData.items.length +
                                  storeOfferData.unableToPurchaseItems.length}
                              </span>
                            </div>
                          </div>
                        </div>

                        {isEligibleForFreeShipping && (
                          <div className="mt-4 rounded-md border border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-950/50">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="size-4 text-green-600 dark:text-green-400" />
                              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                                Free shipping eligible
                              </span>
                            </div>
                            <div className="mt-2 border-t border-green-200 pt-2 dark:border-green-900">
                              <a
                                href="https://exorgames.com/pages/selling-policy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-green-600 transition-colors hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                              >
                                <span>View full selling policy</span>
                                <ExternalLink className="size-3" />
                              </a>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </div>

                    <CardFooter className="mt-auto bg-muted/50 pt-4">
                      <Button
                        className="w-full font-medium"
                        onClick={() => {
                          setBuylistUIState('finalSubmissionState');
                          setSelectedStoreForReview(storeOfferData.storeName);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        Submit Offer
                      </Button>
                    </CardFooter>
                  </Card>
                );
              }
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-muted-foreground/20 bg-muted/30 py-12">
            <div className="rounded-full bg-muted p-3">
              <AlertCircle className="size-6 text-muted-foreground" />
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <h3 className="text-lg font-medium">No Offers Available</h3>
              <p className="max-w-md text-sm text-muted-foreground">
                No stores are currently offering cash or credit for the cards in
                your buylist.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
