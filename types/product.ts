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
