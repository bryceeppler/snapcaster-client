import React from 'react';
import { SingleSearchResult } from '@/stores/store';
type Props = {
  cardData: SingleSearchResult;
};

import { useStore } from '@/stores/store';
import { trackOutboundLink } from '../../utils/analytics';
import { Button } from '../ui/button';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card';
import CardImage from '../ui/card-image';

export default function SingleCatalogCard({ cardData }: Props) {
  const { websites } = useStore();

  const findWebsiteNameByCode = (code: string): string => {
    const website = websites.find((website) => website.code === code);
    return website ? website.name : 'Website not found';
  };

  function handleBuyClick(link: string, price: number) {
    const domain = link.split('/')[2];
    const priceInCents = price * 100;
    trackOutboundLink(domain, priceInCents);
  }

  return (
    <Card>
      <CardHeader className="items-center justify-center">
        <div className="w-full max-w-[300px]">
          <CardImage imageUrl={cardData.s3_image_url} alt={cardData.name} />
        </div>
      </CardHeader>
      <CardContent className="text-left">
        <p className="text-xs capitalize opacity-70">{cardData.set}</p>
        <p className="text-sm font-bold">{cardData.name}</p>
        <div className="p-1"></div>
        <p className="text-xs opacity-70">
          {findWebsiteNameByCode(cardData.website)}
        </p>
        <p className="text-sm">{cardData.condition}</p>
        <p className="text-sm font-bold">${cardData.priceBeforeDiscount}</p>
      </CardContent>
      <div className="flex-grow"></div>
      <CardFooter>
        <Link
          href={cardData.link}
          target="_blank"
          rel="noreferrer"
          className="w-full"
        >
          <Button
            onClick={() =>
              handleBuyClick(cardData.link, cardData.priceBeforeDiscount)
            }
            className="w-full"
          >
            Buy
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
