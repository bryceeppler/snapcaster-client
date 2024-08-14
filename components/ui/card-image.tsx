import Link from 'next/link';
import React, { useState } from 'react';

type Props = {
  imageUrl?: string;
  alt?: string;
  href?: string;
};

const CardImage: React.FC<Props> = ({ imageUrl, alt, href }) => {
  const [hasError, setHasError] = useState(false);
  const handleError = () => {
    setHasError(true);
  };

  return (
    // <Link
    //   className={`relative h-full w-full ${
    //     href ? 'cursor-pointer' : 'cursor-default'
    //   }`}
    //   href={href || '#'}
    // >
    <>
      {!hasError && imageUrl ? (
        <img
          src={imageUrl}
          alt={alt || 'Card Image'}
          onError={handleError}
          className={`aspect-card w-full rounded-lg object-cover transition-opacity ${
            href ? 'cursor-pointer hover:opacity-50' : ''
          }`}
        />
      ) : (
        <div className="flex aspect-card w-full items-center justify-center rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-900 transition-opacity hover:opacity-50">
          <img src="/logo.png" alt={alt || 'Logo'} className="p-5 opacity-5" />
        </div>
      )}
    </>
    // </Link>
  );
};

export default CardImage;
