import { useEffect, useState } from 'react';
import useBuyListStore from '@/stores/useBuylistStore';
import { useConnectedVendors } from '@/hooks/useConnectedVendors';
import { useVendors } from '@/hooks/queries/useVendors';
import { Button } from '@/components/ui/button';
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
import { ExternalLink } from 'lucide-react';
type PaymentMethod = 'Cash' | 'Store Credit';

export const SubmitOfferPanel = () => {
  const { vendors, getVendorIcon, getVendorNameBySlug } = useVendors();
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
    (store: any) => store.storeName === selectedStoreForReview
  );

  const vendor = vendors.find((vendor) => vendor.slug === submitData.storeName);

  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    message: string;
  }>({
    success: false,
    message: ''
  });

  useEffect(() => {
    if (isLoadingConnections || !connectedVendors) return;
    const matchingWebsite = vendors.find(
      (website) => website.slug === submitData?.storeName
    );
    if (matchingWebsite) {
      setIsVendorConnected(connectedVendors.includes(matchingWebsite.slug));
    }
  }, [connectedVendors, isLoadingConnections, submitData?.storeName]);

  const handleSubmit = async (paymentType: 'Cash' | 'Store Credit') => {
    const result = await submitBuylist(paymentType);
    if (result.success) {
      setSubmissionResult({
        success: true,
        message: result.message
      });
      setBuylistUIState('viewAllOffersState');
    }
  };

  return (
    <div className="col-span-1  flex flex-col  space-y-1 rounded-lg md:mr-0  md:bg-accent  md:p-2">
      <div className="col-span-1 space-y-2  ">
        <div className="hidden items-end gap-1 md:flex ">
          <div>
            <img
              src={getVendorIcon(vendor) || undefined}
              alt="Vendor Icon"
              className="size-8"
            />
          </div>
          <div className="leading-none">
            <p>{getVendorNameBySlug(submitData.storeName)}</p>

            <div className="flex items-center gap-1">
              {isVendorConnected ? (
                <div className="flex items-center gap-1">
                  <div className="h-[0.6rem] w-[0.6rem] rounded-full bg-green-500"></div>
                  <p className="text-sm leading-none text-muted-foreground">
                    Connected
                  </p>
                </div>
              ) : (
                <div className=" flex items-center gap-1 text-muted-foreground hover:cursor-pointer hover:text-primary">
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
                  <ExternalLink className="size-4  " />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-2 space-y-2 ">
          <div className="font-semibold leading-none">
            <p>Offer Summary</p>
          </div>
          <div className="storeData.items.length space-y-1 text-sm font-normal leading-none">
            <div className="flex justify-between">
              <p>Cash</p>
              <p>${submitData?.cashSubtotal}</p>
            </div>
            <div className="flex justify-between">
              <p>Credit</p>
              <p>${submitData?.creditSubtotal}</p>
            </div>{' '}
            <div className="flex justify-between">
              <p>Purchasing</p>
              <p>
                {submitData?.items.length}/
                {submitData?.items.length +
                  submitData?.unableToPurchaseItems.length}
              </p>
            </div>
          </div>

          <p className=" text-xs text-muted-foreground">
            Please wait for a final adjusted email offer from{' '}
            {getVendorNameBySlug(submitData.storeName)}. If you are not dropping
            off your cards in person, we recommend recommend purchasing shipping
            insurance.
          </p>
          <div>
            <div className="flex  space-x-2 ">
              <div>
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) =>
                    setTermsAccepted(checked === true)
                  }
                />
              </div>

              <div className="flex flex-col ">
                <label
                  htmlFor="terms"
                  className="text-sm   peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I have read and understood my{' '}
                  <a
                    href="/faq#right-of-cancellation"
                    target="_blank"
                    className="text-primary hover:underline "
                  >
                    right of cancellation
                  </a>
                  .
                </label>
              </div>
            </div>
          </div>
          <Select
            onValueChange={(value: PaymentMethod) => setSelectedPayment(value)}
            value={selectedPayment}
          >
            <SelectTrigger className="w-full focus:ring-0 focus:ring-offset-0">
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
          <div className="flex justify-between space-x-2 ">
            <Button
              className="h-9 w-full"
              disabled={
                !termsAccepted || !isVendorConnected || !selectedPayment
              }
              onClick={() => handleSubmit(selectedPayment as PaymentMethod)}
            >
              Submit Offer
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          By clicking "Submit Offer", you agree to our{' '}
          <a
            href="/terms"
            target="_none"
            className="text-primary hover:underline"
          >
            Terms of Service
          </a>{' '}
          and that you have read our{' '}
          <a
            href="/privacy"
            target="_none"
            className="text-primary hover:underline"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
};
