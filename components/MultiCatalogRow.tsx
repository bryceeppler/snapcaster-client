import React from 'react';
import { MultiSearchCardState, SingleSearchResult } from '@/stores/store';
import { useStore } from '@/stores/store';
import CardVariantSelector from './CardVariantSelector';
import { Button } from './ui/button';

type Props = {
  cardData: MultiSearchCardState;
};

export default function MultiCatalogRow({ cardData: card }: Props) {
  const { filteredMultiSearchResults: results, toggleSelectMultiSearchCard } =
    useStore();
  const openWebsiteNewTab = (website: string) => {
    window.open(website, '_blank');
  };
  const selectedVariant = card.selectedVariant;

  return (
    <div
      className={`transition-all outlined-container mt-6 p-3 sm:p-6 my-2 ${
        card.selected && `bg-zinc-900 border-zinc-500`
      }`}
      onClick={() => {
        toggleSelectMultiSearchCard(card.cardName);
      }}
    >
      <div className="flex sm:hidden flex-col gap-3 p-5 sm:p-8">
        {/* Image */}
        <div className="sm:items-center sm:justify-center max-w-xs mx-auto">
          <img
            src={selectedVariant.image}
            alt={selectedVariant.name}
            className="h-fit rounded-lg"
          />
        </div>
        {/* Card Info */}
        <div className="flex flex-col text-left">
          <div className="text-lg font-bold mt-2">{selectedVariant.name}</div>

          <div className="font-bold text-lg">{selectedVariant.condition}</div>
          {selectedVariant.foil && (
            <div className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-zinc-300 to-zinc-400">
              Foil
            </div>
          )}
          <div className="text-2xl font-bold">${selectedVariant.price}</div>
          <div className="text-zinc-400">{selectedVariant.website}</div>
        </div>
        <div className="flex flex-col gap-4">
          <CardVariantSelector card={card} />
          <Button
            className=""
            onClick={() => {
              openWebsiteNewTab(selectedVariant.link);
            }}
          >
            Buy
          </Button>
        </div>
      </div>
      <div className="hidden sm:flex sm:flex-col gap-3 p-5 sm:p-8">
        <div className="flex flex-row">
          {/* Image */}

          <div className="sm:items-center sm:justify-center">
            <img
              src={selectedVariant.image}
              alt={selectedVariant.name}
              className="w-36 h-fit rounded-lg"
            />
          </div>
          <div className="p-4" />
          {/* Card Info */}
          <div className="flex flex-col text-left">
            <div className="text-lg font-bold mt-2">{selectedVariant.name}</div>

            <div className="font-bold text-lg">{selectedVariant.condition}</div>
            {selectedVariant.foil && (
              <div className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-zinc-300 to-zinc-400">
                Foil
              </div>
            )}
            <div className="text-2xl font-bold">${selectedVariant.price}</div>
            <div className="text-zinc-400">{selectedVariant.website}</div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <CardVariantSelector card={card} />
          <Button
            className=""
            onClick={() => {
              openWebsiteNewTab(selectedVariant.link);
            }}
          >
            Buy
          </Button>
        </div>
      </div>
    </div>
  );
}
