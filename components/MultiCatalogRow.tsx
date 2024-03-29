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
      className={`outlined-container my-2 mt-6 p-3 transition-all sm:p-6 ${
        card.selected && `border-zinc-500 bg-zinc-900`
      }`}
      onClick={() => {
        toggleSelectMultiSearchCard(card.cardName);
      }}
    >
      <div className="flex flex-col gap-3 p-5 sm:hidden sm:p-8">
        {/* Image */}
        <div className="mx-auto max-w-xs sm:items-center sm:justify-center">
          <img
            src={selectedVariant.image}
            alt={selectedVariant.name}
            className="h-fit rounded-lg"
          />
        </div>
        {/* Card Info */}
        <div className="flex flex-col text-left">
          <div className="mt-2 text-lg font-bold">{selectedVariant.name}</div>

          <div className="text-lg font-bold">{selectedVariant.condition}</div>
          {selectedVariant.foil && (
            <div className="bg-gradient-to-r from-zinc-300 to-zinc-400 bg-clip-text text-lg font-bold text-transparent">
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
      <div className="hidden gap-3 p-5 sm:flex sm:flex-col sm:p-8">
        <div className="flex flex-row">
          {/* Image */}

          <div className="sm:items-center sm:justify-center">
            <img
              src={selectedVariant.image}
              alt={selectedVariant.name}
              className="h-fit w-36 rounded-lg"
            />
          </div>
          <div className="p-4" />
          {/* Card Info */}
          <div className="flex flex-col text-left">
            <div className="mt-2 text-lg font-bold">{selectedVariant.name}</div>

            <div className="text-lg font-bold">{selectedVariant.condition}</div>
            {selectedVariant.foil && (
              <div className="bg-gradient-to-r from-zinc-300 to-zinc-400 bg-clip-text text-lg font-bold text-transparent">
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
