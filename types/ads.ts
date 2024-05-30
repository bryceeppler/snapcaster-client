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
};

export type PositionAds = {
  [key: string]: {
    ads: Ad[];
  };
};

export type AdsResponse = {
  position: PositionAds;
};
