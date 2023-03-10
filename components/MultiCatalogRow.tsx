import React from 'react'
import { MultiSearchCard, SingleSearchResult } from '@/store'

type Props = {
    cardData: MultiSearchCard
}

export default function MultiCatalogRow({cardData:card}: Props) {
    return (
        // if card.selected == true change bg color to red
        <div
          className={
            // card.selected
            true
              ? "transition-all mt-6 p-3 bg-white hover:bg-gray-300 dark:bg-gray-900 dark:hover:bg-gray-700 rounded-md my-2 outline outline-offset-2 outline-2 outline-purple-700 "
              : "transition-all mt-6 p-3 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md my-2"
          }
          onClick={() => {
            // store.toggleSelectCard(card);
          }}
        >
          <div className="grid grid-cols-12 space-x-8">
            <div className="col-span-4 flex flex-col sm:items-center sm:justify-center">
              <img
                src={selectedVariant.image}
                alt={selectedVariant.name}
                className="h-fit rounded-lg"
              />
            </div>
            <div className="col-span-7 flex flex-col text-left">
              <div className="text-md font-bold mt-2">{selectedVariant.name}</div>
              <div className="text-gray-400">
                {
                  fetchWebsiteName(
                    selectedVariant.website)
                }
              </div>
              <div className="text-xl font-bold">${selectedVariant.price}</div>
              <div className="font-bold text-lg">
                {selectedVariant.condition}
              </div>
              {selectedVariant.foil && (
                <div
                  // gold foil text
                  className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-gray-300 to-gray-400"
                >
                  Foil
                </div>
              )}
    
              <div className="my-auto" />
              {/* <div className="flex flex-col space-y-1">
                <CardVariantSelector card={card} />
                <button
                  className="m-2 p-2 rounded-md bg-purple-500 text-sm w-full"
                  onClick={() => {
                    openWesbiteNewTab(selectedVariant.link);
                  }}
                >
                  Buy
                </button>
              </div> */}
              <div className="flex-col">
                <CardVariantSelector card={card} />
                <button
                  className="transition-all m-2 p-2 rounded-md bg-purple-500 w-full text-sm hover:bg-purple-800 text-white"
                  onClick={() => {
                    openWesbiteNewTab(selectedVariant.link);
                  }}
                >
                  Buy
                </button>
              </div>
            </div>
            <div className="col-span-1 flex flex-row items-top justify-end accent-purple-400">
              <input
                type="checkbox"
                className="form-checkbox h-6 w-6 text-purple-600"
                checked={card.selected}
              />
            </div>
            {/* <div className="col-span-4 sm:hidden"></div>
            <div className="col-span-7 sm:hidden">
              <div className="flex flex-col space-y-1">
                <CardVariantSelector card={card} />
                <button
                  className="m-2 p-2 rounded-md bg-purple-500 text-sm w-full"
                  onClick={() => {
                    openWesbiteNewTab(selectedVariant.link);
                  }}
                >
                  Buy
                </button>
              </div>
            </div> */}
          </div>
        </div>
      );
}