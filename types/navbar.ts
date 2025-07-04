/**
 * Shared types and interfaces for the navbar system
 */

import type { ReactNode, RefObject } from 'react';

import type { Tcg } from '@/types';

/**
 * Supported search modes for the application (This is used to determine which search bar to render for singles, sealed, and buylists only)
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
  onClick?: () => void;
  rel?: string;
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

export interface BaseSearchBarProps {
  deviceType: DeviceType;
  tcg: Tcg;
  searchTerm: string;
  placeholder?: string;
  isLoading?: boolean;
  inputRef?: RefObject<HTMLInputElement>;
  onTcgChange: (tcg: Tcg) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInputKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  onSearchClick: () => void;
  renderAutoComplete?: () => ReactNode;
  showSearchHelp?: boolean;
  searchHelpContent?: ReactNode;
}
