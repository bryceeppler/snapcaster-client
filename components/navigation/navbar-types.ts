/**
 * Shared types and interfaces for the navbar system
 */

import { ReactNode } from 'react';
import { Tcg } from '@/types';

/**
 * Supported search modes for the application
 */
export type SearchMode = 'singles' | 'sealed' | 'buylists';

/**
 * Device type for responsive UI adjustments
 */
export type DeviceType = 'mobile' | 'desktop';

/**
 * Base properties for all search bars
 */
export interface BaseSearchBarProps {
  deviceType: DeviceType;
  searchTerm: string;
  tcg: Tcg;
  isLoading?: boolean;
  placeholder?: string;
  onSearchTermChange: (value: string) => void;
  onTcgChange: (value: Tcg) => void;
  onSearch: () => void;
  onClearFilters?: () => void;
  renderAutoComplete?: () => ReactNode;
}

/**
 * Props for route-specific search bar components
 */
export interface RouteSearchBarProps {
  deviceType: DeviceType;
  searchTerm: string;
  tcg: Tcg;
  isLoading?: boolean;
  setSearchTerm: (value: string) => void;
  setTcg: (value: Tcg) => void;
  clearFilters?: () => void;
}

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
