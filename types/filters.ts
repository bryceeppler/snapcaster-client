/**
 * Types for filter components and functionality
 */

/**
 * Properties for components that display filterable content in a sheet or drawer
 */
export interface FilterSheetProps {
  /**
   * Determines if the filter sheet is currently visible
   */
  open: boolean;

  /**
   * Callback function that triggers when the open state changes
   * @param open The new open state
   */
  onOpenChange: (open: boolean) => void;
}

/**
 * Properties for filter components used with sealed products
 */
export interface SealedFilterSheetProps {
  /**
   * Currently selected sort option
   */
  sortBy: string | null;

  /**
   * Function to update the selected sort option
   * @param sortBy The new sort option to apply
   */
  setSortBy: (sortBy: string | null) => void;

  /**
   * Mapping of sort option keys to their display labels
   */
  sortByLabel: Record<string, string>;

  /**
   * Function to reset all filters to their default state
   */
  clearFilters: () => void;
}
