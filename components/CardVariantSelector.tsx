import { MultiSearchCardState } from '@/store';
import React from 'react'
import { useStore } from '@/store'

type Props = {
  card: MultiSearchCardState
}

export default function CardVariantSelector({card}: Props) {
  console.log(card)
  // Basic modal that displays all of card.variants and allows us to update the selectedVariant in the zustand store
  const [modalOpen, setModalOpen] = React.useState(false);
  const { updateSelectedVariant } = useStore();
  // const fetchWebsiteName = (websiteCode) => {
  //   let website = store.websiteCodeMap.find(
  //     (website) => website.code === websiteCode.toLowerCase()
  //   );
  //   if (website) {
  //     return website.name;
  //   } else {
  //     return websiteCode;
  //   }
  // };

  return (
    <div>
      <button
        onClick={() => {
          setModalOpen(true);
        }}
        className="m-2 p-2 rounded-md bg-pink-500 text-sm w-full transition-all hover:bg-pink-800 text-white"
      >
        Other results
      </button>
      {modalOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-gray-600 bg-opacity-80 flex justify-center items-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setModalOpen(false);
            }
          }}
        >
          <div
            className="bg-gray-800 rounded-md pt-4 px-2 mx-1"
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
                  className="m-2 p-2 rounded-md bg-gray-900"
                  onChange={(e) => {
                    // store.sortVariants(card, e.target.value);
                  }}
                >
                  <option value="price">Price</option>
                  <option value="condition">Condition</option>
                  <option value="website">Website</option>
                </select>
              </div>
              {/* Close button */}
              <div>
                <button
                  onClick={() => {
                    setModalOpen(false);
                  }}
                  className="p-2 rounded-md bg-red-700 text-white"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Scrollable */}
            <div className="max-h-96 overflow-y-scroll m-2 mb-4">
              <div className="grid grid-cols-1">
                {card.variants.map((variant, index) => {
                  return (
                    <div
                      key={index}
                      className="flex flex-row m-2 p-2 bg-gray-800 hover:bg-gray-900 rounded"
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