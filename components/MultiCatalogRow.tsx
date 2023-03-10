import React from 'react'
import { MultiSearchCardState, SingleSearchResult } from '@/store'
import { useStore } from '@/store'
import CardVariantSelector from './CardVariantSelector'

type Props = {
    cardData: MultiSearchCardState
}

export default function MultiCatalogRow({cardData:card}: Props) {
    const { filteredMultiSearchResults: results, toggleSelectMultiSearchCard }   = useStore()
    const openWebsiteNewTab = (website:string) => {
        window.open(website, "_blank");
      };
    //   const selectedVariant = results.find(
    //     (result) => JSON.stringify(result) === JSON.stringify(card)
    //   ).selectedVariant;
    const selectedVariant = card.selectedVariant
    
    //   const fetchWebsiteName = (websiteCode) => {
    //     let website = store.websiteCodeMap.find(
    //       (website) => website.code === websiteCode.toLowerCase()
    //     );
    //     if (website) {
    //       return website.name;
    //     } else {
    //       return websiteCode;
    //     }
    //   };
    return (
        // if card.selected == true change bg color to red
        <div
          className={
            card.selected
              ? "transition-all mt-6 p-3 bg-zinc-800 hover:bg-zinc-900 rounded-md my-2 outline outline-offset-2 outline-2 outline-pink-700 "
              : "transition-all mt-6 p-3 hover:bg-zinc-900 rounded-md my-2"
          }
          onClick={() => {
            // store.toggleSelectCard(card);
            toggleSelectMultiSearchCard(card.cardName)
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
              <div className="text-zinc-400">
                {
                    selectedVariant.website
                }
              </div>
              <div className="text-xl font-bold">${selectedVariant.price}</div>
              <div className="font-bold text-lg">
                {selectedVariant.condition}
              </div>
              {selectedVariant.foil && (
                <div
                  // gold foil text
                  className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-zinc-300 to-zinc-400"
                >
                  Foil
                </div>
              )}
    
              <div className="my-auto" />
              {/* <div className="flex flex-col space-y-1">
                <CardVariantSelector card={card} />
                <button
                  className="m-2 p-2 rounded-md bg-pink-500 text-sm w-full"
                  onClick={() => {
                    openWebsiteNewTab(selectedVariant.link);
                  }}
                >
                  Buy
                </button>
              </div> */}
              <div className="flex-col">
                <CardVariantSelector card={card} />
                {/* <CardVariantSelector /> */}

                <button
                  className="transition-all m-2 p-2 rounded-md bg-pink-500 w-full text-sm hover:bg-pink-800 text-white"
                  onClick={() => {
                    openWebsiteNewTab(selectedVariant.link);
                  }}
                >
                  Buy
                </button>
              </div>
            </div>
            <div className="col-span-1 flex flex-row items-top justify-end accent-pink-400">
            <div
                className={`

                    h-3 w-3
                    mt-2
                    rounded-full
                    ${
                      card.selected
                        ? "bg-pink-600"
                        : "bg-zinc-600"
                    }
                `}
              />
              {/* <input
                type="checkbox"
                className="form-checkbox h-6 w-6 text-pink-600"
                checked={card.selected}
              /> */}
            </div>
            {/* <div className="col-span-4 sm:hidden"></div>
            <div className="col-span-7 sm:hidden">
              <div className="flex flex-col space-y-1">
                <CardVariantSelector card={card} />
                <button
                  className="m-2 p-2 rounded-md bg-pink-500 text-sm w-full"
                  onClick={() => {
                    openWebsiteNewTab(selectedVariant.link);
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