import axiosInstance from '@/utils/axiosWrapper';
import { Advertisement, AdvertisementWithImages } from '@/types/advertisements';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class AdvertisementService {
  async getAllAdvertisements(): Promise<AdvertisementWithImages[]> {
    const response = await axiosInstance.get(
      `${BASE_URL}/api/v1/vendor/advertisements?with=images&is_active=true`
    );
    console.log(response.data.data);
    return response.data.data || ([] as AdvertisementWithImages[]);
  }
}

export const advertisementService = new AdvertisementService();
