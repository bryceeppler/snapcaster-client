import React, { useState } from 'react';
import { AdvancedSearchResult } from '@/stores/advancedStore';

type Props = {
  cardData: AdvancedSearchResult;
};

import { useStore } from '@/stores/store';
import { trackOutboundLink } from '../utils/analytics';
import { Button } from './ui/button';
import Link from 'next/link';

export default function SingleCatalogRow({ cardData }: Props) {
  const { websites } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  // ... other hooks and functions

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
      <>
        <div className="outlined-container my-2 grid grid-cols-12 gap-4 p-2 shadow-sm transition-all sm:my-3 sm:p-4">
          <div className="col-span-3 flex">
            <img
              src={cardData.image}
              alt="card"
              className="w-max cursor-pointer rounded-md object-contain md:w-24"
              onClick={handleImageClick}
            />
          </div>
          {isModalOpen && <ImageModal src={cardData.image} alt="card" />}

          <div className="col-span-7 mt-2">
            <div className="flex flex-col text-left">
              <div className="text-sm">{cardData.set}</div>
              <div className="text-md font-bold">{cardData.name}</div>
              <div className="pb-2 text-sm">
                {findWebsiteNameByCode(cardData.website)}
              </div>
              <div className=" flex flex-wrap  text-xs">
                {cardData.preRelease == true && (
                  <div className="mr-1 w-max rounded bg-pink-600 px-1">
                    <p>Pre-Release</p>
                  </div>
                )}
                {cardData.promoPack == true && (
                  <div className="mr-1 w-max rounded bg-pink-600 px-1">
                    <p>Promo-Pack</p>
                  </div>
                )}
                {cardData.foil != null && cardData.foil != 'Foil' && (
                  <div className="mr-1 w-max rounded bg-pink-600 px-1">
                    <p>{cardData.foil}</p>
                  </div>
                )}
                {cardData.showcase != null && (
                  <div className="mr-1 w-max rounded bg-pink-600 px-1">
                    <p>{cardData.showcase}</p>
                  </div>
                )}

                {cardData.artType != null && (
                  <div className="mr-1 w-max rounded bg-pink-600 px-1">
                    <p>{cardData.artType}</p>
                  </div>
                )}

                {cardData.other != null && (
                  <div className="mr-1 w-max rounded bg-pink-600 px-1">
                    <p>{cardData.other}</p>
                  </div>
                )}

                {cardData.number > 0 && (
                  <div className="mr-1 w-max rounded bg-pink-600 px-1">
                    <p>{cardData.number}</p>
                  </div>
                )}
                {cardData.alternateArt == true && (
                  <div className="mr-1 w-max rounded bg-pink-600 px-1">
                    <p>Alternate-Art</p>
                  </div>
                )}
                {cardData.retro == true && (
                  <div className="mr-1 w-max rounded bg-pink-600 px-1">
                    <p>Retro</p>
                  </div>
                )}
                {cardData.artSeries == true && (
                  <div className="mr-1 w-max rounded bg-pink-600 px-1">
                    <p>Art-Series</p>
                  </div>
                )}
                {cardData.goldenStampedSeries == true && (
                  <div className="mr-1 w-max rounded bg-pink-600 px-1">
                    <p>Golden-Stamped</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-span-2 mt-2">
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
      </>
    </>
  );
}
