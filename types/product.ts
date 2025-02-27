export type Tcg =
  | 'yugioh'
  | 'pokemon'
  | 'lorcana'
  | 'mtg'
  | 'onepiece'
  | 'starwars'
  | 'fleshandblood';
export type Condition = 'nm' | 'lp' | 'mp' | 'hp' | 'dmg';

export type Product = {
  name: string;
  set: string;
  price: number;
  condition: string;
  finish: string;
  vendor: string;
  link: string;
  image: string;
  variant_id?: string;
  [key: string]: any;
};

export type SealedProduct = {
  name: string;
  price: number;
  vendor: string;
  link: string;
  image: string;
  variant_id?: string;
  [key: string]: any;
};

export interface SingleCatalogCard extends Product {
  promoted?: boolean;
}

export interface BuyListQueryCard {
  name: string;
  filters: any;
  image: string;
  conditions?: {
    [key in Condition]?: BuyListCardPricing;
  };
}

export interface BuyListStorePricing {
  cashPrice: number;
  creditPrice: number;
}

export interface BuyListConditionPricing {
  [storeName: string]: BuyListStorePricing;
}

export interface BuyListCardPricing {
  conditions?: {
    [key in Condition]?: BuyListConditionPricing;
  };
}

export interface BuyListCartStoreData {
  [storeName: string]: BuyListCartCardData[];
}

export interface BuyListCartCardData {
  name: string;
  condition: string;
  quantity: number;
  rarity: string;
  set: string;
  foil: string;
  cashPrice: number;
  creditPrice: number;
}
