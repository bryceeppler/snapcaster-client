import React from 'react';
import { useStore } from '@/stores/store';
import { Button } from '../ui/button';

type Props = {};

export default function StoreSelector({}: Props) {
  const {
    websites,
    multiSearchSelectedWebsites,
    toggleMultiSearchSelectedWebsites,
    toggleMultiSearchSelectAllStores
  } = useStore();

  return (
    <div>
      <div className="outlined-container grid w-full grid-cols-2 gap-2 p-2 md:grid-cols-3">
        {websites
          .sort((a, b) =>
            a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
          )
          .map((website, index) => {
            return (
              <div
                key={index}
                className={`transition-allm-1 outlined-container flex items-center p-2 hover:bg-zinc-800`}
                onClick={() => {
                  toggleMultiSearchSelectedWebsites(website.name);
                }}
              >
                <div
                  className={`

                    mx-1 aspect-square
                    h-2
                    w-2
                    rounded-full
                    ${
                      multiSearchSelectedWebsites.includes(website.name)
                        ? 'bg-pink-600'
                        : 'bg-zinc-600'
                    }
                `}
                />
                <label className="ml-2 truncate text-left text-xs">
                  {website.name}
                </label>
              </div>
            );
          })}
      </div>
      <div className="p-2" />
      <Button
        className="w-full"
        variant="outline"
        onClick={() => {
          toggleMultiSearchSelectAllStores();
        }}
      >
        Select All
      </Button>
    </div>
  );
}
