import { MultiSearchCardState } from '@/stores/store';
import React from 'react';
import { useStore } from '@/stores/store';
import { Button } from '../ui/button';

type Props = {
  card: MultiSearchCardState;
};

export default function CardVariantSelector({ card }: Props) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const { updateSelectedVariant, sortMultiSearchVariants: sortVariants } =
    useStore();

  return (
    <div>
      <Button
        onClick={() => {
          setModalOpen(true);
        }}
        className="btn-dark w-full p-2 text-sm"
      >
        Other results
      </Button>
      {modalOpen && (
        <div
          className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setModalOpen(false);
            }
          }}
        >
          <div
            className="outlined-container  mx-1 bg-zinc-900 px-2 pt-4 md:w-1/2"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div
              className="flex flex-row justify-between
          "
            >
              {/* selector to choose what to sort by */}
              <div
                className="
              mx-4 flex flex-row
              items-center
            "
              >
                <div className="font-md font-bold ">Sort by:</div>
                <select
                  className="input-dark m-2 p-2"
                  onChange={(e) => {
                    sortVariants(card, e.target.value);
                  }}
                >
                  <option value="price">Price</option>
                  <option value="condition">Condition</option>
                  <option value="website">Website</option>
                </select>
              </div>
              {/* Close button */}
              <div>
                <Button onClick={() => setModalOpen(false)}>X</Button>
              </div>
            </div>

            {/* Scrollable */}
            <div className="m-2 mb-4 max-h-96 overflow-y-scroll">
              <div className="grid grid-cols-1">
                {card.variants.map((variant, index) => {
                  return (
                    <div
                      key={index}
                      className="outlined-container m-2 flex cursor-pointer flex-row p-2 hover:bg-zinc-800"
                      onClick={() => {
                        // store.updateSelectedVariant(card, variant);
                        updateSelectedVariant(card.cardName, variant);
                        setModalOpen(false);
                      }}
                    >
                      <img
                        src={variant.image}
                        alt={variant.name}
                        className="w-24 rounded-md"
                      />
                      {/* <div className="font-bold text-lg">{variant.name}</div> */}
                      <div className="ml-4 mt-2">
                        <div className="">
                          <div className="text-sm">{variant.set}</div>
                          <div className="my-1 flex flex-row space-x-4 text-left">
                            <div className="text-lg font-bold">
                              ${variant.price}
                            </div>
                            <div className="text-lg">{variant.condition}</div>
                            {variant.foil && (
                              <div
                                // put content centered vertically and horizontally
                                className="flex items-center justify-center rounded-xl bg-gradient-to-tr from-pink-600 to-purple-500 px-2"
                              >
                                <div className="text-sm tracking-wide">
                                  Foil
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="opacity-70">{variant.website}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
