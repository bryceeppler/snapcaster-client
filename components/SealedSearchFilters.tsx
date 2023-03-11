import React from 'react'
import { useStore } from '@/store'

type Props = {}

export default function SealedSearchFilters({}: Props) {
    const { setSealedSearchOrder: setSortOrder, setSealedSearchOrderBy: setSortBy, toggleSealedFilterTag: toggleFilterTag, sealedFilterTags: filterTags, sealedSearchOrderBy:sortBy, sealedSearchOrder: sortOrder } = useStore()
    return (
        <div className="flex flex-col justify-center">
          <div className="flex flex-row justify-center items-center p-2">
            <div className="flex flex-row items-center p-2">
              <label className="text-sm mr-2">Sort By</label>
              <select
                className="p-1 rounded-md text-sm bg-zinc-700"
                value={sortBy}
                onChange={(e) => {
                    if (e.target.value === "price") {
                        setSortBy("price");
                    }
                    if (e.target.value === "website") {
                        setSortBy("website");
                    }
                }}
              >
                <option value="price">Price</option>
                <option value="website">Website</option>
              </select>
            </div>
            <div>
              <select
                className="p-1 rounded-md text-sm bg-zinc-700"
                value={sortOrder}
                onChange={(e) => {
                    if (e.target.value === "asc") {
                        setSortOrder("asc");
                    }
                    if (e.target.value === "desc") {
                        setSortOrder("desc");
                    }
                }}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
          {/* Tag selectors are in a row, with overlow that wraps to another row*/}
          <div className="flex flex-row justify-center items-center py-2 flex-wrap">
            {filterTags.map((tag, index) => {
              return (
                // if tag.selected, baground is purple, otherwise it's gray
                <div key={index}
                    className={`transition-all flex flex-row justify-center items-center m-1 p-2 rounded-md text-white text-sm cursor-pointer hover:bg-pink-500 ${
                        tag.selected ? "bg-pink-700" : "bg-zinc-700"
                    }`}
    
                    onClick={() => {
                        toggleFilterTag(tag);
                    }}
                >
                  {tag.displayName}
                </div>
              );
            })}
          </div>
        </div>
      );
}