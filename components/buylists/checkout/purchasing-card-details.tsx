import CardImage from '@/components/ui/card-image';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

import {
  Receipt,
  CreditCard,
  BadgeDollarSign
} from 'lucide-react';

interface CardDetailsProps {
  cardName: string;
  condition: string;
  setName: string;
  rarity: string;
  foil: string;
  image: string;
  cashPrice: number;
  creditPrice: number;
  purchaseQuantity: number;
  bestCashOffer?: boolean;
  bestCreditOffer?: boolean;
}

interface PriceDisplayProps {
  label: "Cash" | "Credit";
  price: number;
  quantity: number;
  isBestOffer?: boolean;
  className?: string;
}

function PriceDisplay({ label, price, quantity, isBestOffer, className = "" }: PriceDisplayProps) {
  const tooltipText = `This is the best ${label.toLowerCase()} offer available across all stores`;
  const priceDisplay = (
    <div className={`px-4 w-full md:w-[120px] flex flex-col items-center ${className} ${isBestOffer ? 'cursor-help' : ''}`}>
      <div className="flex items-center gap-1">
        <span className="text-xs uppercase font-montserrat">{label}</span>
        {isBestOffer && (
          <BadgeDollarSign className="size-4 text-primary" />
        )}
      </div>
      <span className="flex items-center gap-1.5">
        <p className="font-bold text-sm">
          ${price.toFixed(2)} × {quantity}
        </p>
      </span>
    </div>
  );

  if (isBestOffer) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {priceDisplay}
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return priceDisplay;
}

export default function PurchasingCardDetails({
  cardName,
  condition,
  setName,
  rarity,
  foil,
  image,
  cashPrice,
  creditPrice,
  purchaseQuantity,
  bestCashOffer,
  bestCreditOffer
}: CardDetailsProps) {
  return (
    <div className="rounded-lg flex flex-col md:flex-row md:justify-between">
      <div className="flex flex-row items-center gap-3">
      <div className="w-12 flex-shrink-0">
          <CardImage imageUrl={image} alt={cardName} />
        </div>
        <div className="space-y-1 flex flex-col w-full">
          <h3 className="text-sm font-semibold capitalize">
            {cardName}
          </h3>
        <div className="font-montserrat text-xs font-medium uppercase text-muted-foreground">
          {setName}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">{condition}</span>
          {foil !== "Non-Foil" && foil !== "Normal" && (
            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
              {foil}
            </span>
          )}
                    <span className="capitalize rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">{rarity}</span>

        </div>
      </div>
      </div>

      <div className="mt-3 md:mt-0 flex flex-row items-center min-w-fit">
        <PriceDisplay
          label="Cash"
          price={cashPrice}
          quantity={purchaseQuantity}
          isBestOffer={bestCashOffer}
        />
        <PriceDisplay
          label="Credit"
          price={creditPrice}
          quantity={purchaseQuantity}
          isBestOffer={bestCreditOffer}
          className="border-l border-border"
        />
      </div>
    </div>
  );
} 

