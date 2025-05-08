'use client';

import React from 'react';

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
    </>
  );
}
