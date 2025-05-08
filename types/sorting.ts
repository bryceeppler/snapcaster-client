/**
 * Types for sorting components and functionality
 */

/**
 * Represents a sort option identifier
 */
export type SortOption = string;

/**
 * Properties for sort selector components
 */
export interface SortByProps {
  /**
   * Currently selected sort option
   */
  sortBy: SortOption;

  /**
   * Function to update the selected sort option
   * @param sortBy The new sort option to apply
   */
  setSortBy: (sortBy: SortOption) => void;

  /**
   * Function to fetch data with updated sort parameters
   */
  fetchCards: () => Promise<void>;

  /**
   * Function to reset pagination when sort changes
   * @param currentPage The page number to set
   */
  setCurrentPage: (currentPage: number) => void;

  /**
   * Available sort options as key-value pairs (key: sort identifier, value: display label)
   */
  sortByOptions: Record<string, string>;

  /**
   * Optional CSS class name for the trigger element
   */
  triggerClassName?: string;
}
