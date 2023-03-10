import React from 'react'
import { useStore } from 'store'

type Props = {}

export default function SearchFilters({}: Props) {
  const { showSingleSearchFilters, toggleShowSingleSearchFilters } = useStore();
  const conditionCheckboxes = [
    // checkbox should have a label, and a reference to the store value
    { label: "NM", value:false},
    { label: "LP", value:false},
    { label: "PL", value:false},
    { label: "MP", value:false},
    { label: "HP", value:false},
    { label: "DMG", value:false},
    { label: "SCAN", value:false},
  ];
  return (
    <div className="flex flex-col justify-center items-center w-full p-2">
      {/* div for filters should always render but not be visible unless showFilters is true */}
      <div
        className={`transition-all flex flex-col justify-center items-center w-full ${
          showSingleSearchFilters ? "opacity-100 h-80" : "opacity-0 h-0"
        } bg-gray-200 shadow rounded`}
      >
        {showSingleSearchFilters && (
          <>
            {/* selector for sort by */}
            <div className="flex flex-row justify-between items-center p-2">
              <div className="flex flex-row justify-between items-center p-2">
                <label className="text-sm mr-2">Sort By</label>
                <select
                  className="p-1 rounded-md text-sm"
                  onChange={(e) => {
                    // store.setSortBy(e.target.value);
                  }}
                >
                  <option value="price">Price</option>
                  <option value="name">Name</option>
                  <option value="set">Set</option>
                  <option value="website">Website</option>
                </select>
              </div>
              <div>
                <select
                  className="p-1 rounded-md text-sm"
                  onChange={(e) => {
                    // store.setSortOrder(e.target.value);
                  }}
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
            {/* foil only toggle */}
            <div className="flex flex-row justify-between items-center p-2">
              <span className="mr-3 text-sm font-medium">
                Foil only
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  // checked={store.foilOnly}
                  onChange={() => {
                    // store.setFoilOnly(!store.foilOnly);
                  }}
                />
                <div className="w-7 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
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
                  <label className="text-sm mr-1">
                    {checkbox.label}
                  </label>
                  <input
                    type="checkbox"
                    className="text-sm accent-purple-300"
                    checked={checkbox.value}
                    // onChange={() => {
                    //   store.setConditions({
                    //     ...store.conditions,
                    //     [checkbox.label.toLowerCase()]: !checkbox.value,
                    //   });
                    // }}
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-row space-x-2">
              <button
                className="transition-all outline outline-2 -outline-offset-2 outline-purple-500 hover:bg-purple-500 hover:bg-opacity-50 font-bold py-1 px-4 rounded focus:outline-purple-900 focus:shadow-outline mt-1 mx-auto"
                onClick={() => {
                  // resetFilters(store);
                }}
              >
                Clear
              </button>

              <button
                className="transition-all bg-purple-600 hover:bg-purple-700 text-white font-bold py-1 px-4 rounded focus:outline-purple-900 focus:shadow-outline mt-1 mx-auto"
                onClick={() => {
                  console.log("Apply Filter");
                  // console.log("store.conditions", store.conditions);
                  // applyFilters(store);
                }}
              >
                Apply
              </button>
            </div>
          </>
        )}
      </div>

      <button
        className="text-sm"
        onClick={() => {
          toggleShowSingleSearchFilters();
          console.log("clicked");
        }}
      >
        {showSingleSearchFilters ? "Hide Filters" : "Show Filters"}
      </button>
    </div>
  )
}