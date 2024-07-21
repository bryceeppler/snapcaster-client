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

      <h1 className="mt-2 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
        Snapcaster
      </h1>
      <TypeAnimation
        preRenderFirstString={true}
        sequence={[
          1400,
          'Search for Magic: the Gathering',
          1400,
          'Search for One Piece',
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
    </div>
  );
}
