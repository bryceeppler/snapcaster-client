import Link from 'next/link';
import React from 'react';
import { TypeAnimation } from 'react-type-animation';

type Props = {};

export default function Homebanner({}: Props) {
  return (
    <div className="">
      <img
        className="crisp-edges mx-auto hidden h-16 w-auto md:flex"
        src="https://cdn.snapcaster.ca/snapcaster_logo.webp"
        alt="Snapcaster"
      />

      {/* <h1 className="mt-2 text-4xl font-extrabold">Snapcaster</h1> */}
      {/* <p className="text-md">Search for trading cards across Canada</p> */}
      {/* <div className="p-2" /> */}

      <div className="p-2"></div>
      <TypeAnimation
        preRenderFirstString={true}
        sequence={[
          2000,
          // Same substring at the start will only be typed out once, initially
          'Snapcaster',
          1400, // wait 1s before replacing "Mice" with "Hamsters"
          'Search for Magic: the Gathering',
          1400, // wait 1s before replacing "Mice" with "Hamsters"
          'Search for Pokemon',
          1400,
          'Search for Yu-gi-oh',
          1400,
          'Search for Lorcana',
          1400
        ]}
        wrapper="span"
        className="text-left font-extrabold"
        speed={50}
        style={{ fontSize: '2em', display: 'inline-block' }}
        repeat={Infinity}
      />
      <div className="p-2"></div>

      <Link
        className="flex flex-row items-center justify-center gap-2 text-sm text-gray-400"
        href="https://obsidiangames.ca"
        target="_blank"
      >
        <p className="text-grey-400">Powered by</p>
        <img
          className="h-5 w-auto"
          src="https://cdn.snapcaster.ca/obsidian_games_logo.webp"
          alt="Obsidian Games"
        />
      </Link>
    </div>
  );
}
