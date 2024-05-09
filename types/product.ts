export type Tcgs = 'yugioh' | 'pokemon' | 'lorcana' | 'mtg';

export type Product = {
  _id: string;
  name: string;
  set: string;
  price: number;
  foil: boolean;
  condition: string;
  image: string;
  link: string;
  website: string;
  product_type: string;
};

export type MultiSearchProduct = {
  name: string;
  results: Product[];
};
