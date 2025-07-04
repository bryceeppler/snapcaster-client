'use client';

import BuylistsSearchBar from './search-bars/buylists-search-bar';
import SealedSearchBar from './search-bars/sealed-search-bar';
import SinglesSearchBar from './search-bars/singles-search-bar';
import SinglesResultsToolbar from './toolbars/singles-results-toolbar';

import type { DeviceType, SearchMode } from '@/types/navbar';

/**
 * Determines the search mode for the current path (This is used to determine which search bar to render for singles, sealed, and buylists only)
 */
export const getSearchModeForPath = (path: string): SearchMode | null => {
  // Handle exact root path
  if (path === '/') {
    return 'singles';
  }

  // Handle paths that start with /buylists
  if (path.startsWith('/buylists')) {
    return 'buylists';
  }

  // Handle paths that start with /sealed
  if (path.startsWith('/sealed')) {
    return 'sealed';
  }

  return null;
};

/**
 * Component that renders the appropriate search bar based on the current route
 */
export const SearchBar = ({
  currentPath,
  deviceType
}: {
  currentPath: string;
  deviceType: DeviceType;
}): JSX.Element | null => {
  const searchMode = getSearchModeForPath(currentPath);

  if (!searchMode) return null;

  switch (searchMode) {
    case 'singles':
      return <SinglesSearchBar deviceType={deviceType} />;
    case 'buylists':
      return <BuylistsSearchBar deviceType={deviceType} />;
    case 'sealed':
      return <SealedSearchBar deviceType={deviceType} />;
    default:
      return null;
  }
};

/**
 * Component that renders the appropriate results toolbar based on the current route
 */
export const ResultsToolbar = ({
  currentPath
}: {
  currentPath: string;
}): JSX.Element | null => {
  const searchMode = getSearchModeForPath(currentPath);

  if (!searchMode) return null;

  // We can extend this to support more result toolbars as needed
  switch (searchMode) {
    case 'singles':
      return <SinglesResultsToolbar />;
    default:
      return null;
  }
};
