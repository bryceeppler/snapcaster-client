import React from 'react';
import { SingleSearchResult } from '@/stores/store';
type Props = {
  cardData: SingleSearchResult;
};

import { useStore } from '@/stores/store';
import { trackOutboundLink } from '../../utils/analytics';
import { Button } from '../ui/button';
import Link from 'next/link';
import CardImage from '../ui/card-image';

export default function SingleCatalogRow({ cardData }: Props) {
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
    <div className="outlined-container mx-auto my-2 flex max-w-3xl flex-col gap-4 p-3 shadow-sm transition-all sm:my-3 sm:p-4">
      <div className="flex w-full gap-4">
        <div className="w-20">
          <CardImage imageUrl={cardData.image} alt={cardData.name} />
        </div>
        <div className="grid w-full grid-cols-9">
          <div className="col-span-9 mt-2 sm:col-span-5">
            <div className="flex flex-col text-left">
              <div className="text-sm capitalize">{cardData.set}</div>
              <div className="text-md font-bold">{cardData.name}</div>
              <div className="text-sm">
                {findWebsiteNameByCode(cardData.website)}
              </div>
            </div>
          </div>
          <div className="col-span-4 mt-2 hidden sm:grid">
            <div className="flex flex-col items-end">
              <div className="text-lg font-bold">${cardData.price}</div>
              <div className="flex flex-row space-x-2">
                {cardData.foil && (
                  <div className="text-sm font-extrabold text-pink-500">
                    Foil
                  </div>
                )}
                <div className="text-sm font-bold">{cardData.condition}</div>
              </div>
              <div className="p-2" />
              <Link
                href={cardData.link}
                target="_blank"
                rel="noreferrer"
                className="w-full"
              >
                <Button
                  onClick={() => handleBuyClick(cardData.link, cardData.price)}
                  className="w-full"
                >
                  Buy
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex-col text-right sm:hidden">
        <div className="ml-1 flex flex-row justify-start">
          <div className="flex flex-row gap-3">
            {cardData.foil && (
              <div className="text-lg font-extrabold text-pink-500">Foil</div>
            )}
            <div className="text-lg font-bold">{cardData.condition}</div>{' '}
            <div className="text-lg font-bold">${cardData.price}</div>
          </div>
        </div>
        <Link
          href={cardData.link}
          target="_blank"
          rel="noreferrer"
          className="w-full"
        >
          <Button
            onClick={() => handleBuyClick(cardData.link, cardData.price)}
            className="w-full"
          >
            Buy
          </Button>
        </Link>
      </div>
    </div>
  );
}
