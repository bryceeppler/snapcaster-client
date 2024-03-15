import React from 'react';
import { useStore } from '@/stores/store';
import { Button } from './ui/button';

type Props = {};

export default function SearchFilters({}: Props) {
  const {
    showSingleSearchFilters,
    toggleShowSingleSearchFilters,
    toggleSingleSearchCondition,
    singleSearchConditions,
    resetSingleSearchFilters,
    singleSearchFoil,
    toggleSingleSearchFoil,
    setSingleSearchOrderBy,
    setSingleSearchOrder,
    singleSearchOrderBy,
    singleSearchOrder
  } = useStore();
  const conditionCheckboxes = [
    { label: 'NM', value: false },
    { label: 'LP', value: false },
    { label: 'PL', value: false },
    { label: 'MP', value: false },
    { label: 'HP', value: false },
    { label: 'DMG', value: false },
    { label: 'SCAN', value: false }
  ];
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div
        className={`flex w-full flex-col items-center justify-center transition-all ${
          showSingleSearchFilters ? 'h-80 opacity-100' : 'h-0 opacity-0'
        } outlined-container`}
      >
        {showSingleSearchFilters && (
          <>
            <div className="flex flex-row items-center justify-between p-2">
              <div className="flex flex-row items-center justify-between p-2">
                <label className="text-sm">Sort By</label>
                <select
                  className="input-dark p-1 text-sm"
                  onChange={(e) => {
                    setSingleSearchOrderBy(e.target.value);
                  }}
                  value={singleSearchOrderBy}
                >
                  <option value="price">Price</option>
                  <option value="name">Name</option>
                  <option value="set">Set</option>
                  <option value="website">Website</option>
                </select>
              </div>
              <div>
                <select
                  className="input-dark p-1 text-sm"
                  value={singleSearchOrder}
                  onChange={(e) => {
                    setSingleSearchOrder(e.target.value);
                  }}
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
            <div className="flex flex-row items-center justify-between p-2">
              <span className="mr-3 text-sm font-medium">Foil only</span>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={singleSearchFoil}
                  onChange={() => {
                    toggleSingleSearchFoil();
                  }}
                />
                <div className="peer h-4 w-7 rounded-full bg-zinc-800 after:absolute after:top-[2px] after:left-[2px] after:h-3 after:w-3 after:rounded-full after:border after:border-zinc-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-pink-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-pink-300 dark:border-zinc-600 dark:peer-focus:ring-pink-800"></div>
              </label>
            </div>
            <div className="mt-2 text-sm font-bold">Condition</div>
            <div className="grid max-w-md grid-cols-2 gap-x-10 py-4">
              {conditionCheckboxes.map((checkbox, index) => (
                <div
                  key={index}
                  className="col-span-1 flex w-full flex-row items-center justify-between text-left"
                >
                  <label className="mr-1 text-sm">{checkbox.label}</label>
                  <input
                    type="checkbox"
                    className="text-sm accent-pink-300"
                    checked={
                      singleSearchConditions[checkbox.label.toLowerCase()]
                    }
                    onChange={() => {
                      toggleSingleSearchCondition(checkbox.label.toLowerCase());
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-row space-x-2">
              <Button
                onClick={() => {
                  resetSingleSearchFilters();
                }}
              >
                Clear
              </Button>
            </div>
          </>
        )}
      </div>

      <button
        className="text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-opacity-50 dark:focus:ring-pink-800"
        onClick={() => {
          toggleShowSingleSearchFilters();
        }}
      >
        {showSingleSearchFilters ? 'Hide Filters' : 'Show Filters'}
      </button>
    </div>
  );
}
