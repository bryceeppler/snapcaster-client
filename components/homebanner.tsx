import React from 'react';
import { TypeAnimation } from 'react-type-animation';
import Link from 'next/link';
type Props = {};

export default function Homebanner({}: Props) {
  return (
    <div className="">
      <img
        className="crisp-edges mx-auto hidden h-16 w-auto md:flex"
        src="https://cdn.snapcaster.ca/snapcaster_logo.webp"
        alt="Snapcaster"
      />

      <h1 className="mt-2 text-4xl font-extrabold">Snapcaster</h1>
      <TypeAnimation
        preRenderFirstString={true}
        sequence={[
          1400,
          'Search for Magic: the Gathering',
          1400,
          'Search for Pokemon',
          1400,
          'Search for Yu-gi-oh',
          1400,
          'Search for Lorcana',
          1400
        ]}
        wrapper="span"
        className="text-left font-bold"
        speed={50}
        style={{ fontSize: '1em', display: 'inline-block' }}
        repeat={Infinity}
      />
      <div className="p-2"></div>

      <Link
        className="flex flex-row items-center justify-center gap-2 text-sm text-gray-400"
        href="https://obsidiangames.ca"
        target="_blank"
      >
        <img
          className="h-5 w-auto"
          src="/obsidian_icon.png"
          alt="Obsidian Games"
        />
        <p className="text-zinc-400 hover:text-primary">
          Powered by Obsidian Games
        </p>
      </Link>
    </div>
  );
}
