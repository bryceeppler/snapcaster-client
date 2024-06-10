import React, { useState } from 'react';
import { AdvancedSearchResult } from '@/stores/advancedStore';
import { handleBuyClick } from '../../utils/analytics';
type Props = {
  cardData: AdvancedSearchResult;
  tcg: string;
};

import { useStore } from '@/stores/store';
import { Button } from '../ui/button';
import Link from 'next/link';

export default function SingleCatalogRow({ cardData, tcg }: Props) {
  const { websites, promoMap } = useStore();

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

  return (
    <>
      <div
        className={` outlined-container mx-auto my-2 flex gap-x-4 p-2 shadow-sm transition-all sm:my-3 sm:w-[100%] sm:p-4 md:w-[90%] `}
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
              {cardData.promo == true && (
                <div className="mb-1 mr-1 rounded border px-2 py-1 text-xs capitalize text-primary">
                  <p>Promo</p>
                </div>
              )}
              {cardData.promo_prerelease == true && (
                <div className="mb-1 mr-1 rounded border px-2 py-1 text-xs capitalize text-primary">
                  <p>Pre Release</p>
                </div>
              )}
              {cardData.promo_pack == true && (
                <div className="mb-1 mr-1 rounded border px-2 py-1 text-xs capitalize text-primary">
                  <p>Promo Pack</p>
                </div>
              )}
              {cardData.foil == 'foil' && (
                <div className="mb-1 mr-1 rounded border px-2 py-1 text-xs capitalize text-primary">
                  <p>{cardData.foil}</p>
                </div>
              )}
              {cardData.foil != '' && cardData.foil != 'foil' && (
                <div className="mb-1 mr-1 rounded border px-2 py-1 text-xs capitalize text-primary">
                  <p>{cardData.foil + ' foil'}</p>
                </div>
              )}
              {cardData.showcase != '' && (
                <div className="mb-1 mr-1 rounded border px-2 py-1 text-xs capitalize text-primary">
                  <p>showcase</p>
                </div>
              )}
              {cardData.showcase != '' && cardData.showcase != 'showcase' && (
                <div className="mb-1 mr-1 rounded border px-2 py-1 text-xs capitalize text-primary">
                  <p>{cardData.showcase}</p>
                </div>
              )}

              {cardData.frame != '' && (
                <div className="mb-1 mr-1 rounded border px-2 py-1 text-xs capitalize text-primary">
                  <p>{cardData.frame}</p>
                </div>
              )}

              {cardData.alternate_art == true && (
                <div className="mb-1 mr-1 rounded border px-2 py-1 text-xs capitalize text-primary">
                  <p>Alternate Art</p>
                </div>
              )}
              {cardData.alternate_art_japanese == true && (
                <div className="mb-1 mr-1 rounded border px-2 py-1 text-xs capitalize text-primary">
                  <p>Japanese</p>
                </div>
              )}
              {cardData.art_series == true && (
                <div className="mb-1 mr-1 rounded border px-2 py-1 text-xs capitalize text-primary">
                  <p>Art Series</p>
                </div>
              )}
              {cardData.golden_stamped_art_series == true && (
                <div className="mb-1 mr-1 rounded border px-2 py-1 text-xs capitalize text-primary">
                  <p>Golden Stamped</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className=" ml-auto mt-2">
          <div className="flex">
            <div className="flex flex-col items-end">
              <div className="text-lg font-bold ">${cardData.price}</div>

              <div className="flex flex-row space-x-2">
                {cardData.foil && (
                  <div className="text-sm font-extrabold text-primary">
                    Foil
                  </div>
                )}
                <div className="text-sm font-bold">{cardData.condition}</div>
              </div>
              <div className="p-2" />
              <Button
                asChild
                onClick={() => {
                  handleBuyClick(
                    cardData.link,
                    cardData.price,
                    cardData.name,
                    tcg
                  );
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
