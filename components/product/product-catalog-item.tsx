import Link from 'next/link';

import { useTheme } from 'next-themes';

import ProductImage from '../sealed/product-image';
import { Button } from '../ui/button';

import { Card, CardContent } from '@/components/ui/card';
import { useDiscounts } from '@/hooks/queries/useDiscounts';
import { useVendors } from '@/hooks/queries/useVendors';
import { VendorAssetTheme, VendorAssetType } from '@/services/vendorService';
import type { Product } from '@/types';
import { handleBuyClick } from '@/utils/analytics';
import { createConductUrlBuilder } from '@/utils/urlBuilders/conductUrlBuilder';
import { createCrystalUrlBuilder } from '@/utils/urlBuilders/crystalUrlBuilder';
import { createShopifyUrlBuilder } from '@/utils/urlBuilders/shopifyUrlBuilder';
import { UtmPresets } from '@/utils/urlBuilders/urlBuilderInterfaces';

type Props = {
  product: Product;
};

const ProductCatalogItem = ({ product }: Props) => {
  const { getVendorNameBySlug, getVendorBySlug } = useVendors();
  const { theme } = useTheme();
  const { getLargestActiveDiscountByVendorSlug } = useDiscounts();
  const getBaseUrl = (url: string) => {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.host}/`;
  };

  const handleClick = () => {
    const url = (() => {
      // Check if product has platform property like sealed products
      if ('platform' in product) {
        if (product.platform === 'shopify') {
          const builder = createShopifyUrlBuilder(getBaseUrl(product.link))
            .setProduct(product.handle || '', product.variant_id || '')
            .setUtmParams(UtmPresets.singles);
          const discount = getLargestActiveDiscountByVendorSlug(product.vendor);
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
      }
      // Fallback for products without platform
      return product.link;
    })();

    handleBuyClick(
      url,
      product.price,
      product.name,
      product.set,
      product.promoted ?? false,
      'product', // Use 'product' as the category for general search
      'singles'
    );
    window.open(url, '_blank');
  };

  const vendor = getVendorBySlug(product.vendor);

  return (
    <Card className="group flex h-full flex-col overflow-hidden border-border/40 font-montserrat transition-all hover:border-border hover:shadow-md">
      <div
        className="relative w-full cursor-pointer bg-background p-2"
        onClick={handleClick}
      >
        <div className="relative aspect-square w-full overflow-hidden">
          <ProductImage imageUrl={product.image} alt={product.name} />
        </div>
      </div>

      <CardContent className="flex flex-grow flex-col gap-2 p-3 text-left">
        <Link
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          href={vendor?.url || ''}
          target="_blank"
          rel="noreferrer"
        >
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
                className="h-3 w-3 flex-shrink-0"
              />
            ) : null;
          })()}
          <span>{getVendorNameBySlug(product.vendor)}</span>
        </Link>

        <h3
          onClick={handleClick}
          className="line-clamp-2 cursor-pointer text-sm leading-tight text-foreground transition-colors hover:text-primary"
          title={product.name}
        >
          {product.name}
        </h3>

        {product.quantity && (
          <p className="text-xs text-emerald-600 dark:text-emerald-400">
            In Stock ({product.quantity})
          </p>
        )}

        <div className="mt-auto pt-2">
          <div
            className="mb-3 cursor-pointer"
            onClick={handleClick}
          >
            <span className="text-2xl font-bold tracking-tight">
              ${product.price.toFixed(2)}
            </span>
            <span className="ml-1 text-xs text-muted-foreground">CAD</span>
          </div>

          <Link
            href={product.link}
            target="_blank"
            rel="noreferrer"
            className="w-full"
          >
            <Button
              className="w-full"
              variant="default"
              onClick={handleClick}
            >
              View Product
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCatalogItem;
