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
export type BuylistSortOptions =
  | 'name-asc'
  | 'name-desc'
  export type SingleSortOptions =
  | 'price-asc'
  | 'price-desc'
  | 'score'
  | 'name-asc'
  | 'name-desc';
  export  const singleSortByLabel: Record<string, string> = { 
    score: 'Relevance',
    'price-asc': 'Price: Low to High',
    'price-desc': 'Price: High to Low',
    'name-asc': 'Name: A-Z',
    'name-desc': 'Name: Z-A'
  };
  export const buylistSortByLabel: Record<string, string> = {

    'name-asc': 'Name: A-Z',
    'name-desc': 'Name: Z-A',
  };