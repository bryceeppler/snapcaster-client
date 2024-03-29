import React from 'react';
import Link from 'next/link';

type Props = {};

export default function Footer({}: Props) {
  const openDonationLink = () => {
    window.open(
      'https://www.paypal.com/donate/?business=KK537LVP4TZ5Q&no_recurring=0&item_name=I+appreciate+your+support%21+If+you+have+any+suggestions+or+feedback%2C+please+feel+free+to+email+me+at+epplerdev%40gmail.com.&currency_code=CAD',
      '_blank'
    );
  };
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
        {/* <div className="text-zinc-100">
          Created by{'  '}
          <a
            href="https://www.bryceeppler.com"
            target="_blank"
            rel="noreferrer"
            className="text-pink-500 hover:text-pink-700"
          >
            Bryce Eppler
          </a>
        </div> */}
        {/* <button
          className="rounded-md bg-pink-500 bg-opacity-50 py-1 px-2 font-mono font-bold transition-colors hover:bg-pink-700"
          onClick={openDonationLink}
        >
          <span className="hidden sm:inline">Support snapcaster</span>
          <span className="sm:hidden">Donate</span>
        </button> */}
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
