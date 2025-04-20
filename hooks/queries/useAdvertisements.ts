import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AdvertisementWithImages } from '@/types/advertisements';
import {
  advertisementService,
  CreateAdvertisementRequest,
  UpdateAdvertisementRequest,
  CreateAdvertisementImageRequest
} from '@/services/advertisementService';
import { toast } from 'sonner';

export const QUERY_KEY = 'advertisements';

const fetchAdvertisements = async (): Promise<AdvertisementWithImages[]> => {
  try {
    const response = await advertisementService.getAllAdvertisements();
    return response;
  } catch (error) {
    console.error('Error fetching advertisements:', error);
    throw error;
  }
};

export const useAdvertisements = (vendorId?: number | null) => {
  const queryClient = useQueryClient();

  // Query for fetching all advertisements
  const query = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: fetchAdvertisements,
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false
  });

  // Query function to get advertisements by vendor ID
  const getAdvertisementsByVendorId = (
    vendorId: number | null
  ): AdvertisementWithImages[] => {
    if (!vendorId) return query.data || [];
    return query.data?.filter((ad) => ad.vendor_id === vendorId) || [];
  };

  // Get advertisement by ID from the cached data
  const getAdvertisementById = (
    adId: number
  ): AdvertisementWithImages | undefined => {
    return query.data?.find((ad) => ad.id === adId);
  };

  const getActiveAdvertisements = (): AdvertisementWithImages[] => {
    // filter the advertisements by is_active, and the images by is_active
    return (
      query.data
        ?.filter((ad) => ad.is_active)
        .map((ad) => ({
          ...ad,
          images: ad.images.filter((img) => img.is_active)
        })) || []
    );
  };

  // Mutation for creating a new advertisement
  const createAdvertisement = useMutation({
    mutationFn: (data: CreateAdvertisementRequest) =>
      advertisementService.createAdvertisement(data),
    onSuccess: () => {
      toast.success('Advertisement created successfully');
      // Invalidate the appropriate query based on vendorId
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: (error) => {
      console.error('Error creating advertisement:', error);
      toast.error('Failed to create advertisement. Please try again.');
    }
  });

  // Mutation for updating an advertisement
  const updateAdvertisement = useMutation({
    mutationFn: ({
      id,
      data
    }: {
      id: number;
      data: UpdateAdvertisementRequest;
    }) => advertisementService.updateAdvertisement(id, data),
    onSuccess: () => {
      toast.success('Advertisement updated successfully');
      // Invalidate the appropriate query based on vendorId
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: (error) => {
      console.error('Error updating advertisement:', error);
      toast.error('Failed to update advertisement. Please try again.');
    }
  });

  // Mutation for deleting an advertisement
  const deleteAdvertisement = useMutation({
    mutationFn: (id: number) => advertisementService.deleteAdvertisement(id),
    onSuccess: () => {
      toast.success('Advertisement deleted successfully');
      // Invalidate the appropriate query based on vendorId
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: (error) => {
      console.error('Error deleting advertisement:', error);
      toast.error('Failed to delete advertisement. Please try again.');
    }
  });

  // Mutation for deleting an advertisement image
  const deleteAdvertisementImage = useMutation({
    mutationFn: (id: number) =>
      advertisementService.deleteAdvertisementImage(id),
    onSuccess: () => {
      toast.success('Image deleted successfully');
      // Invalidate the appropriate query based on vendorId
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: (error) => {
      console.error('Error deleting advertisement image:', error);
      toast.error('Failed to delete image. Please try again.');
    }
  });

  // Function to fetch a specific advertisement by vendor and ad ID if it's not in the cache
  // This is a fallback method that should be used only when necessary
  const fetchAdvertisementById = async (
    vendorId: number,
    adId: number
  ): Promise<AdvertisementWithImages | null> => {
    // First, check if we have this advertisement in the cache
    const cachedAd = getAdvertisementById(adId);
    if (cachedAd) {
      return cachedAd;
    }

    // If not in cache, try to fetch from the API
    try {
      // Fetching all advertisements first to ensure our cache is updated
      await queryClient.fetchQuery({ queryKey: [QUERY_KEY] });

      // Check the cache again after refreshing
      const refreshedAd = getAdvertisementById(adId);
      if (refreshedAd) {
        return refreshedAd;
      }

      // If we still couldn't find it, notify user
      toast.error('Advertisement not found');
      return null;
    } catch (error) {
      console.error('Error fetching advertisement by ID:', error);
      toast.error('Failed to fetch advertisement details');
      return null;
    }
  };

  return {
    // Query data
    ads: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    getAdvertisementsByVendorId,
    getActiveAdvertisements,
    getAdvertisementById,
    // Direct fetch methods
    fetchAdvertisementById,

    // Mutations
    createAdvertisement,
    updateAdvertisement,
    deleteAdvertisement,
    deleteAdvertisementImage
  };
};
