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
import { useEffect, useState } from 'react';
import PurchasingCardDetails from './review/purchasing-card-details';
import UnpurchasableCardDetails from './review/unpurchasable-card-details';
import { useVendors } from '@/hooks/queries/useVendors';
import { VendorAssetType, VendorAssetTheme } from '@/services/vendorService';

interface ReviewProps {
  setCurrentStep: (step: any) => void;
}

const Review: FC<ReviewProps> = ({ setCurrentStep }) => {
  const {
    reviewData,
    selectedStoreForReview,
    submitBuylist,
    currentCartId,
    setReviewData
  } = useBuyListStore();

  const { vendors } = useVendors();

  const getVendorNameBySlug = (slug: string): string => {
    const vendor = vendors.find((vendor) => vendor.slug === slug);
    return vendor ? vendor.name : 'Vendor not found';
  };

  const { theme } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    message: string;
  }>({
    success: false,
    message: ''
  });

  const storeData = reviewData?.find(
    (store: any) => store.storeName === selectedStoreForReview
  );

  // Helper function to get vendor icon
  const getVendorIcon = (slug: string): string | null => {
    const vendor = vendors.find((v) => v.slug === slug);
    if (!vendor) return null;

    // Find the icon asset based on the current theme
    const iconAsset = vendor.assets.find(
      (asset) =>
        asset.asset_type === VendorAssetType.ICON &&
        (asset.theme ===
          (theme === 'dark' ? VendorAssetTheme.DARK : VendorAssetTheme.LIGHT) ||
          asset.theme === VendorAssetTheme.UNIVERSAL)
    );

    return iconAsset?.url || null;
  };

  const handleSubmit = async (paymentType: 'Cash' | 'Store Credit') => {
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

  useEffect(() => {
    setReviewData(currentCartId);
  }, [currentCartId]);

  if (submissionResult.success) {
    return (
      <div className="container py-12">
        <Card className="border-none bg-background">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <CheckCircle2 className="size-12 text-green-500" />
              <h2 className="text-2xl font-bold">
                Order Submitted Successfully!
              </h2>

              <p className="text-muted-foreground">
                Your order has been submitted to{' '}
                {getVendorNameBySlug(selectedStoreForReview || '')}. If you are
                shipping your cards, please wait for a confirmation email in 2-3
                business days to the email you registerd on the{' '}
                {getVendorNameBySlug(selectedStoreForReview || '')} website.
                Otherwise you can just drop your cards off in person.
              </p>

              <Button
                onClick={() => {
                  setCurrentStep('info');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="mt-4"
              >
                Submit Another Quote
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!storeData) {
    return (
      <div className=" flex flex-col  px-4 py-6">
        <div className="flex flex-col items-center ">
          <div
            className="b aspect-video w-full max-w-[360px] rounded-xl bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage:
                'url("https://cdn.snapcaster.ca/images/avatar-cards.png")'
            }}
          ></div>
          <div className="flex max-w-[480px] flex-col items-center gap-2">
            <p className="max-w-[480px] text-center text-lg font-bold leading-tight tracking-[-0.015em] ">
              No Store Selected
            </p>
            <p className="max-w-[480px] text-center text-sm font-normal leading-normal ">
              Select an eligible store from the review page. You will need to
              connect your selected LGS store account using the Snapcaster
              Extension.
            </p>
          </div>
          <Button
            onClick={() => {
              setCurrentStep('review');
            }}
            className="my-6 flex h-10 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl  px-4 text-sm font-bold leading-normal tracking-[0.015em] "
          >
            <span className="truncate">Back to Review</span>
          </Button>
        </div>
      </div>
    );
  }

  const matchingVendor = vendors.find(
    (vendor) => storeData.storeName === vendor.slug
  );

  return (
    <div className="mb-6 space-y-6 ">
      {/* Order Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {(() => {
              const iconUrl = getVendorIcon(storeData.storeName);
              return iconUrl ? (
                <img src={iconUrl} alt="Store logo" className="size-8" />
              ) : null;
            })()}
            <span className="font-bold">
              Order Summary - {getVendorNameBySlug(storeData.storeName)}
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
                {getVendorNameBySlug(storeData.storeName)}
              </span>{' '}
              will email you a final adjusted quote and shipping instructions.
              <br />
              <br />
              <span className="font-medium text-primary underline">
                Shipping is your responsibility and insurance is recommended.
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
                  onClick={() => {
                    handleSubmit('Cash');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
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
                  onClick={() => {
                    handleSubmit('Store Credit');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
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
