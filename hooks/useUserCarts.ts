//hooks and store states
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useAuth } from '@/hooks/useAuth';
import useBuyListStore from '@/stores/useBuylistStore';
import type { IBuylistCart } from '@/stores/useBuylistStore';
//other
import axiosInstance from '@/utils/axiosWrapper';


const CARTS_QUERY_KEY = ['userCarts'] as const;

export function useUserCarts() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const { setCurrentCartId, setCurrentCart } = useBuyListStore();

  const {
    data: carts,
    isLoading,
    error
  } = useQuery<IBuylistCart[]>({
    queryKey: CARTS_QUERY_KEY,
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(
          `${process.env.NEXT_PUBLIC_BUYLISTS_URL}/v2/carts`
        );
        if (response.status === 200) {
          return response.data.carts;
        }
        throw new Error('Failed to fetch carts');
      } catch (error: any) {
        toast.error('Error fetching carts: ' + error.message);
        throw error;
      }
    },
    staleTime: 30000,
    enabled: isAuthenticated
  });

  const createCartMutation = useMutation({
    mutationFn: async (cartName: string) => {
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_BUYLISTS_URL}/v2/carts`,
        { cartName }
      );
      if (response.status !== 201) {
        throw new Error('Failed to create cart');
      }
      return { ...response.data, cartName };
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message);
        await queryClient.invalidateQueries({ queryKey: CARTS_QUERY_KEY });

        const response = await axiosInstance.get(
          `${process.env.NEXT_PUBLIC_BUYLISTS_URL}/v2/carts`
        );

        const newCart = response.data.carts.find(
          (cart: IBuylistCart) => cart.name === data.cartName
        );

        if (newCart) {
          setCurrentCartId(newCart.id);
          setCurrentCart(newCart);
        }
      } else {
        toast.error('Failed to create cart');
      }
    },
    onError: (error: any) => {
      toast.error('Error creating cart: ' + error.message);
    }
  });

  const deleteCartMutation = useMutation({
    mutationFn: async (cartId: number) => {
      await axiosInstance.delete(
        `${process.env.NEXT_PUBLIC_BUYLISTS_URL}/v2/carts/${cartId}`
      );
    },
    onSuccess: () => {
      toast.success('List deleted successfully');
      queryClient.invalidateQueries({ queryKey: CARTS_QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error('Error deleting cart: ' + error.message);
    }
  });

  const renameCartMutation = useMutation({
    mutationFn: async ({ id, name }: IBuylistCart) => {
      const response = await axiosInstance.patch(
        `${process.env.NEXT_PUBLIC_BUYLISTS_URL}/v2/carts/${id}`,
        { cartName: name.trim() }
      );
      return { success: true, message: response.data.message, id };
    },
    onSuccess: (data) => {
      toast.success('Cart renamed successfully');
      queryClient.invalidateQueries({ queryKey: CARTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['cart', data.id] });
      return true;
    },
    onError: (error: any) => {
      toast.error(
        'Error renaming cart: ' + error.response?.data?.message || error.message
      );
      return false;
    }
  });

  const getCurrentCart = () => {
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

  return {
    carts,
    isLoading,
    error,
    createCart: createCartMutation.mutate,
    deleteCart: deleteCartMutation.mutate,
    renameCartMutation,
    isCreating: createCartMutation.isPending,
    isDeleting: deleteCartMutation.isPending,
    isRenaming: renameCartMutation.isPending,
    getCurrentCart: getCurrentCart
  };
}
