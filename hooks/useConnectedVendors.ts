import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/userService';

export function useConnectedVendors() {
  return useQuery<number[]>({
    queryKey: ['connectedVendors'],
    queryFn: () => userService.getConnectedVendors()
  });
} 