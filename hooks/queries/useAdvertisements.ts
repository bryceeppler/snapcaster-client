import { useQuery } from '@tanstack/react-query';
import type {
  AdvertisementWithImages,
  Advertisement
} from '@/types/advertisements';
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

  const getFeedAds = (): AdvertisementWithImages[] => {
    return (
      query.data?.filter((ad) => ad.position === AdvertisementPosition.FEED) ||
      []
    );
  };

  const getRandomAd = (
    position: AdvertisementPosition
  ): AdvertisementWithImages | null => {
    const filteredAds =
      query.data?.filter((ad) => ad.position === position) || [];
    if (filteredAds.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * filteredAds.length);
    return filteredAds[randomIndex];
  };

  return {
    ...query,
    ads: query.data || [],
    getFeedAds,
    getRandomAd
  };
};
