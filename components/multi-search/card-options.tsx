import React from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

import useGlobalStore from '@/stores/globalStore';
import useMultiSearchStore from '@/stores/multiSearchStore';
import { Product } from '@/types';

import { Button } from '@/components/ui/button';

const CardOption = ({ product }: { product: Product }) => {
  const { getWebsiteName } = useGlobalStore();
  const { addToCart, isInCart, removeFromCart } = useMultiSearchStore();
  return (
    <div className="flex flex-row">
      <img src={product.image} alt={product.name} className="h-auto w-16" />
      <div className="ml-2 flex flex-col text-left">
        <div className="text-sm font-bold">
          {getWebsiteName(product.vendor)}
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
          }}
        >
          <Trash2 />
        </Button>
      ) : (
        <Button
          onClick={() => {
            addToCart(product);
          }}
        >
          Add to Cart
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
    <ScrollArea className="h-[400px] w-full">
      <div className="mt-2 flex w-full flex-col gap-4 text-left">
        <div className="text-sm text-muted-foreground">Results for {name}</div>
        {results?.map((product, index) => {
          return <CardOption product={product} key={index} />;
        })}
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
};
