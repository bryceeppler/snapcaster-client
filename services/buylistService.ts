import axiosInstance from '@/utils/axiosWrapper';

const BASE_URL = process.env.NEXT_PUBLIC_BUYLISTS_URL;

export interface BuylistCard {
  id: string;
  name: string;
  set: string;
  condition: string;
  price: number;
  quantity: number;
  image: string;
}

export interface BuylistCart {
  id: string;
  name: string;
  cards: BuylistCard[];
  createdAt: string;
  updatedAt: string;
  totalItems: number;
  totalValue: number;
}

export interface BuylistSearchParams {
  keyword: string;
  filters?: Record<string, string[]>;
  sortBy?: string;
  maxResultsPerPage?: string;
  pageNumber?: string;
}

export interface BuylistSearchResponse {
  results: BuylistCard[];
  filters: {
    field: string;
    values: {
      value: string;
      count: number;
      selected: boolean;
    }[];
  }[];
  pagination: {
    numResults: number;
    numPages: number;
  };
}

export class BuylistService {
  async search(params: BuylistSearchParams): Promise<BuylistSearchResponse> {
    const queryParams = new URLSearchParams({
      keyword: params.keyword.trim(),
      sortBy: params.sortBy || 'relevance',
      maxResultsPerPage: params.maxResultsPerPage || '100',
      pageNumber: params.pageNumber || '1'
    });

    if (params.filters) {
      Object.entries(params.filters).forEach(([field, values]) => {
        values.forEach(value => {
          queryParams.append(`filterSelections[${field}][]`, value);
        });
      });
    }

    const response = await axiosInstance.get(
      `${BASE_URL}/v2/search?${queryParams.toString()}`
    );
    return response.data;
  }

  // Cart Operations
  async getCarts(): Promise<BuylistCart[]> {
    const response = await axiosInstance.get(`${BASE_URL}/v2/carts`);
    return response.data.carts;
  }

  async createCart(name: string): Promise<BuylistCart> {
    const response = await axiosInstance.post(`${BASE_URL}/v2/carts`, { name });
    return response.data;
  }

  async deleteCart(cartId: string): Promise<void> {
    await axiosInstance.delete(`${BASE_URL}/v2/carts/${cartId}`);
  }

  async getCartItems(cartId: string): Promise<BuylistCard[]> {
    const response = await axiosInstance.get(`${BASE_URL}/v2/carts/${cartId}/cards`);
    return response.data.cards;
  }

  async addCardToCart(cartId: string, card: Partial<BuylistCard>): Promise<void> {
    await axiosInstance.post(`${BASE_URL}/v2/carts/${cartId}/cards`, card);
  }

  async removeCardFromCart(cartId: string, cardId: string): Promise<void> {
    await axiosInstance.delete(`${BASE_URL}/v2/carts/${cartId}/cards/${cardId}`);
  }

  async updateCardQuantity(cartId: string, cardId: string, quantity: number): Promise<void> {
    await axiosInstance.patch(`${BASE_URL}/v2/carts/${cartId}/cards/${cardId}`, { quantity });
  }

  // Checkout and Submit Operations
  async createCheckout(cartId: string): Promise<{ checkoutUrl: string }> {
    const response = await axiosInstance.post(`${BASE_URL}/v2/carts/${cartId}/checkouts`);
    return response.data;
  }

  async submitBuylist(cartId: string): Promise<{ success: boolean; message: string }> {
    const response = await axiosInstance.post(`${BASE_URL}/v2/carts/${cartId}/submit`);
    return response.data;
  }
}

export const buylistService = new BuylistService(); 