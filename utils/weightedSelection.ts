/**
 * Utility functions for weighted random selection
 */

/**
 * Interface for items that have a weight property
 */
interface Weighted {
  weight: number;
}

/**
 * Creates a weighted distribution array from an array of weighted items
 *
 * @param items Array of items with weight property
 * @param getWeight Optional function to extract weight from complex objects (defaults to using .weight)
 * @returns Array of indices where each index appears weight number of times
 */
function createWeightedDistribution<T extends Weighted>(
  items: T[],
  getWeight: (item: T) => number = (item) => item.weight
): number[] {
  if (!items.length) return [];

  const indices: number[] = [];

  items.forEach((item, index) => {
    const weight = getWeight(item);
    // Only include items with positive weight
    if (weight > 0) {
      // Add the index to the distribution array 'weight' number of times
      for (let i = 0; i < weight; i++) {
        indices.push(index);
      }
    }
  });

  return indices;
}

/**
 * Creates a weighted distribution array excluding a specific index
 *
 * @param items Array of items with weight property
 * @param excludeIndex Index to exclude from the distribution
 * @param getWeight Optional function to extract weight from complex objects
 * @returns Array of indices where each index appears weight number of times (excluding the specified index)
 */
function createWeightedDistributionExcluding<T extends Weighted>(
  items: T[],
  excludeIndex: number,
  getWeight: (item: T) => number = (item) => item.weight
): number[] {
  if (!items.length) return [];

  const indices: number[] = [];

  items.forEach((item, index) => {
    // Skip the excluded index
    if (index === excludeIndex) return;

    const weight = getWeight(item);
    // Only include items with positive weight
    if (weight > 0) {
      // Add the index to the distribution array 'weight' number of times
      for (let i = 0; i < weight; i++) {
        indices.push(index);
      }
    }
  });

  return indices;
}

/**
 * Creates a weighted selection manager that can be used for consistent selection
 * across multiple calls with the same items
 */
export function createWeightedSelectionManager<T extends Weighted>() {
  let itemsCache: T[] = [];
  let distributionCache: number[] = [];
  let getWeightFn: (item: T) => number = (item) => item.weight;
  let previousSelection: number = -1;

  return {
    /**
     * Sets or updates the items and weight function to use for selection
     */
    setItems(
      items: T[],
      getWeight: (item: T) => number = (item) => item.weight
    ) {
      itemsCache = [...items];
      getWeightFn = getWeight;
      distributionCache = createWeightedDistribution(itemsCache, getWeightFn);
      return this;
    },

    /**
     * Selects a random item based on weight distribution
     */
    selectRandom(): number {
      if (distributionCache.length === 0) return -1;

      const randomIndex = Math.floor(Math.random() * distributionCache.length);
      previousSelection = distributionCache[randomIndex] ?? -1;
      return previousSelection;
    },

    /**
     * Selects a random item that's different from the previous selection
     */
    selectDifferentRandom(): number {
      if (itemsCache.length <= 1) return itemsCache.length === 1 ? 0 : -1;

      // If no previous selection, do a regular selection
      if (previousSelection === -1) {
        return this.selectRandom();
      }

      // Create a distribution excluding the previous selection
      const excludingDistribution = createWeightedDistributionExcluding(
        itemsCache,
        previousSelection,
        getWeightFn
      );

      if (excludingDistribution.length === 0) {
        // If all other items have zero weight, fallback to any valid item
        const availableIndices = itemsCache
          .map((_, i) => i)
          .filter((i) => i !== previousSelection);

        if (availableIndices.length === 0) return previousSelection; // No alternatives

        const randomIndex = Math.floor(Math.random() * availableIndices.length);
        previousSelection = availableIndices[randomIndex] ?? previousSelection;
        return previousSelection;
      }

      const randomIndex = Math.floor(
        Math.random() * excludingDistribution.length
      );
      previousSelection = excludingDistribution[randomIndex] ?? -1;
      return previousSelection;
    },

    /**
     * Gets the current items being used
     */
    getItems(): T[] {
      return [...itemsCache];
    },

    /**
     * Gets the current weighted distribution
     */
    getDistribution(): number[] {
      return [...distributionCache];
    },

    /**
     * Gets the previous selection
     */
    getPreviousSelection(): number {
      return previousSelection;
    },

    /**
     * Manually sets the previous selection
     */
    setPreviousSelection(index: number): void {
      previousSelection = index;
    }
  };
}
