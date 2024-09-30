import React, { useState } from 'react';

type Props = {
  imageUrl?: string;
  alt?: string;
  href?: string;
};

const CardImage: React.FC<Props> = ({ imageUrl, alt, href }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <>
      {!hasError && imageUrl ? (
        <div className="relative aspect-card w-full rounded-lg overflow-hidden">
          {/* Placeholder */}
          <div
            className={`absolute inset-0 flex items-center justify-center bg-gradient-to-b from-zinc-800 to-zinc-900 transition-opacity duration-500 ${
              isLoaded ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <img src="/logo.png" alt="Placeholder Logo" className="p-5 opacity-5" />
          </div>

          <img
            src={imageUrl}
            alt={alt || 'Card Image'}
            onError={handleError}
            onLoad={handleLoad}
            className={`aspect-card w-full object-cover transition-opacity duration-500 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            } ${href ? 'cursor-pointer hover:opacity-80' : ''}`}
          />
        </div>
      ) : (
        // Fallback when there's an error or no imageUrl
        <div className="flex aspect-card w-full items-center justify-center rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-900">
          <img src="/logo.png" alt="Fallback Logo" className="p-5 opacity-5" />
        </div>
      )}
    </>
  );
};

export default CardImage;
