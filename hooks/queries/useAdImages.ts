import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useRef } from 'react';
import { toast } from 'sonner';

import type {
  UpdateAdvertisementImageRequest
} from '@/services/advertisementService';
import {
  advertisementService
} from '@/services/advertisementService';
import type { AdvertisementImage } from '@/types/advertisements';


export const QUERY_KEY = 'advertisementImages';

const fetchAdImages = async (): Promise<AdvertisementImage[]> => {
  try {
    const response = await advertisementService.getAllAdImages();
    return response;
  } catch (error) {
    console.error('Error fetching advertisements:', error);
    throw error;
  }
};

export const useAdImages = () => {
  const queryClient = useQueryClient();
  const cachedAdsRef = useRef<{ [key: string]: any }>({});

  // Query for fetching all advertisements
  const query = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: fetchAdImages,
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false
  });

  // Memoize and cache query results to prevent unnecessary filtering on window resize
  const cachedData = useMemo(() => query.data || [], [query.data]);

  // Mutation for updating an advertisement
  const updateAdvertisementImage = useMutation({
    mutationFn: ({
      id,
      data
    }: {
      id: number;
      data: UpdateAdvertisementImageRequest;
    }) => advertisementService.updateAdvertisementImage(id, data),
    onSuccess: () => {
      toast.success('Advertisement updated successfully');
      // Invalidate the appropriate query based on vendorId
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      // Clear the cache
      cachedAdsRef.current = {};
    },
    onError: (error) => {
      console.error('Error updating advertisement:', error);
      toast.error('Failed to update advertisement. Please try again.');
    }
  });

  return {
    // Query data
    adImages: cachedData,
    isLoading: query.isLoading,
    isError: query.isError,

    updateAdvertisementImage
  };
};
