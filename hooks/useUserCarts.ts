import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosWrapper';
import { IBuylistCart } from '@/stores/buyListStore';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import useBuyListStore from '@/stores/buyListStore';

const CARTS_QUERY_KEY = ['userCarts'] as const;

export function useUserCarts() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const { setCurrentCartId } = useBuyListStore();

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
      toast.success('Cart deleted successfully');
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
      return response.data.message;
    },
    onSuccess: () => {
      toast.success('Cart renamed successfully');
      queryClient.invalidateQueries({ queryKey: CARTS_QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error('Error renaming cart: ' + error.response.data.message);
    }
  });

  return {
    carts,
    isLoading,
    error,
    createCart: createCartMutation.mutate,
    deleteCart: deleteCartMutation.mutate,
    renameCart: renameCartMutation.mutate,
    isCreating: createCartMutation.isPending,
    isDeleting: deleteCartMutation.isPending,
    isRenaming: renameCartMutation.isPending
  };
}
