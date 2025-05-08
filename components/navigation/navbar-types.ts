/**
 * Shared types and interfaces for the navbar system
 */

import type { ReactNode } from 'react';

/**
 * Supported search modes for the application
 */
export type SearchMode = 'singles' | 'sealed' | 'buylists';

/**
 * Device type for responsive UI adjustments
 */
export type DeviceType = 'mobile' | 'desktop';
/**
 * Props for navigation links
 */
export interface NavLinkProps {
  href: string;
  isActive: boolean;
  children: ReactNode;
  target?: string;
  rel?: string;
  onClick?: () => void;
  className?: string;
}

/**
 * Props for search providers
 */
export interface SearchProviderProps {
  children: ReactNode;
  currentPath: string;
  deviceType: DeviceType;
}
