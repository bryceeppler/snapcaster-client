export type Ad = {
  id: number;
  campaign_id: number;
  name: string;
  store_id: number;
  dimensions: string;
  ad_slot_id: number;
  mobile_image: string;
  desktop_image: string;
  created_at: string;
  position: string;
  url: string;
};

export type AdWeight = {
  store_id: number;
  weight: number;
};

export type WeightedAd = Ad & {
  currentWeight: number;
};

export type PositionAds = {
  [key: string]: {
    ads: Ad[];
    weightedAds?: WeightedAd[];
  };
};

export type AdsResponse = {
  position: PositionAds;
};
