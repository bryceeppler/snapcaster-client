import { AlertCircle, Ban } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import CardImage from '@/components/ui/card-image';

interface UnpurchasableCardDetailsProps {
  cardName: string;
  condition: string;
  setName: string;
  rarity: string;
  foil: string;
  reason: string;
  image: string;
}

export default function UnpurchasableCardDetails({
  cardName,
  condition,
  setName,
  rarity,
  foil,
  reason,
  image
}: UnpurchasableCardDetailsProps) {
  return (
    <div className="rounded-lg flex flex-col">
      <div className="flex flex-row gap-3">
      <div className="w-12 flex-shrink-0">
          <CardImage imageUrl={image} alt={cardName} />
        </div>
        <div className="space-y-1">
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
      <div className="mt-2">
        <Badge className="bg-red-500/80 hover:bg-red-500/80">
          {reason}
        </Badge>
      </div>
    </div>
  );
} 