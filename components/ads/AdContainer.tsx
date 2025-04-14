import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AdContainerProps {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
  skeleton: React.ReactNode;
  width?: number;
  height?: number;
}

export const AdContainer: React.FC<AdContainerProps> = ({
  isLoading,
  children,
  className,
  skeleton,
  width,
  height
}) => {
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setIsTransitioning(false), 500);
      return () => clearTimeout(timer);
    }
    setIsTransitioning(true);
  }, [isLoading]);

  return (
    <div className={cn('relative', className)} style={{ width, height }}>
      <div
        className={cn(
          'absolute inset-0 z-10 transition-opacity duration-500',
          !isLoading && !isTransitioning && 'opacity-0'
        )}
      >
        {skeleton}
      </div>
      <div
        className={cn(
          'transition-opacity duration-500',
          isLoading || isTransitioning ? 'opacity-0' : 'opacity-100'
        )}
      >
        {children}
      </div>
    </div>
  );
};
