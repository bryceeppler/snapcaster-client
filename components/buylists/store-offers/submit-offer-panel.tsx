import { AlertCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useVendors } from '@/hooks/queries/useVendors';
import { useConnectedVendors } from '@/hooks/useConnectedVendors';
import useBuyListStore from '@/stores/useBuylistStore';
import type { BuylistPaymentMethod, StoreOfferData } from '@/types/buylists';

type PaymentMethod = BuylistPaymentMethod;

export const SubmitOfferPanel = () => {
  const { vendors, getVendorNameBySlug } = useVendors();
  const {
    reviewData,
    selectedStoreForReview,
    submitBuylist,
    setBuylistUIState
  } = useBuyListStore();
  const { data: connectedVendors, isLoading: isLoadingConnections } =
    useConnectedVendors();

  const [isVendorConnected, setIsVendorConnected] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | ''>(
    ''
  );

  const submitData = reviewData?.find(
    (store: StoreOfferData) => store.storeName === selectedStoreForReview
  );

  useEffect(() => {
    if (isLoadingConnections || !connectedVendors) return;
    const matchingWebsite = vendors.find(
      (website) => website.slug === submitData?.storeName
    );
    if (matchingWebsite) {
      setIsVendorConnected(connectedVendors.includes(matchingWebsite.slug));
    }
  }, [connectedVendors, isLoadingConnections, submitData?.storeName, vendors]);

  const handleSubmit = async (paymentType: 'Cash' | 'Store Credit') => {
    const result = await submitBuylist(paymentType);
    if (result.success) {
      setBuylistUIState('viewAllOffersState');
    }
  };

  return (
    <Card className="border bg-card shadow-sm">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center gap-2">
          <div className="h-5 w-1.5 rounded-full bg-primary"></div>
          <h2 className="text-xl font-semibold tracking-tight">
            Offer Summary
          </h2>
        </div>

        <Separator />

        {/* Offer Summary Details */}
        <div className="space-y-3">
          <SummaryItem label="Cash" value={`$${submitData?.cashSubtotal}`} />
          <SummaryItem
            label="Credit"
            value={`$${submitData?.creditSubtotal}`}
          />
          <SummaryItem
            label="Purchasing"
            value={`${submitData?.items.length}/${
              submitData?.items.length +
              submitData?.unableToPurchaseItems.length
            }`}
          />
        </div>

        {/* Free shipping notice for exorgames */}
        {submitData?.storeName === 'exorgames' &&
          (parseFloat(submitData?.cashSubtotal) > 250 ||
            parseFloat(submitData?.creditSubtotal) > 250) && (
            <div className="mt-2 rounded-md border border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-950/50">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-green-700 dark:text-green-300" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  Free shipping on buylists over $250
                </span>
              </div>
              <div className="mt-2 border-t border-green-200 pt-2 dark:border-green-900">
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

        {/* Policy notice */}
        <div className="rounded-md bg-muted/50 p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              Please wait for a final adjusted email offer from{' '}
              {getVendorNameBySlug(submitData?.storeName || '')}. If you are not
              dropping off your cards in person, we recommend purchasing
              shipping insurance.
            </p>
          </div>
        </div>

        {/* Payment Selection */}
        <div className="space-y-3">
          <Select
            onValueChange={(value: PaymentMethod) => setSelectedPayment(value)}
            value={selectedPayment}
          >
            <SelectTrigger className="w-full border-input bg-background focus:ring-1 focus:ring-primary focus:ring-offset-0">
              <SelectValue placeholder="Select a Payment Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Payment Options</SelectLabel>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Store Credit">Store Credit</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Terms Acceptance */}
          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked === true)}
            />
            <div>
              <label
                htmlFor="terms"
                className="text-sm peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I have read and understood my{' '}
                <a
                  href="/faq#right-of-cancellation"
                  target="_blank"
                  className="text-primary hover:underline"
                >
                  right of cancellation
                </a>
                .
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            className="mt-2 w-full font-medium"
            size="lg"
            disabled={!termsAccepted || !isVendorConnected || !selectedPayment}
            onClick={() => handleSubmit(selectedPayment as PaymentMethod)}
          >
            Submit Offer
          </Button>
        </div>

        {/* Terms of Service */}
        <p className="text-[11px] text-muted-foreground">
          By clicking "Submit Offer", you agree to our{' '}
          <a
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Terms of Service
          </a>{' '}
          and that you have read our{' '}
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Privacy Policy
          </a>
          .
        </p>
      </CardContent>
    </Card>
  );
};

// Helper component for summary items
const SummaryItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm font-medium">{label}</span>
    <span className="font-semibold">{value}</span>
  </div>
);
