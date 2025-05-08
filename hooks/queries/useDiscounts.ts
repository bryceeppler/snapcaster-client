import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { vendorService } from '@/services/vendorService';
import type { Discount } from '@/types/discounts';
import type {
  CreateDiscountRequest,
  UpdateDiscountRequest
} from '@/types/discounts';

const QUERY_KEY = 'discounts';

const fetchDiscounts = async (): Promise<Discount[]> => {
  try {
    const response = await vendorService.getDiscounts();
    return response;
  } catch (error) {
    console.error('Error fetching discounts:', error);
    throw error;
  }
};

export const useDiscounts = () => {
  const queryClient = useQueryClient();

  // Query for fetching all discounts
  const query = useQuery({
    queryKey: [QUERY_KEY],
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

  const getDiscountsByVendorId = (vendorId: number | null): Discount[] => {
    if (!vendorId) return query.data || [];
    const discounts = query.data?.filter(
      (discount) => discount.vendor_id === vendorId
    );
    return discounts || [];
  };

  const getLargestActiveDiscountByVendorSlug = (
    vendorSlug: string
  ): Discount | undefined => {
    const now = new Date();
    const discounts = query.data?.filter(
      (discount) =>
        discount.vendor_slug === vendorSlug &&
        discount.is_active &&
        discount.starts_at <= now &&
        (discount.expires_at === null || discount.expires_at >= now)
    );

    // If no active discounts are found, return undefined
    if (!discounts?.length) {
      return undefined;
    }

    // Find the largest discount amount among all active discounts
    return discounts.reduce((max, current) => {
      return current.discount_amount > max.discount_amount ? current : max;
    }, discounts[0]);
  };

  // Mutation for creating a new discount
  const createDiscount = useMutation({
    mutationFn: (data: CreateDiscountRequest) =>
      vendorService.createDiscount(data),
    onSuccess: () => {
      toast.success('Discount created successfully');
      // Invalidate the discounts query to refresh the data
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: (error) => {
      console.error('Error creating discount:', error);
      toast.error('Failed to create discount. Please try again.');
    }
  });

  // Mutation for updating a discount
  const updateDiscount = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDiscountRequest }) =>
      vendorService.updateDiscount(id, data),
    onSuccess: () => {
      toast.success('Discount updated successfully');
      // Invalidate the discounts query to refresh the data
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: (error) => {
      console.error('Error updating discount:', error);
      toast.error('Failed to update discount. Please try again.');
    }
  });

  // Mutation for deleting a discount
  const deleteDiscount = useMutation({
    mutationFn: (id: number) => vendorService.deleteDiscount(id),
    onSuccess: () => {
      toast.success('Discount deleted successfully');
      // Invalidate the discounts query to refresh the data
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: (error) => {
      console.error('Error deleting discount:', error);
      toast.error('Failed to delete discount. Please try again.');
    }
  });

  // Function to fetch discounts by vendor ID directly (for cases where we need to skip cache)
  const fetchDiscountsByVendorId = async (
    vendorId: number,
    skipCache: boolean = false
  ): Promise<Discount[]> => {
    try {
      return await vendorService.fetchDiscountsByVendorId(vendorId, skipCache);
    } catch (error) {
      console.error('Error fetching discounts by vendor ID:', error);
      toast.error('Failed to fetch discounts. Please try again.');
      return [];
    }
  };

  return {
    // Query data
    discounts: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,

    // Getter methods
    getDiscountByVendorSlug,
    getLargestActiveDiscountByVendorSlug,
    getDiscountsByVendorId,

    // Direct fetch methods
    fetchDiscountsByVendorId,

    // Mutations
    createDiscount,
    updateDiscount,
    deleteDiscount
  };
};
