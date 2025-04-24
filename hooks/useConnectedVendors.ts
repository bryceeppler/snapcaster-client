import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/userService';

export function useConnectedVendors() {
  return useQuery<string[]>({
    queryKey: ['connectedVendors'],
    queryFn: () => userService.getConnectedVendors()
  });
}
