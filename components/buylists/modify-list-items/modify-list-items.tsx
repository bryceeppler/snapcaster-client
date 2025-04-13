//hooks and store states
import useBuyListStore, { IBuylistCart } from '@/stores/useBuylistStore';
//components
import { CartItem } from './list-item';
import { ScrollArea } from '@/components/ui/scroll-area';
//icons
//other
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosWrapper';
import { Separator } from '@/components/ui/separator';
import { CurrentListHeader } from '../header/header';

interface LeftCartEditWithViewOffersProps {
  closeMobileCartDialog?: () => void;
}

export const LeftCartEditWithViewOffers = ({
  closeMobileCartDialog
}: LeftCartEditWithViewOffersProps) => {
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

  return (
    <div className="col-span-1 flex h-[75vh] w-full flex-col space-y-1 rounded-lg bg-card  md:w-80">
      <div>
        <CurrentListHeader />
        <Separator className=" bg-background" />
      </div>

      <div className="flex-1 overflow-hidden rounded-lg bg-card">
        <ScrollArea className="h-full" type="always">
          <div className="mr-1.5 space-y-1  px-1 ">
            {currentCart?.cart?.items && currentCart.cart.items.length > 0 && (
              <Separator className="mb-2" />
            )}
            {currentCart?.cart?.items?.map((item, index) => (
              <div key={index}>
                <CartItem item={item} />
                <Separator className="mb-2" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
