import axiosInstance from '@/utils/axiosWrapper';

const SEARCH_BASE_URL = process.env.NEXT_PUBLIC_SEARCH_URL;
const AUTOCOMPLETE_BASE_URL = process.env.NEXT_PUBLIC_AUTOCOMPLETE_URL;

export interface Website {
  code: string;
  name: string;
  url: string;
  logo?: string;
  country: string;
  enabled: boolean;
}

export interface AutocompleteResult {
  name: string;
  set?: string;
  tcg?: string;
  image?: string;
}

export class SearchService {
  async getWebsites(): Promise<Website[]> {
    const response = await axiosInstance.get(`${SEARCH_BASE_URL}/websites`);
    if (response.data.error || response.data.websiteList.length === 0) {
      return [];
    }
    return response.data.websiteList.sort((a: Website, b: Website) =>
      a.name.localeCompare(b.name)
    );
  }

  async getAutocomplete(
    query: string,
    tcg?: string,
    limit: number = 10
  ): Promise<AutocompleteResult[]> {
    const queryParams = new URLSearchParams({
      q: query,
      limit: limit.toString()
    });

    if (tcg) {
      queryParams.append('tcg', tcg);
    }

    const response = await axiosInstance.get(
      `${AUTOCOMPLETE_BASE_URL}?${queryParams.toString()}`
    );
    return response.data.results || [];
  }

  getWebsiteName(websiteCode: string): string {
    // This is a helper method that can be used client-side
    // after websites are fetched and stored in state
    return websiteCode;
  }
}

export const searchService = new SearchService(); 