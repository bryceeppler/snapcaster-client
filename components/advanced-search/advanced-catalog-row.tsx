import React, { useState } from 'react';
import { AdvancedSearchResult } from '@/stores/advancedStore';

type Props = {
  cardData: AdvancedSearchResult;
};

import { useStore } from '@/stores/store';
import { trackOutboundLink } from '../../utils/analytics';
import { Button } from '../ui/button';
import Link from 'next/link';

export default function SingleCatalogRow({ cardData }: Props) {
  const { websites, sponsor, promoMap } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const ImageModal = ({ src, alt }: { src: string; alt: string }) => {
    if (!isModalOpen) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        onClick={closeModal}
      >
        <div className="w-full max-w-xl rounded-lg p-4 shadow-lg">
          <img
            src={src}
            alt={alt}
            className="mx-auto h-auto max-h-[70vh] max-w-full rounded-lg"
          />
        </div>
      </div>
    );
  };

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
      <div
        className={` outlined-container mx-auto my-2 flex gap-x-4 p-2 shadow-sm transition-all sm:my-3 sm:w-[100%] sm:p-4 md:w-[60%] `}
      >
        <div>
          <img
            src={cardData.image}
            alt="card"
            className="w-32 cursor-pointer rounded-md object-contain"
            onClick={handleImageClick}
          />
        </div>
        {isModalOpen && <ImageModal src={cardData.image} alt="card" />}
        <div className="mt-2 w-full">
          <div className="text-left">
            <div className="text-sm capitalize">{cardData.set}</div>
            <div className="text-md font-bold">{cardData.name}</div>
            <div className="pb-2 text-sm">
              {findWebsiteNameByCode(cardData.website)}
            </div>

            <div className=" flex  flex-wrap font-serif text-xs font-semibold">
              {cardData.website in promoMap && (
                <div className="mb-1 mr-1 max-w-fit rounded-sm bg-gradient-to-tl from-rose-600 to-rose-800 px-1 text-center align-middle lowercase">
                  <p>
                    {`-${(
                      (1 - promoMap[cardData.website]['discount']) *
                      100
                    ).toFixed(0)}% ${promoMap[cardData.website]['promoCode']}`}
                  </p>
                </div>
              )}
              {cardData.promo == true && (
                <div className="mb-1 mr-1 w-max rounded bg-pink-600 px-1 capitalize">
                  <p>Promo</p>
                </div>
              )}
              {cardData.preRelease == true && (
                <div className="mb-1 mr-1 w-max rounded bg-pink-600 px-1 capitalize">
                  <p>Pre Release</p>
                </div>
              )}
              {cardData.promoPack == true && (
                <div className="mb-1 mr-1 w-max rounded bg-pink-600 px-1 capitalize">
                  <p>Promo Pack</p>
                </div>
              )}
              {cardData.foil == 'foil' && (
                <div className="mb-1 mr-1 w-max rounded bg-pink-600 px-1 capitalize">
                  <p>{cardData.foil}</p>
                </div>
              )}
              {cardData.foil != null && cardData.foil != 'foil' && (
                <div className="mb-1 mr-1 w-max rounded bg-pink-600 px-1 capitalize">
                  <p>{cardData.foil + ' foil'}</p>
                </div>
              )}
              {cardData.showcase != null && (
                <div className="mb-1 mr-1 w-max rounded bg-pink-600 px-1 capitalize">
                  <p>showcase</p>
                </div>
              )}
              {cardData.showcase != null && cardData.showcase != 'showcase' && (
                <div className="mb-1 mr-1 w-max rounded bg-pink-600 px-1 capitalize">
                  <p>{cardData.showcase}</p>
                </div>
              )}

              {cardData.frame != null && (
                <div className="mb-1 mr-1 w-max rounded bg-pink-600 px-1 capitalize">
                  <p>{cardData.frame}</p>
                </div>
              )}

              {cardData.alternateArt == true && (
                <div className="mb-1 mr-1 w-max rounded bg-pink-600 px-1 capitalize">
                  <p>Alternate Art</p>
                </div>
              )}
              {cardData.alternateArtJapanese == true && (
                <div className="mb-1 mr-1 w-max rounded bg-pink-600 px-1 capitalize">
                  <p>Japanese</p>
                </div>
              )}
              {cardData.artSeries == true && (
                <div className="mb-1 mr-1 w-max rounded bg-pink-600 px-1 capitalize">
                  <p>Art Series</p>
                </div>
              )}
              {cardData.goldenStampedSeries == true && (
                <div className="mb-1 mr-1 w-max rounded bg-pink-600 px-1 capitalize">
                  <p>Golden Stamped</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className=" ml-auto mt-2">
          <div className="flex">
            <div className="flex flex-col items-end">
              {cardData.website in promoMap ? (
                <div className="flex text-lg font-bold ">
                  <p className="pr-1 text-green-600">${cardData.price}</p>
                  <p className="text-red-600 line-through decoration-2">
                    ${cardData.priceBeforeDiscount}
                  </p>
                </div>
              ) : (
                <div className="text-lg font-bold ">${cardData.price}</div>
              )}

              <div className="flex flex-row space-x-2">
                {cardData.foil && (
                  <div className="text-sm font-extrabold text-pink-500">
                    Foil
                  </div>
                )}
                <div className="text-sm font-bold">{cardData.condition}</div>
              </div>
              <div className="p-2" />
              <Button
                asChild
                onClick={() => {
                  handleBuyClick(cardData.link, cardData.price);
                }}
              >
                <Link href={cardData.link} target="_blank" rel="noreferrer">
                  Buy
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
