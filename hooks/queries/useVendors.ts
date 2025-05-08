import { useQuery } from '@tanstack/react-query';
import { useTheme } from 'next-themes';

import type { Vendor } from '@/services/vendorService';
import {
  VendorAssetTheme,
  VendorAssetType,
  vendorService
} from '@/services/vendorService';

const fetchVendors = async (): Promise<Vendor[]> => {
  try {
    const response = await vendorService.getAllVendors();
    return response;
  } catch (error) {
    console.error('Error fetching vendors:', error);
    throw error;
  }
};

export const useVendors = () => {
  const { theme } = useTheme();

  const query = useQuery({
    queryKey: ['vendors'],
    queryFn: fetchVendors,
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false
  });

  const getVendorBySlug = (slug: string): Vendor | undefined => {
    return query.data?.find((vendor) => vendor.slug === slug);
  };

  const getVendorById = (id: number): Vendor | undefined => {
    return query.data?.find((vendor) => vendor.id === id);
  };

  const getVendorNameById = (id: number): string => {
    const vendor = query.data?.find((vendor) => vendor.id === id);
    return vendor ? vendor.name : 'Vendor not found';
  };

  const getVendorNameBySlug = (slug: string): string => {
    const vendor = query.data?.find((vendor) => vendor.slug === slug);
    return vendor ? vendor.name : 'Vendor not found';
  };

  const getVendorIdBySlug = (slug: string): number | undefined => {
    const vendor = query.data?.find((vendor) => vendor.slug === slug);
    return vendor ? vendor.id : undefined;
  };

  const getVendorIcon = (
    // vendorSlug: string,
    // vendors: any
    vendor: any
  ): string | null => {
    if (!vendor) return null;

    // Find the icon asset based on the current theme
    const iconAsset = vendor.assets.find(
      (asset: any) =>
        asset.asset_type === VendorAssetType.ICON &&
        (asset.theme ===
          (theme === 'dark' ? VendorAssetTheme.DARK : VendorAssetTheme.LIGHT) ||
          asset.theme === VendorAssetTheme.UNIVERSAL)
    );

    return iconAsset?.url || null;
  };

  return {
    vendors: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    getVendorBySlug,
    getVendorNameBySlug,
    getVendorNameById,
    getVendorIcon,
    getVendorIdBySlug,
    getVendorById
  };
};
