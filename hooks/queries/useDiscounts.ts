import { useQuery } from '@tanstack/react-query';
import type { Discount } from '@/types/discounts';
import { vendorService } from '@/services/vendorService';

const fetchDiscounts = async (): Promise<Discount[]> => {
  try {
    const response = await vendorService.getDiscounts();
    return response;
  } catch (error) {
    console.error('Error fetching vendors:', error);
    throw error;
  }
};

export const useDiscounts = () => {
  const query = useQuery({
    queryKey: ['discounts'],
    queryFn: fetchDiscounts,
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false
  });

  const getDiscountByVendorSlug = (
    vendorSlug: string
  ): Discount | undefined => {
    const discount = query.data?.find(
      (discount) => discount.vendor_slug === vendorSlug
    );
    return discount;
  };

  const getLargestActiveDiscountByVendorSlug = (
    vendorSlug: string
  ): Discount | undefined => {
    const discounts = query.data?.filter(
      (discount) =>
        discount.vendor_slug === vendorSlug &&
        discount.is_active &&
        discount.expires_at &&
        discount.expires_at > new Date()
    );
    return discounts?.reduce((max, current) => {
      return current.discount_amount > max.discount_amount ? current : max;
    }, discounts[0]);
  };

  return {
    discounts: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    getDiscountByVendorSlug,
    getLargestActiveDiscountByVendorSlug
  };
};
