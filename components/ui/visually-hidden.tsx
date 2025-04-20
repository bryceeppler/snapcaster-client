import React from 'react';

interface VisuallyHiddenProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * VisuallyHidden component that hides content visually but keeps it accessible to screen readers
 * Following accessibility best practices for visually hidden content
 */
export const VisuallyHidden = ({
  children,
  className,
  ...props
}: VisuallyHiddenProps & React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={`absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 ${
        className || ''
      }`}
      style={{
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        margin: '-1px'
      }}
      {...props}
    >
      {children}
    </span>
  );
};
