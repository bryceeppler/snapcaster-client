export type Tcg = 'yugioh' | 'pokemon' | 'lorcana' | 'mtg' | 'onepiece';

export type Product = {
  name: string;
  set: string;
  price: number;
  condition: string;
  finish: string;
  vendor: string;
  link: string;
  image: string;
  [key: string]: any;
};

export interface SingleCatalogCard extends Product {
  promoted?: boolean;
}

