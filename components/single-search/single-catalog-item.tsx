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
import { createConductUrlBuilder } from '@/utils/urlBuilders/conductUrlBuilder';
import { createCrystalUrlBuilder } from '@/utils/urlBuilders/crystalUrlBuilder';
import { createShopifyUrlBuilder } from '@/utils/urlBuilders/shopifyUrlBuilder';
import { UtmPresets } from '@/utils/urlBuilders/urlBuilderInterfaces';

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
    <Card className="flex flex-col p-4">
      <div className={`group flex h-full flex-col rounded-lg`}>
        <div className="relative mx-auto h-min max-w-[150px] md:max-w-[250px]">
          <CardImage imageUrl={product.image} alt={product.name} />
          {product.promoted && (
            <div className="absolute -left-1 -top-1 flex h-[18px] -skew-x-12 transform items-center rounded bg-primary/90 px-2 font-montserrat text-xs font-semibold leading-none text-white shadow-md">
              <span className="skew-x-12 transform">Promoted</span>
            </div>
          )}
        </div>

        <div className="flex flex-grow flex-col py-2">
          <div className="">
            <div className="flex flex-row items-center gap-2">
              <h4 className="font-montserrat text-xl font-semibold">
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
          <div className="flex flex-grow flex-col gap-1 text-left">
            <div className="text-primary-light font-montserrat text-[0.65rem] font-semibold uppercase leading-tight">
              {product.set}
            </div>

            <div className="overflow-hidden text-ellipsis text-[0.75rem] font-semibold capitalize leading-tight">
              {product.name}
            </div>

            <div className="flex flex-wrap items-center gap-1 text-[0.65rem] font-medium capitalize text-primary">
              {product.condition && (
                <div className="rounded bg-primary/10 px-1.5 py-0.5">
                  {product.condition}
                </div>
              )}
              {product.printing && (
                <div className="rounded bg-primary/10 px-1.5 py-0.5">
                  {product.printing}
                </div>
              )}
              {product.collector_number && (
                <div className="rounded bg-primary/10 px-1.5 py-0.5">
                  {product.collector_number}
                </div>
              )}
            </div>
            <div className="mt-auto flex flex-row gap-1">
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
          </div>
        </div>
      </div>
      <div className="w-full">
        <Button
          className="w-full  font-montserrat text-xs uppercase"
          onClick={() => {
            const url = (() => {
              if (product.platform === 'shopify') {
                const discount = getLargestActiveDiscountByVendorSlug(
                  product.vendor
                );
                const builder = createShopifyUrlBuilder(product.link)
                  .setProduct(product.handle, product.variant_id)
                  .setUtmParams(UtmPresets.singles);
                if (discount?.code) {
                  builder.setDiscount(discount.code);
                }
                return builder.build();
              } else if (product.platform === 'crystal') {
                return createCrystalUrlBuilder(product.link)
                  .setUtmParams(UtmPresets.singles)
                  .build();
              } else {
                return createConductUrlBuilder(product.link)
                  .setUtmParams(UtmPresets.singles)
                  .build();
              }
            })();

            handleBuyClick(
              url,
              product.price,
              product.name,
              product.set,
              product.promoted ?? false,
              resultsTcg
            );
            window.open(url, '_blank', 'noreferrer');
          }}
        >
          <div className="flex flex-col items-center justify-center">
            <span className="text-xs font-semibold">Buy</span>
            <span className="text-[0.65rem]">
              {product.quantity ? `Stock: ${product.quantity}` : ''}
            </span>
          </div>
        </Button>
      </div>
    </Card>
  );
};

export default SingleCatalogItem;
