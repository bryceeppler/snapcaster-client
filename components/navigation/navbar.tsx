'use client';

import DesktopNavbar from './desktop-navbar';
import MobileNavbar from './mobile-navbar';

import { useAuth } from '@/hooks/useAuth';

/**
 * Main navbar component that renders the appropriate navbar based on screen size
 * Mobile navbar is rendered for screens smaller than lg breakpoint
 * Desktop navbar is rendered for screens lg and larger
 */
export default function Navbar(): JSX.Element {
  const { isAuthenticated, isLoadingProfile, isInitializing } = useAuth();

  // Wait for profile to load if user is authenticated to prevent layout shifts
  const isProfileLoading =
    isInitializing || (isAuthenticated && isLoadingProfile);

  // Don't render navbar until profile is loaded (if user is authenticated)
  // This prevents layout shifts when navbar items render differently based on auth state
  if (isProfileLoading) {
    return <></>;
  }

  return (
    <>
      <MobileNavbar />
      <DesktopNavbar />
    </>
  );
}
