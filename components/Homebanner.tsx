import React from 'react';

type Props = {};

export default function Homebanner({}: Props) {
  return (
    <div className="">
      <img
        className="crisp-edges mx-auto hidden h-16 w-auto md:flex"
        src="/logo.png"
        alt="Snapcaster"
      />

      <h1 className="mt-2 text-4xl font-extrabold">Snapcaster</h1>
      <p className="text-md text-gray-400">
        Search for Magic the Gathering cards across Canada
      </p>
    </div>
  );
}
