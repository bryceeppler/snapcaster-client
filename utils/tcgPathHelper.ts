export const TCG_PATHS = [
  'magic-the-gathering',
  'starwars-unlimited',
  'flesh-and-blood',
  'pokemon',
  'yugioh',
  'one-piece-tcg',
  'lorcana'
];

export const PRETTY_NAMES: Record<string, string> = {
  'magic-the-gathering': 'Magic: The Gathering',
  'starwars-unlimited': 'Star Wars Unlimited',
  'flesh-and-blood': 'Flesh and Blood',
  pokemon: 'Pokémon',
  yugioh: 'Yu-Gi-Oh!',
  'one-piece-tcg': 'One Piece TCG',
  lorcana: 'Disney Lorcana'
};

/**
 * Maps select values to URL paths for navigation
 */
export const TCG_SELECT_TO_PATH: Record<string, string> = {
  mtg: 'magic-the-gathering',
  starwars: 'starwars-unlimited',
  fleshandblood: 'flesh-and-blood',
  pokemon: 'pokemon',
  yugioh: 'yugioh',
  onepiece: 'one-piece-tcg',
  lorcana: 'lorcana'
};

/**
 * Maps URL paths to select values
 */
export const TCG_PATH_TO_SELECT: Record<string, string> = {
  'magic-the-gathering': 'mtg',
  'starwars-unlimited': 'starwars',
  'flesh-and-blood': 'fleshandblood',
  pokemon: 'pokemon',
  yugioh: 'yugioh',
  'one-piece-tcg': 'onepiece',
  lorcana: 'lorcana'
};

/**
 * Fetches the top 3 most popular clicked sets for a specific TCG
 */
export async function getPopularClickedSets(
  tcgPath: string
): Promise<string[]> {
  try {
    // Convert tcgPath to the format expected by the API
    const tcgKey = TCG_PATH_TO_SELECT[tcgPath];
    if (!tcgKey) {
      console.warn(`No TCG key found for path: ${tcgPath}`);
      return [];
    }

    // Get data for the last 30 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      }/api/analytics/popular-clicked-sets?` +
        `startDate=${startDate.toISOString()}&` +
        `endDate=${endDate.toISOString()}&` +
        `limit=3`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch popular sets: ${response.statusText}`);
    }

    const data = await response.json();
    const tcgSets = data[tcgKey] || [];

    // Return just the set names (top 3)
    return tcgSets
      .slice(0, 3)
      .map((set: { setName: string; count: number }) => set.setName);
  } catch (error) {
    console.error('Error fetching popular clicked sets:', error);
    return [];
  }
}
