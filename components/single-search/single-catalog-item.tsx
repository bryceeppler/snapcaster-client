import Link from 'next/link';

import { useTheme } from 'next-themes';

import { handleBuyClick } from '../../utils/analytics';
import { Badge } from '../ui/badge';
import CardImage from '../ui/card-image';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useDiscounts } from '@/hooks/queries/useDiscounts';
import { useVendors } from '@/hooks/queries/useVendors';
import { VendorAssetTheme, VendorAssetType } from '@/services/vendorService';
import { useSingleSearchStore } from '@/stores/useSingleSearchStore';
import type { SingleCatalogCard } from '@/types';
import type { Discount } from '@/types/discounts';
type DiscountBadgeProps = {
  product: SingleCatalogCard;
  discount: Discount | undefined;
};

type Props = {
  product: SingleCatalogCard;
};

const DiscountBadge = ({ product, discount }: DiscountBadgeProps) => {
  if (product.discounted_price) {
    return (
      <div className="flex h-[18px] -skew-x-12 transform items-center rounded bg-primary/80 px-2 font-montserrat text-xs font-semibold leading-none text-white shadow-md">
        <span className="skew-x-12 transform">
          - {Math.round(discount?.discountAmount || 0)}%
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
    <Card className="flex flex-col">
      <div className={`group flex h-full flex-col rounded-lg p-4`}>
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
            {product.quantity && (
              <p className="text-xs">{product.quantity} in stock</p>
            )}

            <div className=" mb-2 mt-3 flex flex-row gap-1">
              {(() => {
                const matchingVendor = vendors.find(
                  (vendor) => product.vendor === vendor.slug
                );
                const matchingVendorIcon = matchingVendor?.assets.find(
                  (asset) =>
                    asset.assetType === VendorAssetType.ICON &&
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
              className={` mt-2 w-min ${
                product.finish ? 'bg-foil bg-cover bg-center' : ''
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
          className="w-full font-montserrat text-xs uppercase"
          variant="secondary"
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
    </Card>
  );
};

export default SingleCatalogItem;
