import React from 'react';
import Link from 'next/link';

type Props = {};

export default function Footer({}: Props) {
  return (
    <div
      className="flex flex-row items-center justify-center
      bg-zinc-900
      p-2
      text-sm
      text-zinc-100
      "
    >
      <div className="flex flex-col items-center gap-5 md:flex-row">
        <Link href="/privacy" className="">
          Privacy Policy
        </Link>

        <div className="aspect-square h-1 w-1 rounded-full bg-main"></div>
        <Link href="/terms" className="">
          Terms and Conditions
        </Link>
        <div className="aspect-square h-1 w-1 rounded-full bg-main"></div>

        <Link
          className="flex flex-row items-center gap-2"
          href="https://obsidiangames.ca"
          target="_blank"
        >
          <p>Powered by</p>
          <img
            src="https://cdn.snapcaster.ca/obsidian_games_logo.webp"
            alt="Snapcaster Logo"
            className="h-6 w-auto"
          />
        </Link>
      </div>
    </div>
  );
}
