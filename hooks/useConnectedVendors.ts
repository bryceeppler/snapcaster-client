import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosWrapper';

export function useConnectedVendors() {
  return useQuery<number[]>({
    queryKey: ['connectedVendors'],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_USER_URL}/connections`
      );
      return response.data.connectedVendors;
    }
  });
} 