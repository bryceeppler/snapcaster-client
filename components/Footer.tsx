import React from 'react';

type Props = {};

export default function Footer({}: Props) {
  const openDonationLink = () => {
    window.open(
      'https://www.paypal.com/donate/?business=KK537LVP4TZ5Q&no_recurring=0&item_name=Thank+you+for+supporting+snapcaster%21+Your+generosity+keeps+snapcaster+running+by+covering+server+costs.&currency_code=CAD',
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
      <div className="flex flex-row items-center space-x-2">
        <div className="text-zinc-100 mr-5">
          Created by{'  '}
          <a
            href="https://www.bryceeppler.com"
            target="_blank"
            rel="noreferrer"
            className="text-pink-500 hover:text-pink-700"
          >
            Bryce Eppler
          </a>
        </div>
        <button
          className="rounded-md bg-pink-500 bg-opacity-50 py-1 px-2 font-mono font-bold transition-colors hover:bg-pink-700"
          onClick={openDonationLink}
        >
          {
            // sm and above says "Support snapcaster"
            // xs and below says "Donate"
          }
          <span className="hidden sm:inline">Support snapcaster</span>
          <span className="sm:hidden">Donate</span>
        </button>
      </div>
    </div>
  );
}
