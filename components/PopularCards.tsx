import { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingDots from './ui/LoadingDots';
import { useStore } from "store";

type Props = {
  popularCards: CardInfo[];
};

export type CardInfo = {
  name: string;
  image_url: string;
  price: number | null;
};

export default function PopularCards({ popularCards }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState<CardInfo[]>([]);
  const { setSingleSearchInput, fetchSingleSearchResults } = useStore();

  useEffect(() => {
    const getCardIndex = (offset: number) => {
      const newIndex = activeIndex + offset;
      return newIndex >= 0
        ? newIndex % popularCards.length
        : popularCards.length + newIndex;
    };

    setVisibleCards([
      popularCards[getCardIndex(-1)],
      popularCards[getCardIndex(0)],
      popularCards[getCardIndex(1)],
    ]);
  }, [activeIndex, popularCards]);


  const nextCard = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % popularCards.length);
  };

  const prevCard = () => {
    setActiveIndex(
      (prevIndex) => (prevIndex - 1 + popularCards.length) % popularCards.length
    );
  };

  const handleCardClick = (cardName: string) => {
    setSingleSearchInput(cardName);
    fetchSingleSearchResults(cardName);
  };

    // Filter out any undefined elements
    const filteredVisibleCards = visibleCards.filter(card => card !== undefined);



  return (
    <div className="mx-auto mt-6 w-full max-w-3xl rounded-md p-4 border border-1 border-zinc-600 backdrop-blur-md backdrop-brightness-75 ">
      <h2 className="mb-4 text-center text-2xl font-bold">Popular Cards</h2>
      {popularCards.length > 0 ? (
        <div className="flex items-center justify-center">
          <button
            className="rounded-r bg-white bg-opacity-75 p-2"
            onClick={prevCard}
          >
            &lt;
          </button>
          {filteredVisibleCards.map((card, index) => (
            <div
              key={index}
              className={`mx-2 flex flex-col items-center sm:w-1/3 ${
                //  if small or below, hide all but index 0
                index === 0 ? 'block' : 'hidden sm:block'
              }`}
              onClick={() => handleCardClick(card.name)}
            >
              <div className="flex h-48 w-full items-center">
                <img
                  className="mx-auto max-h-full max-w-full object-contain"
                  src={card?.image_url}
                  alt={card?.name}
                />
              </div>
              <p className="mt-2 w-36 truncate text-center text-sm">
                {card.name}
              </p>
              <p className="text-center font-mono text-sm text-pink-300">
                {card.price
                  ? `$${card.price.toFixed(2)}`
                  : 'Price not available'}
              </p>
            </div>
          ))}
          <button
            className="rounded-l bg-white bg-opacity-75 p-2"
            onClick={nextCard}
          >
            &gt;
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center pt-5">
          <LoadingDots />
        </div>
      )}
    </div>
  );
}
