export type Tcg =
  | 'yugioh'
  | 'pokemon'
  | 'lorcana'
  | 'mtg'
  | 'onepiece'
  | 'starwars'
  | 'fleshandblood';
export type Condition = 'nm' | 'lp' | 'mp' | 'hp' | 'dmg';

export interface Product {
  name: string;
  normalized_name?: string;
  set: string;
  price: number;
  condition: string;
  finish: string;
  vendor: string;
  link: string;
  image: string;
  variant_id?: string;
  [key: string]: any;
}

export interface PromotedProduct extends Product {
  promoted?: boolean;
}

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
