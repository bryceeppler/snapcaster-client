//hooks and store states
import { useEffect, useState } from 'react';
import useGlobalStore from '@/stores/globalStore';
import useBuyListStore from '@/stores/useBuylistStore';
//components
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
//other
import { useTheme } from 'next-themes';
import { useConnectedVendors } from '@/hooks/useConnectedVendors';
import { ExternalLink } from 'lucide-react';

export const LeftSubmitOffer = () => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { reviewData, selectedStoreForReview, submitBuylist, setLeftUIState } =
    useBuyListStore();
  const submitData = reviewData?.find(
    (store: any) => store.storeName === selectedStoreForReview
  );
  const { getWebsiteName, websites } = useGlobalStore();
  const { theme } = useTheme();
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    message: string;
  }>({
    success: false,
    message: ''
  });
  const handleSubmit = async (paymentType: 'Cash' | 'Store Credit') => {
    const result = await submitBuylist(paymentType);

    if (result.success) {
      setSubmissionResult({
        success: true,
        message: result.message
      });
      setLeftUIState('leftCartListSelection');
    }
  };
  const { data: connectedVendors, isLoading: isLoadingConnections } =
    useConnectedVendors();
  const [isVendorConnected, setIsVendorConnected] = useState(false);

  useEffect(() => {
    if (isLoadingConnections || !connectedVendors) return;
    const matchingWebsite = websites.find(
      (website) => website.slug === submitData?.storeName
    );
    if (matchingWebsite) {
      setIsVendorConnected(connectedVendors.includes(matchingWebsite.id));
    }
  }, [connectedVendors, isLoadingConnections, submitData?.storeName]);

  return (
    <div className="col-span-1 flex h-[75vh] w-80 flex-col justify-between space-y-1 rounded-lg border bg-card px-1 py-1">
      <div className="col-span-1 space-y-2  ">
        <div className="flex items-end gap-1">
          <div>
            {(() => {
              const matchingWebsite = websites.find(
                (website) => submitData.storeName === website.slug
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
            <p>{getWebsiteName(submitData?.storeName)}</p>

            <div className="flex items-center gap-1">
              {/* <div
                className={`h-[0.6rem] w-[0.6rem] rounded-full bg-green-500`}
              ></div>
              <p className="text-sm leading-none text-muted-foreground">
                Connected
              </p> */}
              {isVendorConnected ? (
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
        </div>
        <div className="font-semibold leading-none">
          <p>Summary</p>
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
            <p>Buying</p>
            <p>
              {submitData?.items.length}/
              {submitData?.items.length +
                submitData?.unableToPurchaseItems.length}
            </p>
          </div>
        </div>
      </div>
      <div className="">
        <div className="flex  space-x-2 ">
          <div>
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked === true)}
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label
              htmlFor="terms"
              className="text-sm font-medium  peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I have read and understood{' '}
              <a
                href="/faq#right-of-cancellation"
                target="_blank"
                className="text-primary "
              >
                right of cancellation
              </a>
              .
            </label>
            <p className=" text-xs text-muted-foreground">
              Please wait for a final adjusted email offer from Obsidian Games.
              If you are not dropping off your cards in person, we recommend
              recommend purchasing shipping insurance.
            </p>
            <p className=" text-xs text-muted-foreground">
              Your offer may be adjusted due to market fluctuations, misgraded
              conditions, or other discrepancies.
            </p>
          </div>
        </div>

        <div className="flex justify-between space-x-2 ">
          <Button
            className="h-9 w-full"
            disabled={!termsAccepted || !isVendorConnected}
            onClick={() => handleSubmit('Cash')}
          >
            Request Cash
          </Button>
          <Button
            className="h-9 w-full"
            disabled={!termsAccepted || !isVendorConnected}
            onClick={() => handleSubmit('Store Credit')}
          >
            Request Credit
          </Button>
        </div>
      </div>
    </div>
  );
};
