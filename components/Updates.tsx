import React, { useState } from 'react';

type Props = {
  data: {
    title: string;
    date: string;
  }[];
};

export default function Updates({ data }: Props) {
  const [showAll, setShowAll] = useState(false);
  const maxUpdatesToShow = 3;

  const updatesToShow = showAll ? data : data.slice(0, maxUpdatesToShow);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <div className="outline outline-offset-2 outline-1 p-1 outline-zinc-900 rounded-md text-left">
      <h3 className="p-2">Updates</h3>
      {updatesToShow.map((update, index) => {
        return (
          <div
            key={index}
            className={`p-2 ${
              index === updatesToShow.length - 1 ? '' : 'border-b'
            } border-zinc-900 flex flex-row text-sm justify-between transition-colors rounded-md text-left `}
          >
            <h2>{update.title}</h2>
            <p className="text-zinc-500 text-right">{update.date}</p>
          </div>
        );
      })}
      {data.length > maxUpdatesToShow && (
        <button
          onClick={toggleShowAll}
          className="text-sm text-pink-300 py-1 px-2 mt-1 hover:text-pink-500 transition-colors rounded-md text-left w-full font-mono"
        >
          {showAll ? 'Show Less' : 'Show More'}
        </button>
      )}
    </div>
  );
}
