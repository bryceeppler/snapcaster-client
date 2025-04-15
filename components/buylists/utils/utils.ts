import useBuyListStore, { IBuylistCart } from '@/stores/useBuylistStore';
import axiosInstance from '@/utils/axiosWrapper';
import { useQuery } from '@tanstack/react-query';

export const getCurrentCart = () => {
  const CART_KEY = (cartId: number) => ['cart', cartId] as const;
  const { currentCartId } = useBuyListStore();
  const { data: currentCart } = useQuery<{
    success: boolean;
    cart: IBuylistCart;
  } | null>({
    queryKey: CART_KEY(currentCartId || 0),
    queryFn: async () => {
      if (!currentCartId) return null;
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_BUYLISTS_URL}/v2/carts/${currentCartId}`
      );
      return response.data;
    },
    enabled: !!currentCartId
  });
  return currentCart;
};
