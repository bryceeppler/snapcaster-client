export enum AdvertisementPosition {
  TOP_BANNER = 'TOP_BANNER',
  LEFT_BANNER = 'LEFT_BANNER',
  RIGHT_BANNER = 'RIGHT_BANNER',
  FEED = 'FEED'
}

type Advertisement = {
  id: number;
  vendorId: number;
  position: AdvertisementPosition;
  targetUrl: string;
  isActive: boolean;
  weight: number;
  altText: string;
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export enum AdvertisementImageType {
  MOBILE = 'MOBILE',
  DESKTOP = 'DESKTOP',
  DEFAULT = 'DEFAULT'
}

export type AdvertisementImage = {
  id: number;
  advertisementId: number;
  imageType: AdvertisementImageType;
  imageUrl: string;
  isApproved: boolean;
  isEnabled: boolean;
  width: number;
  height: number;
  fileSize: number;
  fileType: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
};

export type AdvertisementWithImages = Advertisement & {
  images: AdvertisementImage[];
};
