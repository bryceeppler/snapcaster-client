import {
  AdvertisementWithImages,
  AdvertisementWeight
} from '../types/advertisements';

type WeightedAdvertisement = AdvertisementWithImages & {
  currentWeight: number;
};

export class AdSelector {
  private weightedAds: WeightedAdvertisement[];
  private storeWeights: AdvertisementWeight[];

  private shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  constructor(
    ads: AdvertisementWithImages[],
    storeWeights: AdvertisementWeight[] = []
  ) {
    this.storeWeights = storeWeights;
    this.weightedAds = this.shuffle(ads).map((ad) => ({
      ...ad,
      currentWeight: this.getInitialWeight(ad.vendor_id)
    }));
  }

  private getInitialWeight(vendorId: number): number {
    const storeWeight = this.storeWeights.find(
      (sw) => sw.vendor_id === vendorId
    );
    return storeWeight?.weight || 1; // default weight is 1
  }

  public getNextAd(): AdvertisementWithImages {
    if (this.weightedAds.length === 0) {
      throw new Error('No ads available');
    }

    // Find ad with the highest current weight
    const selectedAd = this.weightedAds.reduce((prev, current) =>
      current.currentWeight > prev.currentWeight ? current : prev
    );

    // Update weights
    this.weightedAds = this.weightedAds.map((ad) => ({
      ...ad,
      currentWeight:
        ad.id === selectedAd.id
          ? this.getInitialWeight(ad.vendor_id) // Reset selected ad's weight
          : ad.currentWeight + this.getInitialWeight(ad.vendor_id) // Increment others
    }));

    const { currentWeight, ...adWithoutWeight } = selectedAd;
    return adWithoutWeight;
  }
}
