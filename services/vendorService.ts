import axios from 'axios';
import axiosInstance from '@/utils/axiosWrapper';
import {
  Discount,
  CreateDiscountRequest,
  UpdateDiscountRequest
} from '@/types/discounts';
import {
  ApiKey,
  CreateApiKeyRequest,
  CreateApiKeyResponse
} from '@/hooks/queries/useApiKeys';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export enum VendorTier {
  FREE = 'FREE',
  TIER_1 = 'STORE_TIER_1',
  TIER_2 = 'STORE_TIER_2',
  TIER_3 = 'STORE_TIER_3'
}

export enum VendorAssetType {
  ICON = 'icon',
  LOGO = 'logo'
}

export enum VendorAssetTheme {
  DARK = 'dark',
  LIGHT = 'light',
  UNIVERSAL = 'universal'
}

export interface VendorAsset {
  id: number;
  asset_type: VendorAssetType;
  theme: VendorAssetTheme;
  url: string;
}

export interface DiscountMap {
  [key: string]: number;
}

export interface Vendor {
  id: number;
  name: string;
  slug: string;
  url: string;
  is_active: boolean;
  buylist_enabled: boolean;
  tier: VendorTier;
  assets: VendorAsset[];
  created_at: Date;
  updated_at: Date;
}

export class VendorService {
  async getAllVendors(): Promise<Vendor[]> {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v1/vendor/vendors?with=assets,discounts&is_active=true`
      );
      return response.data.data || ([] as Vendor[]);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      return [] as Vendor[];
    }
  }

  async getDiscounts(): Promise<Discount[]> {
    const response = await axios.get(`${BASE_URL}/api/v1/vendor/discounts`);
    const discounts = response.data.data || ([] as Discount[]);

    // Convert string dates to Date objects
    return discounts.map((discount: any) => ({
      ...discount,
      starts_at: discount.starts_at ? new Date(discount.starts_at) : null,
      expires_at: discount.expires_at ? new Date(discount.expires_at) : null
    }));
  }

  async fetchDiscountsByVendorId(
    vendorId: number,
    skipCache: boolean = false
  ): Promise<Discount[]> {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v1/vendor/discounts?vendor_id=${vendorId}`,
        {
          headers: {
            'x-skip-cache': skipCache ? 'true' : 'false'
          }
        }
      );
      const discounts = response.data.data || ([] as Discount[]);

      // Convert string dates to Date objects
      return discounts.map((discount: any) => ({
        ...discount,
        starts_at: discount.starts_at ? new Date(discount.starts_at) : null,
        expires_at: discount.expires_at ? new Date(discount.expires_at) : null
      }));
    } catch (error) {
      console.error('Error fetching discounts:', error);
      return [] as Discount[];
    }
  }

  async createDiscount(discount: CreateDiscountRequest): Promise<Discount> {
    const response = await axiosInstance.post(
      `${BASE_URL}/api/v1/vendor/discounts`,
      discount
    );
    return response.data.data;
  }

  async updateDiscount(
    discountId: number,
    discount: UpdateDiscountRequest
  ): Promise<Discount> {
    const url = `${BASE_URL}/api/v1/vendor/discounts/${discountId}`;
    console.log(`Making updateDiscount API request to: ${url}`, {
      discountId,
      discountData: discount
    });

    try {
      const response = await axiosInstance.put(url, discount);
      console.log('API response for updateDiscount:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('API error in updateDiscount:', error);
      throw error;
    }
  }

  async deleteDiscount(discountId: number): Promise<void> {
    const url = `${BASE_URL}/api/v1/vendor/discounts/${discountId}`;

    try {
      await axiosInstance.delete(url);
    } catch (error) {
      console.error('Error deleting discount:', error);
      throw error; // Re-throw the error so it can be caught by the calling function
    }
  }

  // API Keys methods
  async getApiKeys(vendorId: number): Promise<ApiKey[]> {
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}/api/v1/vendor/vendors/${vendorId}/api-keys`
      );
      console.log('API keys response:', response.data);
      return response.data.data || ([] as ApiKey[]);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      throw error;
    }
  }

  async createApiKey(
    vendorId: number,
    request: CreateApiKeyRequest
  ): Promise<CreateApiKeyResponse> {
    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/api/v1/vendor/vendors/${vendorId}/api-keys`,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error('Error creating API key:', error);
      throw error;
    }
  }

  async deleteApiKey(vendorId: number, apiKeyId: string): Promise<void> {
    try {
      await axiosInstance.delete(
        `${BASE_URL}/api/v1/vendor/vendors/${vendorId}/api-keys/${apiKeyId}`
      );
    } catch (error) {
      console.error('Error deleting API key:', error);
      throw error;
    }
  }
}

export const vendorService = new VendorService();
