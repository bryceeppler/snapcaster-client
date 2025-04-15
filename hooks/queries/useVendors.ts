import { useQuery } from '@tanstack/react-query';
import type { Vendor } from '@/services/vendorService';
import { vendorService } from '@/services/vendorService';

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
  const query = useQuery({
    queryKey: ['vendors'],
    queryFn: fetchVendors,
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false
  });

  const getVendorBySlug = (slug: string): Vendor | undefined => {
    return query.data?.find((vendor) => vendor.slug === slug);
  };

  const getVendorNameBySlug = (slug: string): string => {
    const vendor = query.data?.find((vendor) => vendor.slug === slug);
    return vendor ? vendor.name : 'Vendor not found';
  };

  return {
    vendors: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    getVendorBySlug,
    getVendorNameBySlug
  };
};
