import React from 'react';
import { TypeAnimation } from 'react-type-animation';
type Props = { prefixText: string };

export default function Homebanner({ prefixText }: Props) {
  return (
    <div>
      <img
        className="crisp-edges mx-auto  h-12 w-auto md:flex md:h-16"
        src="https://cdn.snapcaster.ca/snapcaster_logo.webp"
        alt="Snapcaster"
      />

      <h1 className=" cursor-default font-genos text-3xl font-bold tracking-tighter sm:text-4xl md:text-6xl">
        Snapcaster
      </h1>
      <h2 className="font-genos text-3xl font-semibold tracking-tight text-muted-foreground">
        Canada's largest TCG database.
      </h2>
      <TypeAnimation
        preRenderFirstString={true}
        sequence={[
          1400,
          `${prefixText} Magic: the Gathering`,
          1400,
          `${prefixText} One Piece`,
          1400,
          `${prefixText} Pokemon`,
          1400,
          `${prefixText} Yu-gi-oh`,
          1400,
          `${prefixText} Lorcana`,
          1400
        ]}
        wrapper="span"
        className="text-left font-semibold font-genos tracking-tighter"
        speed={50}
        style={{ fontSize: '1.3rem', display: 'inline-block' }}
        repeat={Infinity}
      />
    </div>
  );
}
