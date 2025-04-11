//hooks and store states
import useBuyListStore, { IBuylistCart } from '@/stores/useBuylistStore';
//components
import { CartItem } from './list-item';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
//icons
import { ArrowLeftIcon } from 'lucide-react';
//other
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosWrapper';

interface LeftCartEditWithViewOffersProps {
  closeMobileCartDialog?: () => void;
}

export const LeftCartEditWithViewOffers = ({
  closeMobileCartDialog
}: LeftCartEditWithViewOffersProps) => {
  const CART_KEY = (cartId: number) => ['cart', cartId] as const;

  const {
    leftUIState,
    setLeftUIState,
    currentCartId,
    setCurrentCartId,
    setCurrentCart
  } = useBuyListStore();

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
    <div className="col-span-1 flex h-[75vh] w-full flex-col space-y-1 rounded-lg border bg-card  md:w-80">
      <div className="hidden justify-between  px-1 md:flex">
        <div className="flex h-10 w-16 items-center justify-start gap-1">
          <span
            className="flex cursor-pointer gap-0.5 rounded-lg  px-1 py-1 font-medium underline"
            onClick={() => {
              setLeftUIState('leftCartListSelection');
              setCurrentCartId(null);
              setCurrentCart(null);
            }}
          >
            <p className="text-xs">My Lists</p>
          </span>
        </div>
        <div className="flex w-full flex-1 items-center gap-1 overflow-hidden text-center">
          <p className="w-full truncate text-sm font-semibold">
            {currentCart?.cart?.name} ss
          </p>
        </div>
        <div className="flex w-16 items-center justify-end gap-1 "></div>
      </div>
      <div className="flex-1 overflow-hidden ">
        <ScrollArea className="h-full" type="always">
          <div className="mr-1.5 space-y-1  px-1 ">
            {currentCart?.cart?.items?.map((item, index) => (
              <div key={index}>
                <CartItem item={item} />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className=" ">
        <Button
          className="w-full rounded-t-none"
          onClick={() => {
            setLeftUIState('leftCartEdit');
            closeMobileCartDialog?.();
          }}
        >
          View Offers
        </Button>
      </div>
    </div>
  );
};
