import { useQuery } from '@tanstack/react-query';
import type { AdvertisementWithImages } from '@/types/advertisements';
import { AdvertisementPosition } from '@/types/advertisements';
import { advertisementService } from '@/services/advertisementService';

const fetchAdvertisements = async (): Promise<AdvertisementWithImages[]> => {
  try {
    const response = await advertisementService.getAllAdvertisements();
    return response;
  } catch (error) {
    console.error('Error fetching advertisements:', error);
    throw error;
  }
};

export const useAdvertisements = () => {
  const query = useQuery({
    queryKey: ['advertisements'],
    queryFn: fetchAdvertisements,
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false
  });

  const getAdvertisementsByVendorId = (
    vendorId: number
  ): AdvertisementWithImages[] => {
    return query.data?.filter((ad) => ad.vendor_id === vendorId) || [];
  };

  // Simplify the return value to just include the data
  return {
    ads: query.data || [],
    getAdvertisementsByVendorId
  };
};
