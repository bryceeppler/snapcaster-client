import React from 'react'
import { useStore } from '@/store'
type Props = {}

export default function MultiSearchResultsInfo({}: Props) {
    const {filteredMultiSearchResults: results, selectAllMultiSearchResults, resetMultiSearch, missingMultiSearchResults:missingCards, multiSearchSelectedCost } = useStore()
  return (
    <div className="w-full bg-zinc-900 rounded-sm">
      <div className="flex flex-col justify-center items-center h-full p-4">

        {/* Missing Cards */}
        {missingCards.length > 0 && (
          <div className="justify-center w-full">
            <div className="bg-zinc-800 rounded-md p-3 flex flex-col space-y-1 max-w-sm mx-auto mb-2">
              <div className="text-center">
                No results found for
              </div>

              {missingCards.map((card, index) => (
                <div key={index} className="">
                  <div>{card}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-center mb-4">
        <button
              className="transition-all outline outline-2 -outline-offset-2 outline-pink-500 hover:bg-pink-500 hover:bg-opacity-50 font-bold px-2 py-1 rounded focus:outline-pink-900 focus:shadow-outline mt-4 mx-auto text-sm"
              type="button"
              onClick={resetMultiSearch}
            >
              Search again
            </button>
            <div className="p-4"></div>

            <button
              className="transition-all bg-pink-600 hover:bg-pink-700 text-white font-bold px-2 py-1 rounded focus:outline-pink-900 focus:shadow-outline mt-4 mx-auto text-sm"
              type="button"
              onClick={selectAllMultiSearchResults}
            //   onClick={() => handleSelectAll()}
            >
              Select All
            </button>
          </div>
        <div className="flex flex-row space-x-2 justify-center items-center">
          {/* Total cost of selected cards */}
          <div className=" font-bold text-xl">
            ${multiSearchSelectedCost.toFixed(2)}{" - "}
          </div>
          {/* Num Selected Cards */}
          <div className="">
            {results.filter((card) => card.selected === true).length} of{" "}
            {results.length} cards selected
          </div>
        </div>

      </div>
    </div>
  )
}