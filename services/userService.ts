import axiosInstance from '@/utils/axiosWrapper';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class UserService {
  async getConnectedVendors(): Promise<string[]> {
    const response = await axiosInstance.get(
      `${BASE_URL}/api/v1/user/shopify/connections`,
      {
        withCredentials: true
      }
    );
    return response.data.data.connectedVendors;
  }
}

export const userService = new UserService();
