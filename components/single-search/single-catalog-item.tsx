import React from 'react';
import { SingleCatalogCard } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '../ui/badge';
import CardImage from '../ui/card-image';
import useGlobalStore from '@/stores/globalStore';
import { useSingleSearchStore } from '@/stores/useSingleSearchStore';
import { handleBuyClick } from '../../utils/analytics';

type Props = {
  product: SingleCatalogCard;
};
const SingleCatalogItem = ({ product }: Props) => {
  const { websites } = useGlobalStore();
  const { resultsTcg } = useSingleSearchStore();
  const findWebsiteNameByCode = (slug: string) => {
    const website = websites.find((website) => website.slug === slug);
    return website ? website.name : 'Website not found';
  };

  return (
    <div className="flex flex-col ">
      <div
        className={`group flex h-full flex-col rounded-t-lg border border-accent bg-popover  ${
          product.promoted ? 'bg-primary/10 p-4' : 'p-4'
        }`}
      >
        <div className="relative mx-auto h-min max-w-[150px] px-4 md:max-w-[250px]">
          <CardImage imageUrl={product.image} alt={product.name} />
          {product.promoted && (
            <Badge className="absolute -left-2 -top-2 bg-gradient-to-tr from-primary to-red-700 shadow">
              Promoted
            </Badge>
          )}
        </div>

        <div className="mt-3">
          <div className="   flex flex-row justify-between">
            <h4 className="text-xl font-semibold">
              ${Number(product.discounted_price || product.price).toFixed(2)}
            </h4>
          </div>
          {product.discount_code && (
            <div className=" flex w-full text-[0.65rem]" key={product.vendor}>
              <div className="text-left  tracking-tighter text-muted-foreground">
                With code:{' '}
                <span className=" font-bold">{product.discount_code}</span>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-grow flex-col   text-left">
          <div className="text-[0.78rem] font-semibold uppercase  text-primary">
            {product.set}
          </div>

          <h3 className="text-[0.9rem] font-semibold capitalize tracking-tight">{`${
            product.name
          } ${
            product.collector_number ? `(${product.collector_number})` : ''
          }`}</h3>

          <h4 className="text-xs  font-semibold capitalize tracking-tight text-muted-foreground">{` ${
            product.frame ? product.frame : ''
          }  ${
            product.foil !== 'foil' && product.foil != null ? product.foil : ''
          } ${product.showcase ? product.showcase : ''} ${
            product.alternate_art ? product.alternate_art : ''
          } ${product.promo ? product.promo : ''} ${
            product.art_series ? product.art_series : ''
          }`}</h4>

          <div className="flex flex-row gap-1 pt-1">
            {(() => {
              const matchingWebsite = websites.find(
                (website) => product.vendor === website.slug && website.imageUrl
              );
              return matchingWebsite ? (
                <img
                  src={matchingWebsite.imageUrl}
                  alt="Website"
                  className="h-4 w-4"
                />
              ) : null;
            })()}

            <div className="text-xs">
              {findWebsiteNameByCode(product.vendor)}
            </div>
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
      <Link
        href={product.link}
        target="_blank"
        rel="noreferrer"
        className="w-full"
      >
        <Button
          className="w-full rounded-b-lg rounded-t-none"
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
      </Link>
    </div>
  );
};

export default SingleCatalogItem;
