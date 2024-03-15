import Image from 'next/image';
import React from 'react';
import logo from 'public/logo.png';

type Props = {};

export default function Homebanner({}: Props) {
  return (
    <div className="">
      <Image
        className="crisp-edges mx-auto hidden h-16 w-auto md:flex"
        src={logo}
        alt="Snapcaster"
      />

      <h1 className="mt-2 text-4xl font-extrabold">Snapcaster</h1>
      <p className="text-md text-gray-400">
        Get started by searching for a card.
      </p>
    </div>
  );
}
