import React from 'react';
import { cn } from '@/lib/utils';

interface AdContainerProps {
  children: React.ReactNode;
  className?: string;
  width?: number;
  height?: number;
}

export const AdContainer: React.FC<AdContainerProps> = ({
  children,
  className,
  width,
  height
}) => {
  return (
    <div className={cn('relative', className)} style={{ width, height }}>
      <div className="relative">{children}</div>
    </div>
  );
};
