import React from 'react'
import { useStore } from '@/stores/store'
type Props = {}

export default function MultiSearchResultsInfo({}: Props) {
    const {filteredMultiSearchResults: results, selectAllMultiSearchResults, resetMultiSearch, missingMultiSearchResults:missingCards, multiSearchSelectedCost } = useStore()
  return (
    <div className="w-full outlined-container p-3 md:p-6">
      <div className="flex flex-col justify-center items-center h-full ">

        {/* Missing Cards */}
        {missingCards.length > 0 && (
          <div className="justify-center w-full">
            <div className="outlined-container p-3 flex flex-col space-y-1 max-w-sm mx-auto mb-2">
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
              className="btn-dark px-2 py-1 mt-4 mx-auto text-sm"
              type="button"
              onClick={resetMultiSearch}
            >
              Search again
            </button>
            <div className="p-4"></div>

            <button
              className="btn-white px-2 py-1 mt-4 mx-auto text-sm"
              type="button"
              onClick={selectAllMultiSearchResults}
            //   onClick={() => handleSelectAll()}
            >
              Select All
            </button>
          </div>
        <div className="flex flex-col justify-center items-center">
          {/* Total cost of selected cards */}
          <div className=" font-bold text-2xl">
            ${multiSearchSelectedCost.toFixed(2)}
          </div>
          {/* Num Selected Cards */}
          <div className="text-sm text-zinc-400">
            {results.filter((card) => card.selected === true).length} of{" "}
            {results.length} cards selected
          </div>
        </div>

      </div>
    </div>
  )
}