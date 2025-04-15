import axios from 'axios';
import { AdvertisementWithImages } from '@/types/advertisements';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class AdvertisementService {
  async getAllAdvertisements(): Promise<AdvertisementWithImages[]> {
    const response = await axios.get(
      `${BASE_URL}/api/v1/vendor/advertisements?with=images&is_active=true`
    );
    return response.data.data || ([] as AdvertisementWithImages[]);
  }
}

export const advertisementService = new AdvertisementService();
