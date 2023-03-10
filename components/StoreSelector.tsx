import React from "react";
import { useStore } from "store";

type Props = {};

export default function StoreSelector({}: Props) {
  const { websites } = useStore();

  return (
    <div className="flex flex-col">
      <div className="grid w-full grid-cols-2 md:grid-cols-3">
        {websites.map((website, index) => {
          return (
            <div
              key={index}
              className="m-1 flex items-center rounded-md p-2 accent-purple-700"
              onClick={() => {
                // store.setWebsites({
                //     ...store.websites,
                //     [website.code]: !store.websites[website.code],
                // })
              }}
            >
              <input
                type="checkbox"
                // checked={websites[website.code]}
                // onChange={(e) => {
                //     store.setWebsites({
                //         ...store.websites,
                //         [website.code]: e.target.checked,
                //     })
                // }}
              />
              <label className="ml-2 text-sm text-left">{website.name}</label>
            </div>
          );
        })}
      </div>

      <button
        className="m-1 rounded-md bg-gray-300 p-2"
        onClick={() => {
          // let allSelected = {}
          // let noneSelected = {}
          // websites.forEach((website) => {
          //     allSelected[website.code] = true
          //     noneSelected[website.code] = false
          // })
          // if (JSON.stringify(store.websites) === JSON.stringify(allSelected)) {
          //     store.setWebsites(noneSelected)
          // } else {
          //     store.setWebsites(allSelected)
          // }
        }}
      >
        Select All
      </button>
    </div>
  );
}
