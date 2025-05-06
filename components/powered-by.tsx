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
      className={`mx-auto flex w-auto flex-row items-center justify-center gap-2 whitespace-nowrap text-foreground ${
        size === 'small'
          ? 'text-sm'
          : size === 'medium'
          ? 'text-base'
          : 'text-lg'
      }`}
      href="https://obsidiangames.ca"
      target="_blank"
      // hardcoded for the powered by logo position
      data-position-id="7"
      // hardcoded for the obsidian powered by logo
      data-ad-id="14"
      onClick={() => trackAdClick('14')}
    >
      <img
        className={`${
          size === 'small' ? 'h-5' : size === 'medium' ? 'h-8' : 'h-10'
        } w-auto`}
        src="/obsidian_icon.png"
        alt="Obsidian Games"
      />
      <p className="text-foreground hover:text-primary">
        Powered by Obsidian Games
      </p>
    </Link>
  );
};

export default PoweredBy;
