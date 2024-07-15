import React from 'react';
import { SingleSearchResult } from '@/stores/store';
type Props = {
  cardData: SingleSearchResult;
  tcg: string;
  promo?: boolean;
};

import { useStore } from '@/stores/store';
import { Button } from '../ui/button';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card';
import CardImage from '../ui/card-image';
import { handleBuyClick } from '../../utils/analytics';

export default function SingleCatalogCard({ cardData, tcg, promo }: Props) {
  const { websites } = useStore();

  const findWebsiteNameByCode = (slug: string): string => {
    const website = websites.find((website) => website.slug === slug);
    return website ? website.name : 'Website not found';
  };

  return (
    <Card className={`${promo && 'border-primary'} flex h-full flex-col`}>
      <CardHeader className="flex items-center justify-center">
        <div className="w-full max-w-[300px]">
          <CardImage imageUrl={cardData.image} alt={cardData.name} />
        </div>
      </CardHeader>
      <div className="flex flex-grow flex-col justify-end">
        <CardContent className="text-left">
          <p className="text-xs capitalize opacity-70">{cardData.set}</p>
          <p className="text-sm font-bold">{cardData.name}</p>
          <div className="p-1"></div>

          <div className="flex flex-row gap-2">
            {cardData.website === 'obsidian' && (
              <img src="/obsidian_icon.png" alt="Website" className="h-4 w-4" />
            )}
            <p className="text-xs opacity-70">
              {findWebsiteNameByCode(cardData.website)}
            </p>
          </div>

          <p className="text-sm">{cardData.condition}</p>
          <p className="text-sm font-bold">${cardData.price}</p>
          {promo && <p className="text-sm opacity-50">Promoted result</p>}
        </CardContent>
        <CardFooter>
          <Link
            href={cardData.link}
            target="_blank"
            rel="noreferrer"
            className="w-full"
          >
            <Button
              onClick={() =>
                handleBuyClick(
                  cardData.link,
                  cardData.price,
                  cardData.name,
                  tcg
                )
              }
              className="w-full"
            >
              Buy
            </Button>
          </Link>
        </CardFooter>
      </div>
    </Card>
  );
}
