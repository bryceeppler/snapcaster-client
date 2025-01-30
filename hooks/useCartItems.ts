import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosWrapper';
import { IBuylistCartItem } from '@/stores/buyListStore';
import { toast } from 'sonner';

const CART_ITEMS_KEY = (cartId: string) => ['cartItems', cartId] as const;
const CARTS_QUERY_KEY = ['userCarts'] as const;

export function useCartItems(cartId: string | undefined) {
  const queryClient = useQueryClient();

  const {
    data: cartItems,
    isLoading,
    error
  } = useQuery<IBuylistCartItem[]>({
    queryKey: CART_ITEMS_KEY(cartId || ''),
    queryFn: async () => {
      if (!cartId) return [];
      try {
        const response = await axiosInstance.get(
          `${process.env.NEXT_PUBLIC_BUYLISTS_URL}/v2/carts/${cartId}/cards`
        );
        if (response.status === 200) {
          return response.data.items;
        }
        throw new Error('Failed to fetch cart items');
      } catch (error: any) {
        toast.error('Error fetching cart items: ' + error.message);
        throw error;
      }
    },
    enabled: !!cartId
  });

  const updateCartItemMutation = useMutation({
    mutationFn: async ({
      cartId,
      item,
      quantity
    }: {
      cartId: string;
      item: Partial<IBuylistCartItem>;
      quantity: number;
    }) => {
      const response = await axiosInstance.put(
        `${process.env.NEXT_PUBLIC_BUYLISTS_URL}/v2/carts/${cartId}/cards`,
        { ...item, quantity }
      );
      return response.data;
    },
    onMutate: async ({ cartId, item, quantity }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: CART_ITEMS_KEY(cartId) });
      await queryClient.cancelQueries({ queryKey: CARTS_QUERY_KEY });

      // Snapshot the previous values
      const previousItems = queryClient.getQueryData<IBuylistCartItem[]>(
        CART_ITEMS_KEY(cartId)
      );

      // Optimistically update the cart items
      queryClient.setQueryData<IBuylistCartItem[]>(
        CART_ITEMS_KEY(cartId),
        (old = []) => {
          if (quantity === 0) {
            return old.filter(
              (existingItem) =>
                !(
                  existingItem.card_name === item.card_name &&
                  existingItem.condition_name === item.condition_name &&
                  existingItem.set_name === item.set_name &&
                  existingItem.foil === item.foil &&
                  existingItem.rarity === item.rarity
                )
            );
          }

          const existingItemIndex = old.findIndex(
            (existingItem) =>
              existingItem.card_name === item.card_name &&
              existingItem.condition_name === item.condition_name &&
              existingItem.set_name === item.set_name &&
              existingItem.foil === item.foil &&
              existingItem.rarity === item.rarity
          );

          if (existingItemIndex === -1) {
            return [...old, { ...item, quantity } as IBuylistCartItem];
          }

          return old.map((existingItem, index) =>
            index === existingItemIndex
              ? { ...existingItem, quantity }
              : existingItem
          );
        }
      );

      return { previousItems };
    },
    onError: (err, { cartId }, context) => {
      // Revert to the previous value if there's an error
      if (context?.previousItems) {
        queryClient.setQueryData(CART_ITEMS_KEY(cartId), context.previousItems);
      }
      toast.error('Error updating cart item: ' + err.message);
    },
    onSettled: (_, __, { cartId }) => {
      // Invalidate both cart items and user carts queries
      queryClient.invalidateQueries({ queryKey: CART_ITEMS_KEY(cartId) });
      queryClient.invalidateQueries({ queryKey: CARTS_QUERY_KEY });
    }
  });

  return {
    cartItems,
    isLoading,
    error,
    updateCartItem: updateCartItemMutation.mutate,
    isUpdating: updateCartItemMutation.isPending
  };
} 