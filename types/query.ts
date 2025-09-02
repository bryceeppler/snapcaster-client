export interface FilterOptionValues {
  label: string;
  value: string;
  count: number;
  selected: boolean;
}
export interface FilterOption {
  name: string;
  field: string;
  fieldType: string;
  filterType: string;
  values: FilterOptionValues[];
}

export type SealedSortOptions =
  | 'price-asc'
  | 'price-desc'
  | 'score'
  | 'name-asc'
  | 'name-desc';
export const sealedSortByLabel: Record<string, string> = {
  score: 'Relevance',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
  'name-asc': 'Name: A-Z',
  'name-desc': 'Name: Z-A'
};

export type ProductSortOptions =
  | 'price-asc'
  | 'price-desc'
  | 'score'
  | 'name-asc'
  | 'name-desc';
export const productSortByLabel: Record<string, string> = {
  score: 'Relevance',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
  'name-asc': 'Name: A-Z',
  'name-desc': 'Name: Z-A'
};
