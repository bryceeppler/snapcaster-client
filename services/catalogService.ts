import axiosInstance from '@/utils/axiosWrapper';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface SearchParams {
  index: string;
  keyword: string;
  sortBy: string;
  maxResultsPerPage?: string;
  pageNumber?: string;
  fuzzy?: 'max' | 'min' | 'none';
  filterSelections?: Record<string, string[]>;
  tcg?: string;
}

interface Product {
  id: string;
  name: string;
  set: string;
  tcg: string;
  image: string;
  price: number;
  promoted?: boolean;
  // Add other product fields as needed
}

interface SearchResponse {
  results: Product[];
  filters: FilterOption[];
  pagination: {
    numResults: number;
    numPages: number;
    currentPage: number;
  };
  promotedResults?: Product[];
}

interface FilterOption {
  field: string;
  label: string;
  values: {
    value: string;
    label: string;
    count: number;
    selected: boolean;
  }[];
}

export interface BuylistAnalytics {
  vendor: {
    id: string;
    name: string;
    slug: string;
    url: string;
    is_active: boolean;
    buylist_enabled: boolean;
    tier: string;
    created_at: string;
  };
  submissionData: {
    successfulSubmissions: {
      totalValue: number;
      totalCards: number;
      cashSubmissions: number;
      storeCreditSubmissions: number;
      totalSubmissions: number;
    };
  };
}

interface BuylistSubmission {
  userId: number;
  cartId: string;
  timestamp: string;
  status: string;
  vendorSlug: string;
  paymentType: string;
  totalCards: number;
  totalValue: number;
  cards: {
    baseCardId: number;
    cardName: string;
    setName: string;
    game: string;
    foil: string;
    condition: string;
    conditionName: string;
    quantity: number;
    cashPrice: number;
    creditPrice: number;
  }[];
}

export interface BuylistSubmissionResponse {
  submissions: BuylistSubmission[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

class CatalogService {
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

  async getBuylistAnalytics(vendorId: string): Promise<BuylistAnalytics> {
    const response = await axiosInstance.get(
      `${BASE_URL}/api/v1/catalog/analytics/buylists/${vendorId}`
    );
    return response.data.data;
  }

  async getAdminBuylistAnalytics(): Promise<BuylistAnalytics[]> {
    const response = await axiosInstance.get(
      `${BASE_URL}/api/v1/catalog/analytics/buylists`
    );
    return response.data.data;
  }

  async getBuylistSubmissions(
    page?: number,
    limit?: number,
    vendorSlug?: string,
    status?: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<BuylistSubmissionResponse> {
    const response = await axiosInstance.get(
      `${BASE_URL}/api/v1/catalog/analytics/buylists/submissions`,
      { params: { page, limit, vendorSlug, status, startDate, endDate } }
    );
    return response.data.data;
  }
}

export const catalogService = new CatalogService();
