import axios from 'axios';
import axiosInstance from '@/utils/axiosWrapper';
import { Discount, CreateDiscountRequest } from '@/types/discounts';
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
    return response.data.data || ([] as Discount[]);
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
      return response.data.data || ([] as Discount[]);
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

  async deleteDiscount(discountId: number): Promise<void> {
    const url = `${BASE_URL}/api/v1/vendor/discounts/${discountId}`;

    try {
      await axiosInstance.delete(url);
    } catch (error) {
      console.error('Error deleting discount:', error);
      throw error; // Re-throw the error so it can be caught by the calling function
    }
  }
}

export const vendorService = new VendorService();
