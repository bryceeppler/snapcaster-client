import useGlobalStore from '@/stores/globalStore';
import useBuyListStore from '@/stores/buyListStore';
import { useTheme } from 'next-themes';
import { AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
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
import { useState } from 'react';
import PurchasingCardDetails from './checkout/purchasing-card-details';
import UnpurchasableCardDetails from './checkout/unpurchasable-card-details';

interface ReviewProps {
  setCurrentStep: (step: number) => void;
}

const Review: FC<ReviewProps> = ({ setCurrentStep }) => {
  const {
    buylistCheckoutBreakdownData,
    selectedStoreForReview,
    submitBuylist
  } = useBuyListStore();
  const { getWebsiteName, websites } = useGlobalStore();
  const { theme } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    message: string;
  }>({
    success: false,
    message: ''
  });

  const storeData = buylistCheckoutBreakdownData?.find(
    (store: any) => store.storeName === selectedStoreForReview
  );

  const handleSubmit = async (paymentType: 'Cash' | 'Credit') => {
    setIsSubmitting(true);
    const result = await submitBuylist(paymentType);
    setIsSubmitting(false);
    if (result.success) {
      setSubmissionResult({
        success: true,
        message: result.message
      });
    }
  };

  if (submissionResult.success) {
    return (
      <div className="container py-12">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <CheckCircle2 className="size-12 text-green-500" />
              <h2 className="text-2xl font-bold">
                Order Submitted Successfully!
              </h2>

              <p className="text-muted-foreground">
                Your order has been submitted to{' '}
                {getWebsiteName(selectedStoreForReview || '')}. You will receive
                an email confirmation shortly with payment instructions.
              </p>

              <Button onClick={() => setCurrentStep(0)} className="mt-4">
                Return to Buylists
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!storeData) {
    return (
      <div className="container max-w-4xl rounded-lg border bg-popover py-6">
        <Alert className="bg-background font-medium">
          <AlertCircle className="size-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="text-foreground">
            No store data found to review. Please select a store from the
            checkout page.
          </AlertDescription>
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
    <div className="mb-6 space-y-6 sm:container">
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
                    image={item.image}
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
                        image={item.image}
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
            <AlertDescription>
              <br />
              The prices listed here here are not guaranteed by the store and
              may be adjusted due to demand, card condition, and new set
              volatility.
              <br />
              <br />
              In a few business days{' '}
              <span className="text-primary">
                {getWebsiteName(storeData.storeName)}
              </span>{' '}
              will email you a final adjusted quote and shipping instructions.
              <br />
              <br />
              <span className="font-medium text-primary underline">
                Shipping is your responsibility and insurance is reccomended.
              </span>
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Order Totals */}
            <Card className="bg-accent">
              <CardContent className="flex flex-col items-center pt-4">
                <span className="mb-1 font-montserrat text-xs font-medium uppercase">
                  Cash Total
                </span>
                <span className="text-2xl font-bold">
                  ${storeData.cashSubtotal}
                </span>
                <Button
                  className="mt-4 w-full"
                  onClick={() => handleSubmit('Cash')}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Cash Order'}
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-accent">
              <CardContent className="flex flex-col items-center pt-4">
                <span className="mb-1 font-montserrat text-xs font-medium uppercase">
                  Store Credit Total
                </span>
                <span className="text-2xl font-bold">
                  ${storeData.creditSubtotal}
                </span>
                <Button
                  className="mt-4 w-full"
                  onClick={() => handleSubmit('Credit')}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Credit Order'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Review;
