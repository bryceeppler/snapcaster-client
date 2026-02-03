import { ExternalLink } from 'lucide-react';
import { useTheme } from 'next-themes';

import { handleBuyClick } from '../../utils/analytics';
import CardImage from '../ui/card-image';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

  // Build cart permalink URL (for Add to Cart button)
  const buildCartUrl = () => {
    if (product.platform === 'shopify') {
      const discount = getLargestActiveDiscountByVendorSlug(product.vendor);
      const builder = createShopifyUrlBuilder(product.link)
        .setCart([
          {
            variantId: product.variant_id ? String(product.variant_id) : '',
            quantity: 1
          }
        ])
        .setStorefront(true)
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
  };

  // Build product page URL (for external link icon)
  const buildProductPageUrl = () => {
    if (product.platform === 'shopify') {
      const discount = getLargestActiveDiscountByVendorSlug(product.vendor);
      const builder = createShopifyUrlBuilder(product.link)
        .setProduct(
          product.handle,
          product.variant_id ? String(product.variant_id) : undefined
        )
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
  };

  // Handle Add to Cart button click (cart permalink)
  const handleAddToCartClick = () => {
    const url = buildCartUrl();
    handleBuyClick(
      url,
      product.price,
      product.name,
      product.set,
      product.promoted ?? false,
      resultsTcg,
      'singles'
    );
    window.open(url, '_blank', 'noreferrer');
  };

  // Handle external link icon click (product page)
  const handleProductPageClick = () => {
    const url = buildProductPageUrl();
    handleBuyClick(
      url,
      product.price,
      product.name,
      product.set,
      product.promoted ?? false,
      resultsTcg,
      'singles'
    );
    window.open(url, '_blank', 'noreferrer');
  };

  return (
    <Card className="group flex flex-col overflow-visible p-4">
      <CardContent className="group flex h-full flex-col rounded-lg p-0">
        <div className="relative mx-auto w-full max-w-[150px] md:max-w-[250px]">
          <div className="aspect-[3/4] rounded-lg">
            <CardImage
              imageUrl={product.image}
              alt={product.name}
              className="transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </div>
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

            <div className="overflow-hidden text-ellipsis text-[0.8rem] font-semibold capitalize leading-tight">
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
      </CardContent>
      <div className="flex w-full gap-2">
        <Button
          className="flex-1 border font-montserrat text-xs uppercase text-primary-foreground"
          onClick={handleAddToCartClick}
        >
          <div className="flex flex-col items-center justify-center">
            <span className="text-xs font-semibold">Add to Cart</span>
            <span className="text-[0.65rem]">
              {product.quantity ? `Stock: ${product.quantity}` : ''}
            </span>
          </div>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-auto border"
          onClick={handleProductPageClick}
          title="View product page"
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default SingleCatalogItem;
