import useGlobalStore from '@/stores/globalStore';
import useBuyListStore from '@/stores/buyListStore';
import { useTheme } from 'next-themes';
import { AlertCircle, ArrowLeft, Circle, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { FC } from 'react';
import PurchasingCardDetails from './checkout/purchasing-card-details';
import UnpurchasableCardDetails from './checkout/unpurchasable-card-details';

interface ReviewProps {
  setCurrentStep: (step: number) => void;
}

const Review: FC<ReviewProps> = ({ setCurrentStep }) => {
  const { buylistCheckoutBreakdownData } = useBuyListStore();
  const { getWebsiteName, websites } = useGlobalStore();
  const { theme } = useTheme();

  const storeData = buylistCheckoutBreakdownData[1];

  if (!storeData) {
    return (
      <div className="container max-w-4xl py-6">
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>No store data found to review.</AlertDescription>
        </Alert>
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

          {/* Order Totals */}
          <Card className="bg-muted">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Cash Total</p>
                  <p className="text-2xl font-bold">
                    ${storeData.cashSubtotal}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Store Credit Total</p>
                  <p className="text-2xl font-bold">
                    ${storeData.creditSubtotal}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button
              size="lg"
              onClick={() => setCurrentStep(4)}
              className="w-full md:w-auto"
            >
              Submit Order
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Review;
