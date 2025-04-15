/* the adSelector uses store weights to **RANDOMLY** select in-feed ads according to the FEED_AD_WEIGHTS.
 ** It does not use a LRU or priority queue.
 ** It also does not track which ads have been shown.
 ** It simply selects an ad based on the weight of the store.
 */

import {
  AdvertisementWithImages,
  AdvertisementWeight
} from '../types/advertisements';

type WeightedAdInfo = {
  ad: AdvertisementWithImages;
  weight: number;
};

export class AdSelector {
  private weightedAds: WeightedAdInfo[];
  private storeWeights: AdvertisementWeight[];
  private totalWeight: number;
  private usedAds: Set<number> = new Set(); // Track used ad IDs to avoid immediate repetition

  constructor(
    ads: AdvertisementWithImages[],
    storeWeights: AdvertisementWeight[] = []
  ) {
    this.storeWeights = storeWeights;

    // Create weighted ad objects
    this.weightedAds = ads.map((ad) => ({
      ad,
      weight: this.getWeight(ad.vendor_slug)
    }));

    // Calculate total weight for probability calculation
    this.totalWeight = this.weightedAds.reduce(
      (sum, item) => sum + item.weight,
      0
    );

    // Shuffle initial order to avoid patterns when weights are equal
    this.shuffle(this.weightedAds);
  }

  /**
   * Get the weight for a vendor based on its slug
   */
  private getWeight(vendorSlug: string): number {
    const storeWeightBySlug = this.storeWeights.find(
      (sw) => sw.vendor_slug === vendorSlug
    );
    return storeWeightBySlug?.weight || 1; // default weight is 1
  }

  /**
   * Shuffle an array in place
   */
  private shuffle<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  /**
   * Select a random ad weighted by vendor weights
   * Probability of selection is directly proportional to weight
   */
  public getNextAd(): AdvertisementWithImages {
    if (this.weightedAds.length === 0) {
      throw new Error('No ads available');
    }

    // If all ads have been used once, reset tracking to allow all ads again
    if (this.usedAds.size >= this.weightedAds.length) {
      this.usedAds.clear();
    }

    // Get available ads (those not recently used)
    const availableAds = this.weightedAds.filter(
      (item) => !this.usedAds.has(item.ad.id)
    );

    // If all ads have been used, reset and use all ads
    const adsToChooseFrom =
      availableAds.length === 0 ? this.weightedAds : availableAds;

    // Calculate total available weight
    const availableWeight = adsToChooseFrom.reduce(
      (sum, item) => sum + item.weight,
      0
    );

    // Pick a random weight value between 0 and the total weight
    const randomWeight = Math.random() * availableWeight;

    // Find the ad that corresponds to the random weight
    let weightSum = 0;
    for (const item of adsToChooseFrom) {
      weightSum += item.weight;
      if (randomWeight <= weightSum) {
        // Add this ad to the used set to avoid immediate repetition
        this.usedAds.add(item.ad.id);
        return item.ad;
      }
    }

    // Fallback (should rarely happen due to floating point precision)
    return adsToChooseFrom[adsToChooseFrom.length - 1].ad;
  }

  /**
   * Get all ads in a weighted random order
   */
  public getAllAds(): AdvertisementWithImages[] {
    const result: AdvertisementWithImages[] = [];

    // Reset used ads tracking for a fresh selection
    this.usedAds.clear();

    // Get each ad once in weighted random order
    const adCount = this.weightedAds.length;
    for (let i = 0; i < adCount; i++) {
      try {
        result.push(this.getNextAd());
      } catch (error) {
        break;
      }
    }

    return result;
  }
}
