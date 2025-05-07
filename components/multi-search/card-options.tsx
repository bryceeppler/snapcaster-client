import React, { useEffect, useState } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Trash2, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

import useMultiSearchStore from '@/stores/multiSearchStore';
import { Product } from '@/types';
import { useVendors } from '@/hooks/queries/useVendors';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const CardOption = ({ product }: { product: Product }) => {
  const { getVendorNameBySlug } = useVendors();
  const useMediaQuery = (width: number): boolean => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth <= width);
      window.addEventListener('resize', handleResize);
      handleResize(); // Call once to set the initial value

      return () => window.removeEventListener('resize', handleResize);
    }, [width]);

    return isMobile;
  };
  const isMobile = useMediaQuery(768);

  const { addToCart, isInCart, removeFromCart } = useMultiSearchStore();
  return (
    <div className="flex flex-row">
      <img src={product.image} alt={product.name} className="h-auto w-16" />
      <div className="ml-2 flex flex-col text-left">
        <div className="text-sm font-bold">
          {getVendorNameBySlug(product.vendor)}
        </div>
        <div className="text-sm font-bold capitalize text-muted-foreground">
          {product.set}
        </div>
        <div className="flex flex-row gap-2 font-bold">
          <div>
            <Badge
              className={` w-12 justify-center border-2 border-muted-foreground text-white ${
                product.finish ? 'bg-foil bg-cover bg-center' : 'bg-slate-700'
              }`}
            >
              {product.condition}
            </Badge>
          </div>
          <div>${product.price.toFixed(2)}</div>{' '}
        </div>
      </div>
      <div className="flex-grow"></div>
      {isInCart(product) ? (
        <Button
          onClick={() => {
            removeFromCart(product);
            toast.success('Removed from cart');
          }}
          variant="ghost"
          className="p-2"
        >
          <Trash2 />
        </Button>
      ) : (
        <Button
          onClick={() => {
            addToCart(product);
            toast.success('Added to cart');
          }}
          variant="ghost"
          className="p-2"
        >
          <PlusCircle />
        </Button>
      )}
    </div>
  );
};

export const CardOptions = ({
  results,
  name
}: {
  results: Product[];
  name: string;
}) => {
  return (
    <ScrollArea className="h-[400px] w-full px-4 pb-4">
      <div className="mt-2 flex w-full flex-col gap-4 text-left">
        {results?.map((product, index) => {
          return <CardOption product={product} key={index} />;
        })}
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
};
