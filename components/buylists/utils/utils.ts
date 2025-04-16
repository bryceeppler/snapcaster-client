import { VendorAssetTheme, VendorAssetType } from '@/services/vendorService';
import useBuyListStore, { IBuylistCart } from '@/stores/useBuylistStore';
import axiosInstance from '@/utils/axiosWrapper';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from 'next-themes';

// Throwing in these common functions here to avoid redecalre them in multiple buylist related files
export const getCurrentCart = () => {
  const CART_KEY = (cartId: number) => ['cart', cartId] as const;
  const { currentCartId } = useBuyListStore();
  const { data: currentCart } = useQuery<{
    success: boolean;
    cart: IBuylistCart;
  } | null>({
    queryKey: CART_KEY(currentCartId || 0),
    queryFn: async () => {
      if (!currentCartId) return null;
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_BUYLISTS_URL}/v2/carts/${currentCartId}`
      );
      return response.data;
    },
    enabled: !!currentCartId
  });
  return currentCart;
};

// Helper function to get vendor name from slug
export const getVendorNameBySlug = (slug: string, vendors: any): string => {
  const vendor = vendors.find((vendor: any) => vendor.slug === slug);
  return vendor ? vendor.name : 'Vendor not found';
};

// Add this helper function after the getVendorNameBySlug function
export const getVendorIcon = (
  vendorSlug: string,
  vendors: any
): string | null => {
  const { theme } = useTheme();
  const vendor = vendors.find((vendor: any) => vendor.slug === vendorSlug);
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
