import React from 'react';

type Props = {
  imageUrl?: string;
  alt?: string;
};

const CardImage: React.FC<Props> = ({ imageUrl, alt }) => {
  const aspectRatioPadding = (418 / 300) * 100;

  return (
    <div
      className="relative z-[1] w-full"
      style={{ paddingTop: `${aspectRatioPadding}%` }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={alt || 'Card Image'}
            className="rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-full max-h-full w-full max-w-full items-center justify-center rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-900 text-center">
            <img
              src="/logo.png"
              alt={alt || 'Logo'}
              className="p-5 opacity-5"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CardImage;
