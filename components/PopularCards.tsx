import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loadingspinner from './Loadingspinner';
import LoadingDots from './ui/LoadingDots';

type Props = {};

type CardInfo = {
  name: string;
  image_url: string;
  price: number | null;
};

export default function PopularCards({}: Props) {
  const [popularCards, setPopularCards] = useState<CardInfo[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SNAPCASTER_API_URL}/utils/popular_cards/`)
      .then((res) => {
        let popularCards = [...res.data.monthly, ...res.data.weekly]
        // remove duplicates
        popularCards = popularCards.filter((card, index, self) =>
            index === self.findIndex((t) => (
                t.name === card.name
            ))
        )
        setPopularCards(popularCards);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const nextCard = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % popularCards.length);
  };

  const prevCard = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + popularCards.length) % popularCards.length);
  };

  const getCardIndex = (offset: number) => {
    const newIndex = activeIndex + offset;
    return newIndex >= 0 ? newIndex % popularCards.length : popularCards.length + newIndex;
  };

  const visibleCards = [
    popularCards[getCardIndex(-1)],
    popularCards[getCardIndex(0)],
    popularCards[getCardIndex(1)],
  ];

  return (
    <div className="w-full max-w-3xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Popular Cards</h2>
      {/* if data in popular cards, show carousel, otherwise show loading spinner */}
      {
        popularCards.length > 0 ? (
      <div className="flex justify-center items-center">
        <button
          className="bg-white bg-opacity-75 p-2 rounded-r"
          onClick={prevCard}
        >
          &lt;
        </button>
        {visibleCards.map((card, index) => (
          <div key={index} className={`sm:w-1/3 mx-2 flex flex-col items-center ${
            //  if small or below, hide all but index 0
            index === 0 ? 'block' : 'hidden sm:block'
          }`}>
            <div className="h-48 w-full flex items-center">
              <img className="max-h-full max-w-full object-contain mx-auto" src={card.image_url} alt={card.name} />
            </div>
            <p className="text-center mt-2 truncate w-36">{card.name}</p>
            <p className="text-center text-gray-600">
              {card.price ? `$${card.price.toFixed(2)}` : 'Price not available'}
            </p>
          </div>
        ))}
        <button
          className="bg-white bg-opacity-75 p-2 rounded-l"
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
