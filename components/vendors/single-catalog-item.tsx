import React from 'react';

import { handleBuyClick } from '../../utils/analytics';
import { Badge } from '../ui/badge';
import CardImage from '../ui/card-image';

import { Button } from '@/components/ui/button';
import { useSingleSearchStore } from '@/stores/useSingleSearchStore';
import type { SingleCatalogCard } from '@/types';

type Props = {
  product: SingleCatalogCard;
  storeLogo: boolean;
};

const DiscountBadge = ({ product }: { product: SingleCatalogCard }) => {
  if (product.discounted_price) {
    return (
      <div className="flex h-[18px] -skew-x-12 transform items-center rounded bg-primary/80 px-2 font-montserrat text-xs font-semibold leading-none text-white shadow-md">
        <span className="skew-x-12 transform">- {Math.floor(0.1 * 100)}%</span>
      </div>
    );
  }
  return null;
};

const SingleCatalogItem = ({ product, storeLogo = true }: Props) => {
  const { resultsTcg } = useSingleSearchStore();

  return (
    <div className="flex flex-col bg-popover font-montserrat">
      <div className={`group flex h-full flex-col rounded-t-lg bg-popover p-4`}>
        <div className="relative mx-auto h-min max-w-[150px] md:max-w-[250px]">
          <CardImage imageUrl={product.image} alt={product.name} />
        </div>

        <div>
          <div className="mt-3">
            <div className="flex flex-row items-center gap-2">
              <h4 className="font-montserrat text-2xl font-semibold">
                ${Number(product.discounted_price || product.price).toFixed(2)}
              </h4>
              <DiscountBadge product={product} />
            </div>
            {product.discount_code && (
              <div
                className="-mt-0.5 flex w-full text-[0.65rem]"
                key={product.vendor}
              >
                <div className="text-left font-montserrat tracking-tighter text-muted-foreground">
                  With code:{' '}
                  <span className="break-all font-bold">
                    {product.discount_code}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="mt-3 flex flex-grow flex-col text-left">
            <div className="text-primary-light font-montserrat text-[0.65rem]  font-semibold uppercase">
              {product.set}
            </div>

            <h3 className="overflow-hidden text-ellipsis text-[0.9rem] font-semibold capitalize tracking-tight">{`${
              product.name
            } ${
              product.collector_number ? `(${product.collector_number})` : ''
            }`}</h3>

            <h4 className="text-[0.65rem]   uppercase tracking-tighter text-muted-foreground">{` ${
              product.frame ? product.frame : ''
            }  ${
              product.finish !== 'foil' && product.finish != null
                ? product.finish
                : ''
            } ${product.showcase ? product.showcase : ''} ${
              product.alternate_art ? product.alternate_art : ''
            } ${product.promo ? product.promo : ''} ${
              product.art_series ? product.art_series : ''
            }`}</h4>
            <div className=" mb-2 mt-3 flex flex-row gap-1">
              {storeLogo && (
                <img src={'/logo.png'} alt="Website" className="h-4 w-4" />
              )}

              <div className="text-xs">{product.vendor}</div>
            </div>
            <Badge
              className={` mt-2 w-min border-2 border-muted-foreground text-white ${
                product.finish ? 'bg-foil bg-cover bg-center' : 'bg-slate-700'
              }`}
            >
              {product.condition}
            </Badge>
          </div>
        </div>
      </div>

      <Button
        className="w-full rounded-b-lg border-border bg-popover font-montserrat text-xs uppercase"
        variant="outline"
        onClick={() =>
          handleBuyClick(
            product.link,
            product.price,
            product.name,
            product.set,
            product.promoted ?? false,
            resultsTcg
          )
        }
      >
        Buy
      </Button>
    </div>
  );
};

export default SingleCatalogItem;
