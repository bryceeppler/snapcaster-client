import { useEffect, useState } from 'react';
import useBuyListStore from '@/stores/useBuylistStore';
import { useConnectedVendors } from '@/hooks/useConnectedVendors';
import { useVendors } from '@/hooks/queries/useVendors';
import { SubmitOfferPanel } from './submit-offer-panel';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  BadgeDollarSign,
  ExternalLink,
  CheckCircle2,
  Info
} from 'lucide-react';
import { FinalSubmissionHeader } from '../header/header';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Vendor } from '@/services/vendorService';

// Interface for the card items in the buylist
interface BuylistItem {
  id: number;
  cardName: string;
  setName: string;
  condition: string;
  condition_name?: string;
  rarity: string;
  foil: string;
  quantity: number;
  purchaseQuantity: number;
  maxPurchaseQuantity: number;
  unableToPurchaseQuantity?: number;
  cashPrice: number;
  creditPrice: number;
  bestCashOffer?: boolean;
  bestCreditOffer?: boolean;
  image: string;
  name?: string;
}

// Interface for the store data received from the API
interface StoreOfferData {
  storeName: string;
  cashSubtotal: string;
  creditSubtotal: string;
  items: BuylistItem[];
  unableToPurchaseItems: BuylistItem[];
}

// Interface for the VendorInfoCard props
interface VendorInfoCardProps {
  vendor: Vendor | undefined;
  storeName: string;
  isVendorConnected: boolean;
  getVendorIcon: (vendor: Vendor | undefined) => string | null;
  getVendorNameBySlug: (slug: string) => string;
  className: string;
}

export const SubmitOffer = () => {
  const { reviewData, selectedStoreForReview } = useBuyListStore();
  const { vendors, getVendorIcon, getVendorNameBySlug } = useVendors();
  const { data: connectedVendors, isLoading: isLoadingConnections } =
    useConnectedVendors();

  const [isVendorConnected, setIsVendorConnected] = useState(false);

  const storeData = reviewData?.find(
    (store: StoreOfferData) => store.storeName === selectedStoreForReview
  );

  const vendor = vendors.find((vendor) => vendor.slug === storeData?.storeName);

  useEffect(() => {
    if (isLoadingConnections || !connectedVendors) return;
    const matchingWebsite = vendors.find(
      (website) => website.slug === storeData?.storeName
    );
    if (matchingWebsite) {
      setIsVendorConnected(connectedVendors.includes(matchingWebsite.slug));
    }
  }, [connectedVendors, isLoadingConnections, storeData?.storeName, vendors]);

  if (!storeData) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">No store selected</p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <FinalSubmissionHeader />

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_300px]">
        {/* Main Content Container */}
        <Card className="overflow-hidden border bg-card shadow-sm">
          <div className="flex flex-col">
            {/* Mobile Vendor Info */}
            <VendorInfoCard
              vendor={vendor}
              storeName={storeData.storeName}
              isVendorConnected={isVendorConnected}
              getVendorIcon={getVendorIcon}
              getVendorNameBySlug={getVendorNameBySlug}
              className="border-b bg-muted/50 p-4 md:hidden"
            />

            {/* Cards Container with Scrollable Area */}
            <ScrollArea className="h-[calc(100vh-9rem)] p-4">
              <div className="space-y-8">
                {/* Purchasing Section */}
                <CardSection
                  title="Purchasing"
                  count={storeData.items.length}
                  totalCount={
                    storeData.items.length +
                    storeData.unableToPurchaseItems.length
                  }
                  accentColor="bg-primary"
                >
                  <div className="grid gap-4 sm:grid-cols-1">
                    {storeData.items.map(
                      (cardData: BuylistItem, index: number) => (
                        <PurchaseCard
                          key={index}
                          cardData={cardData}
                          index={index}
                        />
                      )
                    )}
                  </div>
                </CardSection>

                {/* Not Purchasing Section */}
                {storeData.unableToPurchaseItems.length > 0 && (
                  <CardSection
                    title="Not Purchasing"
                    count={storeData.unableToPurchaseItems.length}
                    totalCount={
                      storeData.items.length +
                      storeData.unableToPurchaseItems.length
                    }
                    accentColor="bg-red-500"
                  >
                    <div className="grid gap-4 sm:grid-cols-1">
                      {storeData.unableToPurchaseItems.map(
                        (cardData: BuylistItem, index: number) => (
                          <NotPurchasingCard
                            key={index}
                            cardData={cardData}
                            index={index}
                          />
                        )
                      )}
                    </div>
                  </CardSection>
                )}
              </div>
            </ScrollArea>
          </div>
        </Card>

        {/* Sidebar - Submit Offer Panel */}
        <div className="space-y-4">
          <VendorInfoCard
            vendor={vendor}
            storeName={storeData.storeName}
            isVendorConnected={isVendorConnected}
            getVendorIcon={getVendorIcon}
            getVendorNameBySlug={getVendorNameBySlug}
            className="hidden rounded-lg border bg-card p-4 shadow-sm md:flex"
          />
          <SubmitOfferPanel />
        </div>
      </div>
    </div>
  );
};

