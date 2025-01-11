import { Card } from '@/components/ui/card';
import CardImage from '../ui/card-image';
import { Button } from '../ui/button';
import React, { memo } from 'react';

type Props = { cardData: any };

const BuyListCatalogItem = memo(function ResultCard({ cardData }: Props) {
  return (
    <>
      <Card>
        <div className="border-border-colour    rounded-md bg-popover p-4">
          <div>
            <div className="flex h-full items-center justify-center">
              <div className="relative mx-auto h-min max-w-[150px] px-4 md:max-w-[250px]">
                <CardImage imageUrl={cardData.image} alt="test image" />
              </div>
            </div>
          </div>
          <div className=" mt-2">
            <div>
              <div className="font-montserrat text-[0.65rem] font-semibold  uppercase text-primary-light">
                {cardData.set}
              </div>

              <h3 className="overflow-hidden text-ellipsis text-[0.9rem] font-semibold capitalize tracking-tight">{`${cardData.name} `}</h3>
            </div>
            <div className="mt-auto">
              <div className="flex flex-row gap-2 text-sm font-semibold capitalize text-muted-foreground">
                <p>
                  {cardData.rarity} - {cardData.foil}
                </p>
              </div>
            </div>
            <div className="mt-2 flex justify-center">
              <Button
                className="w-full rounded-b-lg border-border bg-popover font-montserrat text-xs uppercase"
                variant="outline"
              >
                Add To Cart
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
});
export default BuyListCatalogItem;
