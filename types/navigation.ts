/**
 * Types for navigation components like sidebars and menus
 */

/**
 * Represents a navigation menu item with its properties
 */
export interface MenuItem {
  /**
   * Display text for the navigation item
   */
  title: string;

  /**
   * Icon component to be displayed alongside the title
   */
  icon: React.ElementType;

  /**
   * Target URL when the navigation item is clicked
   */
  href: string;

  /**
   * Indicates if this item represents the current active route
   */
  isActive: boolean;
}
