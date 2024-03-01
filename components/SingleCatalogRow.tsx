import React, {useState} from 'react';
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
  // ... other hooks and functions

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const ImageModal = ({ src, alt }: { src: string, alt: string }) => {
    if (!isModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={closeModal}>
      <div className="p-4 rounded-lg max-w-xl w-full shadow-lg">
        <img 
          src={src} 
          alt={alt} 
          className="max-w-full max-h-[70vh] h-auto rounded-lg mx-auto" 
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
        <div className="grid grid-cols-12 gap-4 my-2 p-2 sm:my-3 sm:p-4 outlined-container transition-all shadow-sm">
          <div className="col-span-3 flex">
          <img
          src={cardData.image}
          alt="card"
          className="w-16 md:w-24 rounded-md object-contain cursor-pointer"
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
              <div className="p-2"/ >
              <Button
               asChild
                onClick={() => {
                  handleBuyClick(cardData.link, cardData.price)
                }
              }
              >
               <Link href={cardData.link} 
                target="_blank" 
                rel="noreferrer" 
               >
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
