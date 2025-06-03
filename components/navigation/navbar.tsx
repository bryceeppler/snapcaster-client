'use client';

import DesktopNavbar from './desktop-navbar';
import MobileNavbar from './mobile-navbar';

/**
 * Main navbar component that renders the appropriate navbar based on screen size
 * Mobile navbar is rendered for screens smaller than lg breakpoint
 * Desktop navbar is rendered for screens lg and larger
 */
export default function Navbar(): JSX.Element {
  return (
    <>
      <MobileNavbar />
      <DesktopNavbar />
      <div className="w-full bg-primary/50 p-1 text-center text-white">
        <p className="text-xs text-primary-foreground">
          Snapcaster is under maintenance, we apologize for any inconvenience.
        </p>
      </div>
    </>
  );
}
