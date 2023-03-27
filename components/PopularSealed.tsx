import { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingDots from './ui/LoadingDots';

type Props = {
  popularSealed: SealedProductInfo[];
};

export type SealedProductInfo = {
  name: string;
  count: number;
  product_name: string;
  product_image: string;
  product_price: number | null;
};

export default function PopularSealed({ popularSealed }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  // useEffect(() => {
  //   // Remove duplicates
  //   popularSealed = popularSealed.filter(
  //     (card, index, self) =>
  //       index === self.findIndex((t) => t.name === card.name)
  //   );
  //   console.log(popularSealed)
  // }, []);

  const nextSealedProduct = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % popularSealed.length);
  };

  const prevSealedProduct = () => {
    setActiveIndex(
      (prevIndex) => (prevIndex - 1 + popularSealed.length) % popularSealed.length
    );
  };

  const getSealedProductIndex = (offset: number) => {
    const newIndex = activeIndex + offset;
    return newIndex >= 0
      ? newIndex % popularSealed.length
      : popularSealed.length + newIndex;
  };

  const visibleSealed = [
    popularSealed[getSealedProductIndex(-1)],
    popularSealed[getSealedProductIndex(0)],
    popularSealed[getSealedProductIndex(1)]
  ];

  return (
    <div className="mx-auto mt-6 w-full max-w-3xl rounded-md p-4 outline outline-1 outline-zinc-800 backdrop-blur-sm backdrop-brightness-75 ">      <h2 className="text-2xl font-bold mb-4 text-center">Popular searches</h2>
      {popularSealed.length > 0 ? (
        <div className="flex justify-center items-center">
          <button
            className="bg-white bg-opacity-75 p-2 rounded-r"
            onClick={prevSealedProduct}
          >
            &lt;
          </button>
          {visibleSealed.map((product, index) => (
            <div
              key={index}
              className={`sm:w-1/3 mx-2 flex flex-col items-center ${
                //  if small or below, hide all but index 0
                index === 0 ? 'block' : 'hidden sm:block'
              }`}
            >
              <div className="h-48 w-full flex items-center">
                <img
                  className="max-h-full max-w-full object-contain mx-auto"
                  src={product.product_image}
                  alt={product.product_name}
                />
              </div>
              <p className="text-center mt-2 truncate w-36 text-sm">{product.product_name}</p>
              <p className="text-center text-sm font-mono text-pink-300">
                {product.product_price
                  ? `$${product.product_price.toFixed(2)}`
                  : 'Price not available'}
              </p>
            </div>
          ))}
          <button
            className="bg-white bg-opacity-75 p-2 rounded-l"
            onClick={nextSealedProduct}
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
