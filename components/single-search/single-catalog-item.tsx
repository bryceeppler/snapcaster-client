import React from 'react';
import { SingleCatalogCard } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '../ui/badge';
import CardImage from '../ui/card-image';
import { useSingleSearchStore } from '@/stores/useSingleSearchStore';
import { handleBuyClick } from '../../utils/analytics';
import { useTheme } from 'next-themes';
import { VendorAssetType, VendorAssetTheme } from '@/services/vendorService';
import { useVendors } from '@/hooks/queries/useVendors';
import { useDiscounts } from '@/hooks/queries/useDiscounts';
import { Discount } from '@/types/discounts';
type Props = {
  product: SingleCatalogCard;
  discount: Discount | undefined;
};

const DiscountBadge = ({ product, discount }: Props) => {
  if (product.discounted_price) {
    return (
      <div className="flex h-[18px] -skew-x-12 transform items-center rounded bg-primary/80 px-2 font-montserrat text-xs font-semibold leading-none text-white shadow-md">
        <span className="skew-x-12 transform">
          - {Math.round(discount?.discount_amount || 0)}%
        </span>
      </div>
    );
  }
  return null;
};

const SingleCatalogItem = ({ product }: Props) => {
  const { vendors } = useVendors();
  const { getLargestActiveDiscountByVendorSlug } = useDiscounts();
  const { resultsTcg } = useSingleSearchStore();
  const { theme } = useTheme();
  const findVendorNameByCode = (slug: string) => {
    const vendor = vendors.find((vendor) => vendor.slug === slug);
    return vendor ? vendor.name : 'Vendor not found';
  };

  return (
    <div className="flex flex-col rounded-lg bg-popover font-montserrat">
      <div
        className={`group flex h-full flex-col rounded-lg border border-accent bg-popover p-4`}
      >
        <div className="relative mx-auto h-min max-w-[150px] md:max-w-[250px]">
          <CardImage imageUrl={product.image} alt={product.name} />
          {product.promoted && (
            <div className="absolute -left-1 -top-1 flex h-[18px] -skew-x-12 transform items-center rounded bg-primary/90 px-2 font-montserrat text-xs font-semibold leading-none text-white shadow-md">
              <span className="skew-x-12 transform">Promoted</span>
            </div>
          )}
        </div>

        <div>
          <div className="mt-3">
            <div className="flex flex-row items-center gap-2">
              <h4 className="font-montserrat text-2xl font-semibold">
                ${Number(product.discounted_price || product.price).toFixed(2)}
              </h4>
              <DiscountBadge
                product={product}
                discount={getLargestActiveDiscountByVendorSlug(product.vendor)}
              />
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
              {(() => {
                const matchingVendor = vendors.find(
                  (vendor) => product.vendor === vendor.slug
                );
                const matchingVendorIcon = matchingVendor?.assets.find(
                  (asset) =>
                    asset.asset_type === VendorAssetType.ICON &&
                    (asset.theme === theme ||
                      asset.theme === VendorAssetTheme.UNIVERSAL)
                );
                return matchingVendorIcon ? (
                  <img
                    src={matchingVendorIcon.url}
                    alt="Vendor"
                    className="h-4 w-4"
                  />
                ) : null;
              })()}

              <div className="text-xs">
                {findVendorNameByCode(product.vendor)}
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
      </div>
      <Link
        href={product.link}
        target="_blank"
        rel="noreferrer"
        className="w-full px-4 pb-4"
      >
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
      </Link>
    </div>
  );
};

export default SingleCatalogItem;
