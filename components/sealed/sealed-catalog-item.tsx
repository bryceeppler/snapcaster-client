import React from 'react';
import { SealedProduct } from '@/types';
import ProductImage from './product-image';
import { SEALED_DISCOUNT_MAP } from '@/lib/constants';
import { handleBuyClick } from '@/utils/analytics';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useSealedSearchStore } from '@/stores/useSealedSearchStore';
import { Button } from '../ui/button';
import { VendorAssetTheme } from '@/services/vendorService';
import { VendorAssetType } from '@/services/vendorService';
import { useVendors } from '@/hooks/queries/useVendors';

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
            SEALED_DISCOUNT_MAP[
              product.discount_code as keyof typeof SEALED_DISCOUNT_MAP
            ] * 100
          )}
          %
        </span>
      </div>
    );
  }
  return null;
};

const SealedCatalogItem = ({ product }: Props) => {
  const { getVendorNameBySlug, getVendorBySlug } = useVendors();
  const { theme } = useTheme();
  const { productCategory } = useSealedSearchStore();

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
          className="relative cursor-pointer bg-white transition-opacity hover:opacity-90"
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
              className="cursor-pointer overflow-hidden text-ellipsis text-[0.9rem] font-semibold capitalize tracking-tight"
            >
              {product.name}
            </h3>
            <div
              className="mb-2 mt-1 flex w-full cursor-pointer flex-col items-center justify-center gap-1 transition-opacity hover:opacity-80 md:flex-row md:justify-start"
              onClick={handleClick}
            >
              <div className="text-xs md:hidden">
                {getVendorNameBySlug(product.vendor)}
              </div>
              {(() => {
                const matchingVendor = getVendorBySlug(product.vendor);
                const matchingVendorIcon = matchingVendor?.assets.find(
                  (asset) =>
                    asset.asset_type === VendorAssetType.ICON &&
                    (asset.theme === theme ||
                      asset.theme === VendorAssetTheme.UNIVERSAL)
                );
                return matchingVendorIcon ? (
                  <img
                    src={matchingVendorIcon.url}
                    alt={getVendorNameBySlug(product.vendor)}
                    className="h-4 w-4"
                  />
                ) : null;
              })()}
              <div className="ml-1 hidden text-xs md:block">
                {getVendorNameBySlug(product.vendor)}
              </div>
            </div>
            <div className="mt-3">
              <div
                className="flex cursor-pointer flex-row items-center justify-center gap-2 transition-opacity hover:opacity-80 md:justify-start"
                onClick={handleClick}
              >
                <h4 className="flex items-start font-montserrat text-2xl font-semibold">
                  <span className="mt-1 text-sm">$</span>
                  {(() => {
                    const price = Number(
                      product.discounted_price &&
                        SEALED_DISCOUNT_MAP[
                          product.discount_code as keyof typeof SEALED_DISCOUNT_MAP
                        ]
                        ? product.discounted_price
                        : product.price
                    ).toFixed(2);
                    const [dollars, cents] = price.split('.');
                    return (
                      <div className="flex items-start">
                        <span className="text-3xl">{dollars}</span>
                        <span className="mt-1 text-sm">{cents}</span>
                      </div>
                    );
                  })()}
                </h4>
                {product.discount_code &&
                  SEALED_DISCOUNT_MAP[
                    product.discount_code as keyof typeof SEALED_DISCOUNT_MAP
                  ] && <DiscountBadge product={product} />}
              </div>
              {product.discount_code &&
                SEALED_DISCOUNT_MAP[
                  product.discount_code as keyof typeof SEALED_DISCOUNT_MAP
                ] && (
                  <div
                    className="-mt-0.5 flex w-full text-[0.8rem]"
                    key={product.vendor}
                  >
                    <div className="w-full text-center font-montserrat tracking-tighter text-muted-foreground md:text-left">
                      With code:
                      <br />
                      <span className="break-all font-bold">
                        {product.discount_code}
                      </span>
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
          className="mt-4 w-full sm:hidden"
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
