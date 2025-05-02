export enum AdvertisementPosition {
  TOP_BANNER = 'TOP_BANNER',
  LEFT_BANNER = 'LEFT_BANNER',
  RIGHT_BANNER = 'RIGHT_BANNER',
  FEED = 'FEED'
}

export type Advertisement = {
  id: number;
  vendor_id: number;
  position: AdvertisementPosition;
  target_url: string;
  is_active: boolean;
  weight: number;
  alt_text: string;
  start_date: Date;
  end_date?: Date;
  created_at: Date;
  updated_at: Date;
};

export enum AdvertisementImageType {
  MOBILE = 'MOBILE',
  DESKTOP = 'DESKTOP',
  DEFAULT = 'DEFAULT'
}

export type AdvertisementImage = {
  id: number;
  advertisement_id: number;
  image_type: AdvertisementImageType;
  image_url: string;
  is_active: boolean;
  width: number;
  height: number;
  file_size: number;
  file_type: string;
  metadata: Record<string, any>;
  created_at: Date;
  updated_at: Date;
};

export type AdvertisementWeight = {
  vendor_slug: string;
  position: AdvertisementPosition;
  weight: number;
};

export type AdvertisementWithImages = Advertisement & {
  images: AdvertisementImage[];
};

// Type for combined ad image with its parent ad info
export type AdImageWithParentInfo = {
  image: AdvertisementImage;
  parentAd: AdvertisementWithImages;
};

// Vendor weight configuration for distribution control
export type VendorWeightConfig = {
  [vendorSlug: string]: number;
};
