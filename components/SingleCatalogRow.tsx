import React, { useState } from 'react';
import { SingleSearchResult } from '@/stores/store';
type Props = {
  cardData: SingleSearchResult;
};

import { useStore } from '@/stores/store';
import { trackOutboundLink } from '../utils/analytics';
import { Button } from './ui/button';
import Link from 'next/link';

export default function SingleCatalogRow({ cardData }: Props) {
  const { websites } = useStore();

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
      <>
        <div className="outlined-container my-2 grid grid-cols-12 gap-4 p-2 shadow-sm transition-all sm:my-3 sm:p-4">
          <div className="col-span-3 flex">
            <img
              src={cardData.image}
              alt="card"
              className="w-16 cursor-pointer rounded-md object-contain md:w-24"
              onClick={handleImageClick}
            />
          </div>
          {isModalOpen && <ImageModal src={cardData.image} alt="card" />}

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
