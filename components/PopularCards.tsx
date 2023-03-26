import { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingDots from './ui/LoadingDots';

type Props = {
  popularCards: CardInfo[];
};

export type CardInfo = {
  name: string;
  image_url: string;
  price: number | null;
};

export default function PopularCards({ popularCards }: Props) {
  // const [popularCards, setPopularCards] = useState<CardInfo[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // useEffect(() => {
  //   axios
  //     .get(`${process.env.NEXT_PUBLIC_SNAPCASTER_API_URL}/utils/popular_cards/`)
  //     .then((res) => {
  //       let popularCards = [...res.data.monthly, ...res.data.weekly];
  //       // remove duplicates
  //       popularCards = popularCards.filter(
  //         (card, index, self) =>
  //           index === self.findIndex((t) => t.name === card.name)
  //       );
  //       setPopularCards(popularCards);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  const nextCard = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % popularCards.length);
  };

  const prevCard = () => {
    setActiveIndex(
      (prevIndex) => (prevIndex - 1 + popularCards.length) % popularCards.length
    );
  };

  const getCardIndex = (offset: number) => {
    const newIndex = activeIndex + offset;
    return newIndex >= 0
      ? newIndex % popularCards.length
      : popularCards.length + newIndex;
  };

  const visibleCards = [
    popularCards[getCardIndex(-1)],
    popularCards[getCardIndex(0)],
    popularCards[getCardIndex(1)]
  ];

  return (
    <div className="mx-auto mt-6 w-full max-w-3xl rounded-md p-4 outline outline-1 outline-zinc-800 backdrop-blur-sm backdrop-brightness-75 ">
      <h2 className="mb-4 text-center text-2xl font-bold">Popular Cards</h2>
      {popularCards.length > 0 ? (
        <div className="flex items-center justify-center">
          <button
            className="rounded-r bg-white bg-opacity-75 p-2"
            onClick={prevCard}
          >
            &lt;
          </button>
          {visibleCards.map((card, index) => (
            <div
              key={index}
              className={`mx-2 flex flex-col items-center sm:w-1/3 ${
                //  if small or below, hide all but index 0
                index === 0 ? 'block' : 'hidden sm:block'
              }`}
            >
              <div className="flex h-48 w-full items-center">
                <img
                  className="mx-auto max-h-full max-w-full object-contain"
                  src={card.image_url}
                  alt={card.name}
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
