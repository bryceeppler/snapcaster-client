import React from 'react';
import { useStore } from '@/stores/store';
import { Button } from './ui/button';
type Props = {};

export default function MultiSearchResultsInfo({}: Props) {
  const {
    filteredMultiSearchResults: results,
    selectAllMultiSearchResults,
    resetMultiSearch,
    missingMultiSearchResults: missingCards,
    multiSearchSelectedCost
  } = useStore();
  return (
    <div className="outlined-container w-full p-3 md:p-6">
      <div className="flex h-full flex-col items-center justify-center ">
        {/* Missing Cards */}
        {missingCards.length > 0 && (
          <div className="w-full justify-center">
            <div className="outlined-container mx-auto mb-2 flex max-w-sm flex-col space-y-1 p-3">
              <div className="text-center">No results found for</div>

              {missingCards.map((card, index) => (
                <div key={index} className="">
                  <div>{card}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="mb-4 flex justify-center">
          <Button onClick={resetMultiSearch}>Reset</Button>
          <div className="p-4"></div>

          <Button onClick={selectAllMultiSearchResults}>Select All</Button>
        </div>
        <div className="flex flex-col items-center justify-center">
          {/* Total cost of selected cards */}
          <div className=" text-2xl font-bold">
            ${multiSearchSelectedCost.toFixed(2)}
          </div>
          {/* Num Selected Cards */}
          <div className="text-sm text-zinc-400">
            {results.filter((card) => card.selected === true).length} of{' '}
            {results.length} cards selected
          </div>
        </div>
      </div>
    </div>
  );
}
