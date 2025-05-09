import React, { useState } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

type Props = {
  imageUrl?: string;
  alt?: string;
  href?: string;
  className?: string;
};

const ProductImage: React.FC<Props> = ({
  imageUrl,
  alt,
  href,
  className = ''
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // Preload the image
  React.useEffect(() => {
    if (imageUrl) {
      const img = new Image();
      img.src = imageUrl;
      img.onload = handleLoad;
      img.onerror = handleError;
    }
  }, [imageUrl]);

  return (
    <div
      className={`relative h-48 w-full overflow-hidden rounded-lg ${className}`}
    >
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 z-0">
          <Skeleton className="h-full w-full" />
        </div>
      )}

      {/* Error State / Fallback */}
      {(hasError || !imageUrl) && (
        <div className="flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-b from-background/80 to-background/90">
          <img
            src="/logo.png"
            alt="Fallback Logo"
            className="h-auto w-1/2 opacity-10"
          />
        </div>
      )}

      {/* Main Image */}
      {imageUrl && !hasError && (
        <img
          src={imageUrl}
          alt={alt || 'Product Image'}
          className={`h-48 w-full object-contain object-center transition-all duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          } ${href ? 'cursor-pointer hover:scale-105 hover:opacity-80' : ''}`}
        />
      )}
    </div>
  );
};

export default ProductImage;
