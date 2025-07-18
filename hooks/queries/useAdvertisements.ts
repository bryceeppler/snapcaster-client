import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useRef } from 'react';
import { toast } from 'sonner';

import { useAuth } from '@/hooks/useAuth';
import type { UpdateAdvertisementRequest } from '@/services/advertisementService';
import { advertisementService } from '@/services/advertisementService';
import type { AdvertisementWithImages } from '@/types/advertisements';
import { AdvertisementPosition } from '@/types/advertisements';

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

export const useAdvertisements = () => {
  const queryClient = useQueryClient();
  const cachedAdsRef = useRef<{ [key: string]: any }>({});
  const { profile } = useAuth();

  // Get user role and vendor info
  const isAdmin = profile?.data?.user.role === 'ADMIN';
  const vendorId = profile?.data?.user.vendorData?.vendorId;

  // Query for fetching all advertisements
  const query = useQuery({
    queryKey: [QUERY_KEY, isAdmin ? 'admin' : 'vendor', vendorId],
    queryFn: fetchAdvertisements,
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    enabled: !!profile // Only fetch when profile is loaded
  });

  // Memoize and cache query results to prevent unnecessary filtering on window resize
  const cachedData = useMemo(() => query.data || [], [query.data]);

  // Query function to get advertisements by vendor ID - memoized
  const getAdvertisementsByVendorId = useMemo(() => {
    return (vendorId: number | null): AdvertisementWithImages[] => {
      const cacheKey = `vendor_${vendorId || 'all'}`;

      // Use cached result if available and data hasn't changed
      if (
        cachedAdsRef.current[cacheKey] &&
        query.dataUpdatedAt === cachedAdsRef.current.updatedAt
      ) {
        return cachedAdsRef.current[cacheKey];
      }

      // Calculate and cache the result
      const result = vendorId
        ? cachedData.filter((ad) => ad.vendorId === vendorId)
        : [];

      cachedAdsRef.current[cacheKey] = result;
      cachedAdsRef.current.updatedAt = query.dataUpdatedAt;

      return result;
    };
  }, [cachedData, query.dataUpdatedAt]);

  // Get advertisement by ID from the cached data - memoized
  const getAdvertisementById = useMemo(() => {
    return (adId: number): AdvertisementWithImages | undefined => {
      const cacheKey = `ad_${adId}`;

      // Use cached result if available and data hasn't changed
      if (
        cachedAdsRef.current[cacheKey] &&
        query.dataUpdatedAt === cachedAdsRef.current.updatedAt
      ) {
        return cachedAdsRef.current[cacheKey];
      }

      // Calculate and cache the result
      const result = cachedData.find((ad) => ad.id === adId);

      cachedAdsRef.current[cacheKey] = result;
      cachedAdsRef.current.updatedAt = query.dataUpdatedAt;

      return result;
    };
  }, [cachedData, query.dataUpdatedAt]);

  // Get active advertisements - memoized
  const getActiveAdvertisements = useMemo(() => {
    return (): AdvertisementWithImages[] => {
      const cacheKey = 'active_ads';

      // Use cached result if available and data hasn't changed
      if (
        cachedAdsRef.current[cacheKey] &&
        query.dataUpdatedAt === cachedAdsRef.current.updatedAt
      ) {
        return cachedAdsRef.current[cacheKey];
      }

      // Calculate and cache the result
      const result = cachedData
        .filter((ad) => ad.isActive)
        .map((ad) => ({
          ...ad,
          images: ad.images.filter((img) => img.isActive)
        }));

      cachedAdsRef.current[cacheKey] = result;
      cachedAdsRef.current.updatedAt = query.dataUpdatedAt;

      return result;
    };
  }, [cachedData, query.dataUpdatedAt]);

  // return ads with the position TOP_BANNER, and allow for passing a param to filter by isActive = true
  const topBannerAds = useMemo(() => {
    return cachedData.filter(
      (ad) =>
        ad.position === AdvertisementPosition.TOP_BANNER &&
        ad.isActive === true
    );
  }, [cachedData]);

  // Get ads with the position LEFT_BANNER that are active
  const leftBannerAds = useMemo(() => {
    return cachedData.filter(
      (ad) =>
        ad.position === AdvertisementPosition.LEFT_BANNER &&
        ad.isActive === true
    );
  }, [cachedData]);

  // Get ads with the position RIGHT_BANNER that are active
  const rightBannerAds = useMemo(() => {
    return cachedData.filter(
      (ad) =>
        ad.position === AdvertisementPosition.RIGHT_BANNER &&
        ad.isActive === true
    );
  }, [cachedData]);

  // Get ads by position that are active
  const getAdsByPosition = useMemo(() => {
    return (position: AdvertisementPosition): AdvertisementWithImages[] => {
      const cacheKey = `position_${position}`;

      // Use cached result if available and data hasn't changed
      if (
        cachedAdsRef.current[cacheKey] &&
        query.dataUpdatedAt === cachedAdsRef.current.updatedAt
      ) {
        return cachedAdsRef.current[cacheKey];
      }

      // Calculate and cache the result
      const result = cachedData.filter(
        (ad) => ad.position === position && ad.isActive === true
      );

      cachedAdsRef.current[cacheKey] = result;
      cachedAdsRef.current.updatedAt = query.dataUpdatedAt;

      return result;
    };
  }, [cachedData, query.dataUpdatedAt]);

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
      // Invalidate the appropriate query based on user role and vendorId
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY, isAdmin ? 'admin' : 'vendor', vendorId]
      });
      // Clear the cache
      cachedAdsRef.current = {};
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
      // Invalidate the appropriate query based on user role and vendorId
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY, isAdmin ? 'admin' : 'vendor', vendorId]
      });
      // Clear the cache
      cachedAdsRef.current = {};
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
      // Invalidate the appropriate query based on user role and vendorId
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY, isAdmin ? 'admin' : 'vendor', vendorId]
      });
      // Clear the cache
      cachedAdsRef.current = {};
    },
    onError: (error) => {
      console.error('Error deleting advertisement image:', error);
      toast.error('Failed to delete image. Please try again.');
    }
  });

  // Function to fetch a specific advertisement by vendor and ad ID if it's not in the cache
  // This is a fallback method that should be used only when necessary
  const fetchAdvertisementById = async (
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
      await queryClient.fetchQuery({
        queryKey: [QUERY_KEY, isAdmin ? 'admin' : 'vendor', vendorId]
      });

      // Clear the cache after fetching new data
      cachedAdsRef.current = {};

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
    ads: cachedData,
    isLoading: query.isLoading,
    isError: query.isError,
    getAdvertisementsByVendorId,
    topBannerAds,
    leftBannerAds,
    rightBannerAds,
    getAdsByPosition,
    getActiveAdvertisements,
    getAdvertisementById,
    // Direct fetch methods
    fetchAdvertisementById,

    // Mutations
    updateAdvertisement,
    deleteAdvertisement,
    deleteAdvertisementImage
  };
};
