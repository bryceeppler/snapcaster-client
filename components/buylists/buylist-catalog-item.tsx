import { Card } from '@/components/ui/card';
import CardImage from '../ui/card-image';
import { Button } from '../ui/button';
import React, { memo } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '../ui/input';
import { MinusIcon, PlusIcon } from 'lucide-react';

type Props = { cardData: any };

const BuyListCatalogItem = memo(function ResultCard({ cardData }: Props) {
  return (
    <>
      <Card className="h-full">
        <div className="border-border-colour flex h-full flex-col rounded-md bg-popover p-4">
          <div className="flex-shrink-0">
            <div className="flex h-full items-center justify-center">
              <div className="relative mx-auto h-min max-w-[150px] px-4 md:max-w-[250px]">
                <CardImage imageUrl={cardData.image} alt="test image" />
              </div>
            </div>
          </div>
          <div className="mt-2 flex flex-1 flex-col justify-between">
            <div>
              <div className="font-montserrat text-[0.65rem] font-semibold uppercase text-primary-light">
                {cardData.set}
              </div>

              <h3 className="overflow-hidden text-ellipsis text-[0.9rem] font-semibold capitalize tracking-tight">
                {`${cardData.name} `}
              </h3>
              <div className="flex flex-row gap-2 text-sm font-semibold capitalize text-muted-foreground">
                <p>
                  {cardData.rarity} - {cardData.foil}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Dialog>
                <DialogTrigger className="w-full">
                  <Button
                    className="w-full rounded-b-lg border-border bg-popover font-montserrat text-xs uppercase"
                    variant="outline"
                  >
                    Add To Cart
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-min rounded-lg px-16">
                  <div className="flex h-full items-center justify-center  ">
                    <div className="relative mx-auto h-min w-[250px] px-4 ">
                      <CardImage imageUrl={cardData.image} alt="test image" />
                    </div>
                  </div>

                  <div className="mt-2">
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
                    <div className="mt-4">
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-base font-medium">Near Mint</p>
                        <div className="flex h-8 items-center rounded-xl border">
                          <button className="flex h-full w-8 items-center justify-center rounded-l-xl text-sm hover:bg-accent">
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          <input
                            type="text"
                            className="w-8 bg-background text-center text-sm font-semibold focus:outline-none"
                            defaultValue={0}
                            maxLength={2}
                          />
                          <button className="flex h-full w-8 items-center justify-center  rounded-r-xl text-sm hover:bg-accent">
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
});
export default BuyListCatalogItem;
