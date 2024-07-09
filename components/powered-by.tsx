import React from 'react';
import Link from 'next/link';
import { trackAdClick } from '@/utils/analytics';

type Props = {
  size?: 'small' | 'medium' | 'large';
};

const PoweredBy = (props: Props) => {
  const { size = 'small' } = props;

  return (
    <Link
      className={`flex flex-row items-center justify-center gap-2 text-gray-400 ${
        size === 'small'
          ? 'text-sm'
          : size === 'medium'
          ? 'text-base'
          : 'text-lg'
      }`}
      href="https://obsidiangames.ca"
      target="_blank"
      data-position-id="7" // hardcoded for the powered by logo position
      data-ad-id="14" // hardcoded for the obsidian powered by logo
      onClick={() => trackAdClick('14')}
    >
      <img
        className={`${
          size === 'small' ? 'h-5' : size === 'medium' ? 'h-8' : 'h-10'
        } w-auto`}
        src="/obsidian_icon.png"
        alt="Obsidian Games"
      />
      <p className="text-zinc-400 hover:text-primary">
        Powered by Obsidian Games
      </p>
    </Link>
  );
};

export default PoweredBy;
