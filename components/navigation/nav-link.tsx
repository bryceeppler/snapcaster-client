'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { NavLinkProps } from './navbar-types';

/**
 * Shared NavLink component for consistent navigation styling
 * Used in both mobile and desktop navigation
 */
export const DesktopNavLink = ({
  href,
  isActive,
  children,
  target,
  rel,
  onClick,
  className
}: NavLinkProps) => (
  <Link
    href={href}
    className={cn(
      'relative px-3 py-2 text-sm font-medium transition-colors hover:text-primary',
      isActive ? 'text-primary' : 'text-muted-foreground',
      className
    )}
    target={target}
    rel={rel}
    onClick={onClick}
    aria-current={isActive ? 'page' : undefined}
  >
    {children}
    {isActive && (
      <span
        className="absolute inset-x-0 -bottom-px h-[2px] rounded-t-full bg-primary"
        aria-hidden="true"
      ></span>
    )}
  </Link>
);

/**
 * Mobile-specific NavLink with different styling
 * Used in the mobile navigation sidebar
 */
export const MobileNavLink = ({
  href,
  isActive,
  children,
  target,
  rel,
  onClick,
  className
}: NavLinkProps) => {
  const isExternal = href.startsWith('http');

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'border-l-2 border-primary bg-accent/60 pl-[10px] text-accent-foreground'
          : 'text-muted-foreground hover:bg-accent/40 hover:text-accent-foreground',
        className
      )}
      onClick={onClick}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </Link>
  );
};
