import React from 'react';
import Image from 'next/image';
type Props = {
  imageUrl?: string;
  alt?: string;
};

const CardImage: React.FC<Props> = ({ imageUrl, alt }) => {
  const aspectRatioPadding = (418 / 300) * 100;
  const sizes = `(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw`;
  // sizes attribute for different breakpoints
  // This assumes that on very small screens, the image will be full width (100vw),
  // on medium screens up to 768px it might be half the viewport width (50vw),
  // and on larger screens, it will take up a third of the viewport width (33vw).
  // Adjust the values based on your actual layout and design.
  return (
    <div
      className="relative w-full"
      style={{ paddingTop: `${aspectRatioPadding}%` }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={alt || 'Card Image'}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-lg"
            sizes={sizes}
          />
        ) : (
          <div className="flex h-full max-h-full w-full max-w-full items-center justify-center rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-900 text-center">
            <Image
              src="/logo.png"
              alt={alt || 'Logo'}
              width={100}
              height={100}
              className="opacity-10"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CardImage;
