import { useTheme } from 'next-themes';

import { Button } from '../ui/button';
import CardImage from '../ui/card-image';

import { Card, CardContent } from '@/components/ui/card';
import { useDiscounts } from '@/hooks/queries/useDiscounts';
import { useVendors } from '@/hooks/queries/useVendors';
import { VendorAssetTheme, VendorAssetType } from '@/services/vendorService';
import { useSealedSearchStore } from '@/stores/useSealedSearchStore';
import type { SealedProduct } from '@/types';
import { handleBuyClick } from '@/utils/analytics';
import { createConductUrlBuilder } from '@/utils/urlBuilders/conductUrlBuilder';
import { createCrystalUrlBuilder } from '@/utils/urlBuilders/crystalUrlBuilder';
import { createShopifyUrlBuilder } from '@/utils/urlBuilders/shopifyUrlBuilder';
import { UtmPresets } from '@/utils/urlBuilders/urlBuilderInterfaces';

type Props = {
  product: SealedProduct;
};

const SealedCatalogItem = ({ product }: Props) => {
  const { getVendorNameBySlug, getVendorBySlug } = useVendors();
  const { theme } = useTheme();
  const { productCategory } = useSealedSearchStore();
  const { getLargestActiveDiscountByVendorSlug } = useDiscounts();
  const handleClick = () => {
    const url = (() => {
      if (product.platform === 'shopify') {
        const builder = createShopifyUrlBuilder(product.link)
          .setProduct(product.handle, product.variant_id)
          .setUtmParams(UtmPresets.sealed);
        const discount = getLargestActiveDiscountByVendorSlug(product.vendor);
        if (discount?.code) {
          builder.setDiscount(discount.code);
        }
        return builder.build();
      } else if (product.platform === 'crystal') {
        return createCrystalUrlBuilder(product.link)
          .setUtmParams(UtmPresets.sealed)
          .build();
      } else {
        return createConductUrlBuilder(product.link)
          .setUtmParams(UtmPresets.sealed)
          .build();
      }
    })();

    handleBuyClick(
      url,
      product.price,
      product.name,
      product.set,
      product.promoted ?? false,
      productCategory
    );
    window.open(url, '_blank');
  };

  return (
    <Card className="group flex flex-col overflow-visible p-4">
      <CardContent className="group flex h-full flex-col rounded-lg p-0">
        <div className="relative mx-auto w-full max-w-[150px] md:max-w-[250px]">
          <div className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-lg">
            <CardImage
              imageUrl={product.image}
              alt={product.name}
              className="transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </div>
        </div>
        <div className="flex flex-grow flex-col py-2">
          <div className="">
            <div className="flex flex-row items-center gap-2">
              <h4 className="font-montserrat text-xl font-semibold">
                ${product.price.toFixed(2)}
              </h4>
            </div>
          </div>
          <div className="flex flex-grow flex-col gap-1 text-left">
            <div className="overflow-hidden text-ellipsis text-[0.8rem] font-semibold capitalize leading-tight">
              {product.name}
            </div>
            <div className="flex flex-wrap items-center gap-1 text-[0.65rem] font-medium capitalize text-primary">
              {product.tags &&
                product.tags.map((tag: string, index: number) => (
                  <div
                    key={`${product.name}-${tag}-${index}`}
                    className="rounded bg-primary/10 px-1.5 py-0.5"
                  >
                    {tag}
                  </div>
                ))}
            </div>
            <div className="mt-auto flex flex-row gap-1">
              {(() => {
                const matchingVendor = getVendorBySlug(product.vendor);
                const matchingVendorIcon = matchingVendor?.assets.find(
                  (asset) =>
                    asset.assetType === VendorAssetType.ICON &&
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
              <div className="ml-1 text-xs ">
                {getVendorNameBySlug(product.vendor)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <div className="w-full">
        <Button
          className="w-full  border font-montserrat text-xs uppercase text-primary-foreground  "
          onClick={handleClick}
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

export default SealedCatalogItem;
