import { MultiSearchCardState } from '@/stores/store';
import React from 'react'
import { useStore } from '@/stores/store'
import CloseButton from './CloseButton'
import { Button } from './ui/button'

type Props = {
  card: MultiSearchCardState
}

export default function CardVariantSelector({card}: Props) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const { updateSelectedVariant, sortMultiSearchVariants: sortVariants } = useStore();


  return (
    <div>
      <Button
        onClick={() => {
          setModalOpen(true);
        }}
        className="p-2 text-sm w-full btn-dark"
      >
        Other results
      </Button>
      {modalOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setModalOpen(false);
            }
          }}
        >
          <div
            className="bg-zinc-900  pt-4 px-2 mx-1 md:w-1/2 outlined-container"
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
              flex flex-row items-center
              mx-4
            "
              >
                <div className="font-bold font-md ">Sort by:</div>
                <select
                  className="m-2 p-2 input-dark"
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
              <CloseButton onClick={() => setModalOpen(false)} />

              </div>
            </div>

            {/* Scrollable */}
            <div className="max-h-96 overflow-y-scroll m-2 mb-4">
              <div className="grid grid-cols-1">
                {card.variants.map((variant, index) => {
                  return (
                    <div
                      key={index}
                      className="flex flex-row m-2 p-2 outlined-container hover:bg-zinc-800 cursor-pointer"
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
                      <div className="mt-2 ml-4">
                        <div className="">
                          <div className="text-sm">{variant.set}</div>
                          <div className="flex flex-row space-x-4 text-left my-1">
                            <div className="text-lg font-bold">
                              ${variant.price}
                            </div>
                            <div className="text-lg">{variant.condition}</div>
                            {variant.foil && (
                              <div
                                // put content centered vertically and horizontally
                                className="rounded-xl px-2 bg-gradient-to-tr from-pink-600 to-purple-500 flex justify-center items-center"
                              >
                                <div className="text-sm tracking-wide">
                                  Foil
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="opacity-70">
                            {variant.website}
                          </div>
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