import React from 'react';
import { SealedProduct } from '@/types';
import ProductImage from './product-image';
import useGlobalStore from '@/stores/globalStore';
import { SEALED_DISCOUNT_MAP } from '@/lib/constants';
import { handleBuyClick } from '@/utils/analytics';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useSealedSearchStore } from '@/stores/useSealedSearchStore';
import { Button } from '../ui/button';

type Props = {
  product: SealedProduct;
};

const DiscountBadge = ({ product }: Props) => {
  if (product.discounted_price) {
    return (
      <div className="flex h-[18px] -skew-x-12 transform items-center rounded bg-primary/80 px-2 font-montserrat text-xs font-semibold leading-none text-white shadow-md">
        <span className="skew-x-12 transform">
          -{' '}
          {Math.floor(
            SEALED_DISCOUNT_MAP[product.discount_code as keyof typeof SEALED_DISCOUNT_MAP] *
              100
          )}
          %
        </span>
      </div>
    );
  }
  return null;
};

const SealedCatalogItem = ({ product }: Props) => {
  const { websites } = useGlobalStore();
  const { theme } = useTheme();
  const { productCategory } = useSealedSearchStore();
  
  const findWebsiteNameByCode = (slug: string) => {
    const website = websites.find((website) => website.slug === slug);
    return website ? website.name : 'Website not found';
  };

  const handleClick = () => {
    handleBuyClick(
      product.link,
      product.price,
      product.name,
      product.set,
      product.promoted ?? false,
      productCategory
    );
    window.open(product.link, '_blank');
  };

  return (
    <div className="flex flex-col bg-popover font-montserrat">
      <div
        className={`group flex h-full flex-col rounded-t-lg border border-accent bg-popover p-4`}
      >
        <div 
          className="relative bg-white cursor-pointer hover:opacity-90 transition-opacity"
          onClick={handleClick}
        >
          {product.promoted && (
            <div className="absolute -left-1 -top-1 z-10 flex h-[18px] -skew-x-12 transform items-center rounded bg-primary/90 px-2 font-montserrat text-xs font-semibold leading-none text-white shadow-md">
              <span className="skew-x-12 transform">Promoted</span>
            </div>
          )}
          <div className="mx-auto h-min max-w-[150px] md:max-w-[250px]">
            <ProductImage imageUrl={product.image} alt={product.name} />
          </div>
        </div>

        <div>
          <div className="mt-3 flex flex-grow flex-col text-center md:text-left">
            <h3 
              onClick={handleClick}
              className="overflow-hidden text-ellipsis text-[0.9rem] font-semibold capitalize tracking-tight cursor-pointer"
            >{product.name}</h3>
            <div 
              className="mb-2 mt-1 flex flex-col md:flex-row items-center justify-center w-full md:justify-start gap-1 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleClick}
            >
            <div className="md:hidden text-xs">
              {findWebsiteNameByCode(product.vendor)}
            </div>
              {(() => {
                const matchingWebsite = websites.find(
                  (website) => product.vendor === website.slug
                );
                return matchingWebsite?.meta?.branding?.icons ? (
                  <img
                    src={
                      theme === 'dark'
                        ? matchingWebsite.meta.branding.icons.dark
                        : matchingWebsite.meta.branding.icons.light
                    }
                    alt="Website"
                    className="h-4 w-4"
                  />
                ) : null;
              })()}
                   <div className="hidden md:block text-xs ml-1">
              {findWebsiteNameByCode(product.vendor)}
            </div>

            </div>
            <div className="mt-3">
              <div 
                className="flex flex-row items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity justify-center md:justify-start"
                onClick={handleClick}
              >
                <h4 className="font-montserrat text-2xl font-semibold flex items-start">
                  <span className="text-sm mt-1">$</span>{(() => {
                    const price = Number(
                      product.discounted_price && SEALED_DISCOUNT_MAP[product.discount_code as keyof typeof SEALED_DISCOUNT_MAP] 
                        ? product.discounted_price 
                        : product.price
                    ).toFixed(2);
                    const [dollars, cents] = price.split('.');
                    return (
                      <div className="flex items-start">
                        <span className="text-3xl">{dollars}</span>
                        <span className="text-sm mt-1">{cents}</span>
                      </div>
                    );
                  })()}
                </h4>
                {product.discount_code && SEALED_DISCOUNT_MAP[product.discount_code as keyof typeof SEALED_DISCOUNT_MAP] && (
                  <DiscountBadge product={product} />
                )}
              </div>
              {product.discount_code && SEALED_DISCOUNT_MAP[product.discount_code as keyof typeof SEALED_DISCOUNT_MAP] && (
                <div
                  className="-mt-0.5 flex w-full text-[0.8rem]"
                  key={product.vendor}
                >
                  <div className="text-center md:text-left font-montserrat tracking-tighter text-muted-foreground w-full">
                    With code:<br/>
                    <span className="font-bold break-all">{product.discount_code}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <Link
        href={product.link}
        target="_blank"
        rel="noreferrer"
        className="sm:hidden w-full mt-4"
      >
        <Button
          className="w-full font-montserrat text-xs uppercase"
          variant="default"
          onClick={handleClick}
        >
          Buy
        </Button>
      </Link>
      </div>
  
    </div>
  );
};

export default SealedCatalogItem;
