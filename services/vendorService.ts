import axios from 'axios';

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
}

export const vendorService = new VendorService();
