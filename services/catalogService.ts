import axiosInstance from '@/utils/axiosWrapper';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface SearchParams {
  index: string;
  keyword: string;
  sortBy: string;
  maxResultsPerPage?: string;
  pageNumber?: string;
  fuzzy?: 'max' | 'min' | 'none';
  filterSelections?: Record<string, string[]>;
  tcg?: string;
}

export interface Product {
  id: string;
  name: string;
  set: string;
  tcg: string;
  image: string;
  price: number;
  promoted?: boolean;
  // Add other product fields as needed
}

export interface SearchResponse {
  results: Product[];
  filters: FilterOption[];
  pagination: {
    numResults: number;
    numPages: number;
    currentPage: number;
  };
  promotedResults?: Product[];
}

export interface FilterOption {
  field: string;
  label: string;
  values: {
    value: string;
    label: string;
    count: number;
    selected: boolean;
  }[];
}

export class CatalogService {
  async search(params: SearchParams): Promise<SearchResponse> {
    const queryParams = new URLSearchParams();

    // Add base params
    Object.entries(params).forEach(([key, value]) => {
      if (value && !['filterSelections'].includes(key)) {
        queryParams.append(key, value.toString());
      }
    });

    // Add filter selections if they exist
    if (params.filterSelections) {
      Object.entries(params.filterSelections).forEach(([field, values]) => {
        values.forEach((value) => {
          queryParams.append(`filterSelections[${field}][]`, value);
        });
      });
    }

    const response = await this.search(params);

    return response;
  }

  async multiSearch(searches: SearchParams[]): Promise<SearchResponse[]> {
    const response = await axiosInstance.post(
      `${BASE_URL}/api/v1/catalog/multisearch`,
      { searches }
    );
    return response.data;
  }

  async sealedSearch(params: SearchParams): Promise<SearchResponse> {
    // Ensure the index is set for sealed products
    params.index = params.index.startsWith('ca_sealed')
      ? params.index
      : `ca_sealed_${params.tcg || 'all'}_prod*`;

    return this.search(params);
  }
}

export const catalogService = new CatalogService();
