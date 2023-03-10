import React from 'react';
import { useStore } from 'store';

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
    // checkbox should have a label, and a reference to the store value
    { label: 'NM', value: false },
    { label: 'LP', value: false },
    { label: 'PL', value: false },
    { label: 'MP', value: false },
    { label: 'HP', value: false },
    { label: 'DMG', value: false },
    { label: 'SCAN', value: false }
  ];
  return (
    <div className="flex flex-col justify-center items-center w-full p-2">
      {/* div for filters should always render but not be visible unless showFilters is true */}
      <div
        className={`transition-all flex flex-col justify-center items-center w-full ${
          showSingleSearchFilters ? 'opacity-100 h-80' : 'opacity-0 h-0'
        } bg-zinc-900 shadow rounded`}
      >
        {showSingleSearchFilters && (
          <>
            {/* selector for sort by */}
            <div className="flex flex-row justify-between items-center p-2">
              <div className="flex flex-row justify-between items-center p-2">
                <label className="text-sm mr-2">Sort By</label>
                <select
                  className="p-1 rounded-md text-sm bg-zinc-800"
                  onChange={(e) => {
                    // store.setSortBy(e.target.value);
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
                  className="p-1 rounded-md text-sm bg-zinc-800"
                  value={singleSearchOrder}
                  onChange={(e) => {
                    // store.setSortOrder(e.target.value);
                    setSingleSearchOrder(e.target.value);
                  }}
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
            {/* foil only toggle */}
            <div className="flex flex-row justify-between items-center p-2">
              <span className="mr-3 text-sm font-medium">Foil only</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  // checked={store.foilOnly}
                  checked={singleSearchFoil}
                  onChange={() => {
                    // store.setFoilOnly(!store.foilOnly);
                    toggleSingleSearchFoil();
                  }}
                />
                <div className="w-7 h-4 bg-zinc-800 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-pink-300 dark:peer-focus:ring-pink-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-zinc-600 peer-checked:bg-pink-600"></div>
              </label>
            </div>
            <div className="text-sm font-bold mt-2">Condition</div>
            {/* two columns for condition checkboxes */}
            <div className="grid grid-cols-2 py-4 max-w-md gap-x-10">
              {/* map checkboxes */}
              {conditionCheckboxes.map((checkbox, index) => (
                <div
                  key={index}
                  className="col-span-1 flex flex-row justify-between text-left items-center w-full"
                >
                  <label className="text-sm mr-1">{checkbox.label}</label>
                  <input
                    type="checkbox"
                    className="text-sm accent-pink-300"
                    checked={
                      singleSearchConditions[checkbox.label.toLowerCase()]
                    }
                    // onChange={() => {
                    //   store.setConditions({
                    //     ...store.conditions,
                    //     [checkbox.label.toLowerCase()]: !checkbox.value,
                    //   });
                    // }}
                    onChange={() => {
                      toggleSingleSearchCondition(checkbox.label.toLowerCase());
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-row space-x-2">
              <button
                className="transition-all outline outline-2 -outline-offset-2 outline-zinc-500 hover:bg-pink-500 hover:bg-opacity-50 font-bold py-1 px-4 rounded focus:outline-pink-900 focus:shadow-outline mt-1 mx-auto"
                onClick={() => {
                  resetSingleSearchFilters();
                }}
              >
                Clear
              </button>

              {/* <button
                className="transition-all bg-pink-600 hover:bg-pink-700 text-white font-bold py-1 px-4 rounded focus:outline-pink-900 focus:shadow-outline mt-1 mx-auto"
                onClick={() => {
                  console.log("Apply Filter");
                  // console.log("store.conditions", store.conditions);
                  // applyFilters(store);
                }}
              >
                Apply
              </button> */}
            </div>
          </>
        )}
      </div>

      <button
        className="text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-800 focus:ring-opacity-50"
        onClick={() => {
          toggleShowSingleSearchFilters();
        }}
      >
        {showSingleSearchFilters ? 'Hide Filters' : 'Show Filters'}
      </button>
    </div>
  );
}
