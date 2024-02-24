import React from 'react';
import { useStore } from '@/stores/store';

type Props = {};

export default function StoreSelector({}: Props) {
  const {
    websites,
    multiSearchSelectedWebsites,
    toggleMultiSearchSelectedWebsites,
    toggleMultiSearchSelectAllStores
  } = useStore();

  return (
    <div className="flex flex-col">
      <div className="grid w-full grid-cols-2 md:grid-cols-3 p-2 outlined-container gap-2">
        {websites
          .sort((a, b) =>
            a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
          )
          .map((website, index) => {
            return (
              <div
                key={index}
                className={`transition-allm-1 flex items-center p-2 outlined-container hover:bg-zinc-800`}
                onClick={() => {
                  toggleMultiSearchSelectedWebsites(website.name);
                }}
              >
                <div
                  className={`

                    h-2 w-2
                    aspect-square
                    mx-1
                    rounded-full
                    ${
                      multiSearchSelectedWebsites.includes(website.name)
                        ? 'bg-pink-600'
                        : 'bg-zinc-600'
                    }
                `}
                />
                <label className="ml-2 text-xs text-left truncate">
                  {website.name}
                </label>
              </div>
            );
          })}
      </div>
          <div className="p-2"/>
      <button
        className="btn-dark"
        onClick={() => {
          toggleMultiSearchSelectAllStores();
        }}
      >
        Select All
      </button>
    </div>
  );
}
