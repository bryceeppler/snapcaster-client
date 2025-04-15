// Static ad weights for banner positions
export const TOP_BANNER_AD_WEIGHTS = {
  obsidian: 3,
  exorgames: 3,
  chimera: 3,
  levelup: 1
};

export const LEFT_BANNER_AD_WEIGHTS = {
  obsidian: 1,
  exorgames: 1,
  chimera: 1
};

export const RIGHT_BANNER_AD_WEIGHTS = {
  levelup: 1,
  houseofcards: 1,
  mythicstore: 1
};

// Note: FEED_AD_WEIGHTS are now derived dynamically from vendor.tier
// in the AdManager component with the following mapping:
// - STORE_TIER_1: weight 3
// - STORE_TIER_2: weight 2
// - STORE_TIER_3: weight 1