// Vendor Info Card Component
const VendorInfoCard = ({
  vendor,
  storeName,
  isVendorConnected,
  getVendorIcon,
  getVendorNameBySlug,
  className
}: VendorInfoCardProps) => (
  <div className={`flex items-center gap-4 ${className}`}>
    {getVendorIcon(vendor) && (
      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-md border bg-white p-1 shadow-sm">
        <img
          src={getVendorIcon(vendor) || undefined}
          alt={`${getVendorNameBySlug(storeName)} logo`}
          className="h-full w-full object-contain"
        />
      </div>
    )}
    <div className="flex flex-col gap-1">
      <p className="text-lg font-medium">{getVendorNameBySlug(storeName)}</p>

      {isVendorConnected ? (
        <Badge
          variant="outline"
          className="flex w-fit items-center gap-1.5 border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400"
        >
          <CheckCircle2 className="size-3.5" />
          <span className="text-xs font-normal">Connected</span>
        </Badge>
      ) : (
        <a
          href="https://chromewebstore.google.com/detail/snapcaster/abelehkkdaejkofgdpnnecpipaaikflb?hl=en"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex w-fit items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-800 transition-colors hover:bg-red-100 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50"
        >
          <span className="h-2 w-2 rounded-full bg-red-500"></span>
          <span>Connect Via Extension</span>
          <ExternalLink className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </a>
      )}
    </div>
  </div>
);

// Card Section Component
const CardSection = ({
  title,
  count,
  totalCount,
  accentColor,
  children,
  className = ''
}: {
  title: string;
  count: number;
  totalCount: number;
  accentColor: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`${className}`}>
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`h-5 w-1.5 rounded-full ${accentColor}`}></div>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      </div>
      <Badge variant="outline" className="font-normal">
        {count} of {totalCount} items
      </Badge>
    </div>
    <Separator className="mb-5" />
    {children}
  </div>
);

// Purchase Card Component
const PurchaseCard = ({
  cardData,
  index
}: {
  cardData: BuylistItem;
  index: number;
}) => {
  return (
    <Card
      key={index}
      className="group overflow-hidden border bg-card transition-all duration-200 hover:border-primary/20 hover:shadow-md"
    >
      <CardContent className="p-0">
        <div className="flex flex-col gap-4 p-4 sm:flex-row">
          <div className="relative shrink-0 self-center">
            <img
              className="h-24 w-20 rounded-md object-contain shadow-sm transition-transform duration-200 group-hover:scale-105"
              src={cardData.image}
              alt={cardData.name || cardData.cardName}
              loading="lazy"
            />
            {cardData.bestCreditOffer || cardData.bestCashOffer ? (
              <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white shadow-md">
                <BadgeDollarSign className="size-3.5" />
              </div>
            ) : null}
          </div>

          <div className="flex w-full flex-col justify-between space-y-3">
            {/* Card Info */}
            <div>
              <p className="font-montserrat text-xs uppercase text-muted-foreground">
                {cardData.setName}
              </p>
              <p className="font-medium leading-tight">{cardData.cardName}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Badge variant="secondary" className="text-xs capitalize">
                  {cardData.condition}
                </Badge>
                <Badge variant="secondary" className="text-xs capitalize">
                  {cardData.rarity}
                </Badge>
                {cardData.foil && (
                  <Badge variant="secondary" className="text-xs">
                    {cardData.foil}
                  </Badge>
                )}
              </div>
            </div>

            {/* Purchase Details */}
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Purchasing - Limit {cardData.maxPurchaseQuantity}
                </span>
                <span className="font-medium">{cardData.purchaseQuantity}</span>
              </div>

              <PriceRow
                label="Credit"
                unitPrice={cardData.creditPrice}
                quantity={cardData.purchaseQuantity}
                isBestOffer={cardData.bestCreditOffer}
                tooltipText="Top Credit Unit Price"
              />

              <PriceRow
                label="Cash"
                unitPrice={cardData.cashPrice}
                quantity={cardData.purchaseQuantity}
                isBestOffer={cardData.bestCashOffer}
                tooltipText="Top Cash Unit Price"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Not Purchasing Card Component
const NotPurchasingCard = ({
  cardData,
  index
}: {
  cardData: BuylistItem;
  index: number;
}) => {
  return (
    <Card
      key={index}
      className="group overflow-hidden border border-muted bg-muted/30 transition-all duration-200 hover:border-muted/80 hover:bg-muted/50"
    >
      <CardContent className="p-0">
        <div className="flex gap-4 p-4">
          <div className="shrink-0 self-center">
            <img
              className="h-24 w-20 rounded-md object-contain grayscale filter transition-opacity duration-200 group-hover:opacity-80"
              src={cardData.image}
              alt={cardData.name || cardData.cardName}
              loading="lazy"
            />
          </div>

          <div className="flex w-full flex-col justify-between space-y-3">
            {/* Card Info */}
            <div>
              <p className="font-montserrat text-xs uppercase text-muted-foreground">
                {cardData.setName}
              </p>
              <p className="font-medium leading-tight">{cardData.cardName}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Badge variant="secondary" className="text-xs capitalize">
                  {cardData.condition}
                </Badge>
                <Badge variant="secondary" className="text-xs capitalize">
                  {cardData.rarity}
                </Badge>
                {cardData.foil && (
                  <Badge variant="secondary" className="text-xs">
                    {cardData.foil}
                  </Badge>
                )}
              </div>
            </div>

            {/* Unable to Purchase Details */}
            <div className="space-y-1 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Info className="size-3.5" />
                  <span>Unable To Purchase</span>
                </span>
                <span className="font-medium">
                  {cardData.unableToPurchaseQuantity}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Price Row Component
const PriceRow = ({
  label,
  unitPrice,
  quantity,
  isBestOffer = false,
  tooltipText
}: {
  label: string;
  unitPrice: string | number;
  quantity: number;
  isBestOffer?: boolean;
  tooltipText: string;
}) => {
  const total = (Number(unitPrice) * quantity).toFixed(2);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <span className="text-muted-foreground">
          {label} - ${unitPrice} ea
        </span>
        {isBestOffer && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <BadgeDollarSign className="size-3.5 text-primary hover:cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top" className="px-3 py-1.5">
                <p className="text-xs">{tooltipText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <span className="font-medium">${total}</span>
    </div>
  );
};
