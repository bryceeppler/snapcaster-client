import React from 'react';
import { SingleSearchResult } from '@/stores/store';
type Props = {
  cardData: SingleSearchResult;
};
import { useStore } from '@/stores/store';
import { trackOutboundLink } from '../utils/analytics';


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
    <>
      <>
        <div className="grid grid-cols-12 gap-4 my-2 p-2 sm:my-3 sm:p-4 rounded-md transition-all bg-zinc-800 hover:bg-zinc-700">
          <div className="col-span-3 flex">
            <img
              src={cardData.image}
              alt="card"
              className="w-16 md:w-24 rounded-md object-contain"
            />
          </div>
          <div className="col-span-5 mt-2">
            <div className="flex flex-col text-left">
              <div className="text-sm">{cardData.set}</div>
              <div className="text-md font-bold">{cardData.name}</div>
              <div className="text-sm">
                {findWebsiteNameByCode(cardData.website)}
              </div>
            </div>
          </div>
          <div className="col-span-4 mt-2">
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
              <a
                className="transition-all bg-zinc-600 hover:bg-zinc-900 text-white font-bold p-1 px-2 sm:py-1 sm:px-4 rounded focus:outline-none focus:shadow-outline mt-4 "
                href={cardData.link}
                data-price={cardData.price}
                target="_blank"
                id="buy-button"
                onClick={() => handleBuyClick(cardData.link, cardData.price)}
              >
                Buy
              </a>
            </div>
          </div>
        </div>
      </>
    </>
  );
}
