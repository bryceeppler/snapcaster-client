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
        <Link href="/privacy" className="text-pink-500 hover:text-pink-700">
          Privacy Policy
        </Link>

        <div className="aspect-square h-1 w-1 rounded-full bg-pink-500"></div>
        <Link href="/terms" className="text-pink-500 hover:text-pink-700">
          Terms and Conditions
        </Link>
      </div>
    </div>
  );
}
