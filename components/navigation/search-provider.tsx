'use client';

import { DeviceType, SearchMode } from './navbar-types';
import SinglesSearchBar from './search-bars/singles-search-bar';
import BuylistsSearchBar from './search-bars/buylists-search-bar';
import SealedSearchBar from './search-bars/sealed-search-bar';
import SinglesResultsToolbar from './toolbars/singles-results-toolbar';

/**
 * Maps routes to search modes for consistent handling
 */
const routeToSearchModeMap: Record<string, SearchMode> = {
  '/': 'singles',
  '/buylists': 'buylists',
  '/sealed': 'sealed'
};

/**
 * Determines the search mode for the current path
 */
export const getSearchModeForPath = (path: string): SearchMode | null => {
  return routeToSearchModeMap[path] || null;
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
