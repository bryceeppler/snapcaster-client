'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { DesktopNavLink } from './nav-link';
import { SearchBar } from './search-provider';

import ModeToggle from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';


/**
 * Desktop navigation bar component
 * Shown on lg+ screens
 */
export default function DesktopNavbar(): JSX.Element {
  const pathname = usePathname();
  const currentPath = pathname || '';
  const { isAuthenticated, isVendor, isAdmin } = useAuth();
  const canViewAnalytics = isAdmin || isVendor;

  return (
    <header className="sticky top-0 z-40 hidden lg:block">
      {/* Top section with logo, search and account */}
      <div className="relative border-b border-border/40 bg-card/85 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          {/* 1. Left Section: Snapcaster Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center space-x-3 transition-opacity hover:opacity-90"
              aria-label="Snapcaster home"
            >
              <img
                className="h-6 w-auto"
                src="https://cdn.snapcaster.ca/snapcaster_logo.webp"
                alt=""
                aria-hidden="true"
                width="24"
                height="24"
              />
              <span className="font-genos text-2xl font-bold leading-none tracking-tighter">
                Snapcaster
              </span>
            </Link>
          </div>

          {/* 2. Middle Section: Nav Search Bar (Singles, Buylists, Sealed) */}
          <div className="mx-8 flex max-w-2xl flex-1 items-center justify-center">
            <SearchBar currentPath={currentPath} deviceType="desktop" />
          </div>

          {/* 3. Right Section: Theme Toggle, Account Button */}
          <div className="flex items-center gap-3">
            <ModeToggle />

            <Link href={isAuthenticated ? `/account` : '/signin'}>
              <Button
                variant={isAuthenticated ? 'default' : 'outline'}
                size="sm"
                className={cn(
                  'px-4 py-2 text-sm font-medium',
                  isAuthenticated && 'bg-primary text-primary-foreground'
                )}
              >
                <span>{isAuthenticated ? 'Account' : 'Sign In'}</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Nav Links section */}
      <div className="relative border-b border-border/40 bg-card/85 backdrop-blur-sm">
        <div className="px-6">
          <DesktopMenuLinks
            currentPath={currentPath}
            canViewAnalytics={canViewAnalytics}
          />
        </div>
      </div>
    </header>
  );
}

/**
 * Desktop navigation menu links component
 */
function DesktopMenuLinks({
  currentPath,
  canViewAnalytics
}: {
  currentPath: string;
  canViewAnalytics: boolean;
}): JSX.Element {
  return (
    <nav className="flex" aria-label="Main navigation">
      <DesktopNavLink href="/" isActive={currentPath === '/'}>
        Home
      </DesktopNavLink>

      <DesktopNavLink
        href="/multisearch"
        isActive={currentPath === '/multisearch'}
      >
        Multi Search
      </DesktopNavLink>

      <DesktopNavLink href="/sealed" isActive={currentPath === '/sealed'}>
        Sealed Search
      </DesktopNavLink>

      <DesktopNavLink href="/buylists" isActive={currentPath === '/buylists'}>
        Buylists
      </DesktopNavLink>

      <DesktopNavLink href="/about" isActive={currentPath === '/about'}>
        About
      </DesktopNavLink>

      <DesktopNavLink
        href="https://discord.gg/EnKKHxSq75"
        isActive={false}
        target="_blank"
        rel="noopener noreferrer"
      >
        Discord
      </DesktopNavLink>

      {canViewAnalytics && (
        <DesktopNavLink
          href="/vendors/dashboard"
          isActive={currentPath.startsWith('/vendors')}
        >
          Analytics
        </DesktopNavLink>
      )}
    </nav>
  );
}
