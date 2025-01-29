import useGlobalStore from '@/stores/globalStore';
import useBuyListStore from '@/stores/buyListStore';
import { useTheme } from 'next-themes';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import type { FC } from 'react';
import PurchasingCardDetails from './checkout/purchasing-card-details';
import UnpurchasableCardDetails from './checkout/unpurchasable-card-details';

interface ReviewProps {
  setCurrentStep: (step: number) => void;
}

const Review: FC<ReviewProps> = ({ setCurrentStep }) => {
  const { buylistCheckoutBreakdownData, selectedStoreForReview } = useBuyListStore();
  const { getWebsiteName, websites } = useGlobalStore();
  const { theme } = useTheme();

  const storeData = buylistCheckoutBreakdownData?.find(
    (store: any) => store.storeName === selectedStoreForReview
  );

  if (!storeData) {
    return (
      <div className="container max-w-4xl py-6">
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>No store data found to review. Please select a store from the checkout page.</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(2)}
            className="gap-2"
          >
            <ArrowLeft className="size-4" />
            Back to Checkout
          </Button>
        </div>
      </div>
    );
  }

  const matchingWebsite = websites.find(
    (website) => storeData.storeName === website.slug
  );

  return (
    <div className="container max-w-4xl space-y-6 py-6">
      {/* Order Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {matchingWebsite?.meta?.branding?.icons && (
              <img
                src={
                  theme === 'dark'
                    ? matchingWebsite.meta.branding.icons.dark
                    : matchingWebsite.meta.branding.icons.light
                }
                alt="Store logo"
                className="size-8"
              />
            )}
            <span className="font-bold">
              Order Summary - {getWebsiteName(storeData.storeName)}
            </span>
          </CardTitle>
          <CardDescription>
            Review your order details before submission
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Purchasing Cards Section */}
          <div className="space-y-4">
            <h3 className="font-semibold">
              Purchasing Cards ({storeData.items.length})
            </h3>
            <div className="rounded-lg border p-3">
              {storeData.items.map((item: any, index: number) => (
                <div
                  key={index}
                  className={`pb-2 ${
                    index < storeData.items.length - 1
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
            </div>
          </div>

          {/* Unpurchasable Cards Section */}
          {storeData.unableToPurchaseItems.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">
                Not Purchasing ({storeData.unableToPurchaseItems.length})
              </h3>
              <div className="rounded-lg border p-3">
                {storeData.unableToPurchaseItems.map(
                  (item: any, itemIndex: number) => (
                    <div
                      key={itemIndex}
                      className={`pb-2 ${
                        itemIndex < storeData.unableToPurchaseItems.length - 1
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
              </div>
            </div>
          )}

          <Alert>
            <AlertCircle className="size-4" />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>You can submit a cash order OR a credit order. The prices listed here are not guaranteed by the store and are pending confirmation after submission. Once you submit your order, you will receive and email from {getWebsiteName(storeData.storeName)} with the final prices.</AlertDescription>
          </Alert>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Order Totals */}
          <Card className="bg-accent">
            <CardContent className="pt-4 flex flex-col items-center">
                  <span className="text-xs font-montserrat font-medium uppercase mb-1">Cash Total</span>
                  <span className="text-2xl font-bold">
                    ${storeData.cashSubtotal}
                  </span>
                <Button className="mt-4">Submit Cash Order</Button>
        
            </CardContent>
          </Card>
          <Card className="bg-accent">
            <CardContent className="pt-4 flex flex-col items-center">
                  <span className="text-xs font-montserrat font-medium uppercase mb-1">Store Credit Total</span>
                  <span className="text-2xl font-bold">
                    ${storeData.creditSubtotal}
                  </span>
                <Button className="mt-4">Submit Credit Order</Button>
            </CardContent>
          </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Review;
