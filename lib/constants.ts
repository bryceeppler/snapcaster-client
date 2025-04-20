import {
  AdvertisementPosition,
  AdvertisementImageType
} from '@/types/advertisements';
export const FREE_MULTISEARCH_CARD_LIMIT = 10;

export const DISCOUNT_MAP = {
  HOCSNAPCASTER: 0.05,
  'OBSIDIAN+SNAPCASTER5': 0.05,
  'SNAPCASTER-D24': 0.07
};

export const SEALED_DISCOUNT_MAP = {
  'OBSIDIAN+SNAPCASTER5': 0.05
};

export const AD_RESOLUTIONS = {
  [AdvertisementPosition.TOP_BANNER]: {
    [AdvertisementImageType.DESKTOP]: {
      width: 1008,
      height: 160
    },
    [AdvertisementImageType.MOBILE]: {
      width: 382,
      height: 160
    }
  },
  [AdvertisementPosition.LEFT_BANNER]: {
    [AdvertisementImageType.DEFAULT]: {
      width: 160,
      height: 480
    }
  },
  [AdvertisementPosition.RIGHT_BANNER]: {
    [AdvertisementImageType.DEFAULT]: {
      width: 160,
      height: 480
    }
  },
  [AdvertisementPosition.FEED]: {
    [AdvertisementImageType.DEFAULT]: {
      width: 240,
      height: 514
    }
  }
};
