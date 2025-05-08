import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { IBuylistCartItem, IBuylistCart } from '@/stores/useBuylistStore';
import axiosInstance from '@/utils/axiosWrapper';

const CART_ITEMS_KEY = (cartId: number) => ['cartItems', cartId] as const;
const USER_CARTS_KEY = ['userCarts'] as const;
const CART_KEY = (cartId: number) => ['cart', cartId] as const;

export function useCartItems(cartId: number | undefined) {
  const queryClient = useQueryClient();

  const {
    data: cartItems,
    isLoading,
    error
  } = useQuery<IBuylistCartItem[]>({
    queryKey: CART_ITEMS_KEY(cartId || 0),
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
      cartId: number;
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
      await queryClient.cancelQueries({ queryKey: USER_CARTS_KEY });
      await queryClient.cancelQueries({ queryKey: CART_KEY(cartId) });

      // Snapshot the previous values
      const previousItems = queryClient.getQueryData<IBuylistCartItem[]>(
        CART_ITEMS_KEY(cartId)
      );
      const previousCarts = queryClient.getQueryData(USER_CARTS_KEY);
      const previousCart = queryClient.getQueryData<{
        success: boolean;
        cart: IBuylistCart;
      }>(CART_KEY(cartId));

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

      // Optimistically update the cart query
      if (previousCart) {
        queryClient.setQueryData<{ success: boolean; cart: IBuylistCart }>(
          CART_KEY(cartId),
          {
            success: true,
            cart: {
              ...previousCart.cart,
              items: previousCart.cart.items.map((cartItem) => {
                if (
                  cartItem.card_name === item.card_name &&
                  cartItem.condition_name === item.condition_name &&
                  cartItem.set_name === item.set_name &&
                  cartItem.foil === item.foil &&
                  cartItem.rarity === item.rarity
                ) {
                  return { ...cartItem, quantity };
                }
                return cartItem;
              })
            }
          }
        );
      }

      // Optimistically update the user carts
      queryClient.setQueryData(USER_CARTS_KEY, (old: any) => {
        if (!old) return old;
        return old.map((cart: any) => {
          if (cart.id !== cartId) return cart;

          // Update the total quantity for the cart
          let updatedItems = cart.items.map((cartItem: IBuylistCartItem) => {
            if (
              cartItem.card_name === item.card_name &&
              cartItem.condition_name === item.condition_name &&
              cartItem.set_name === item.set_name &&
              cartItem.foil === item.foil &&
              cartItem.rarity === item.rarity
            ) {
              return { ...cartItem, quantity };
            }
            return cartItem;
          });

          if (quantity === 0) {
            updatedItems = updatedItems.filter(
              (cartItem: IBuylistCartItem) =>
                !(
                  cartItem.card_name === item.card_name &&
                  cartItem.condition_name === item.condition_name &&
                  cartItem.set_name === item.set_name &&
                  cartItem.foil === item.foil &&
                  cartItem.rarity === item.rarity
                )
            );
          }

          return {
            ...cart,
            items: updatedItems,
            total_quantity: updatedItems.reduce(
              (acc: number, item: IBuylistCartItem) => acc + item.quantity,
              0
            )
          };
        });
      });

      return { previousItems, previousCarts, previousCart };
    },
    onError: (err, { cartId }, context) => {
      // Revert all optimistic updates on error
      if (context?.previousItems) {
        queryClient.setQueryData(CART_ITEMS_KEY(cartId), context.previousItems);
      }
      if (context?.previousCarts) {
        queryClient.setQueryData(USER_CARTS_KEY, context.previousCarts);
      }
      if (context?.previousCart) {
        queryClient.setQueryData(CART_KEY(cartId), context.previousCart);
      }
      toast.error('Error updating cart item: ' + err.message);
    },
    onSettled: (_, __, { cartId }) => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: CART_ITEMS_KEY(cartId) });
      queryClient.invalidateQueries({ queryKey: USER_CARTS_KEY });
      queryClient.invalidateQueries({ queryKey: CART_KEY(cartId) });
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
