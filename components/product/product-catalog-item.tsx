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
      'product' // Use 'product' as the category for general search
    );
    window.open(url, '_blank');
  };

  const vendor = getVendorBySlug(product.vendor);
  const vendorIcon = vendor?.assets.find(
    (asset) =>
      asset.assetType === VendorAssetType.ICON &&
      (asset.theme === theme || asset.theme === VendorAssetTheme.UNIVERSAL)
  );

  return (
    <Card className="flex flex-col font-montserrat">
      <CardContent className={`group flex h-full flex-col pt-4`}>
        <div
          className="relative cursor-pointer transition-opacity hover:opacity-90"
          onClick={handleClick}
        >
          <div className="mx-auto h-min max-w-[150px] md:max-w-[250px]">
            <ProductImage imageUrl={product.image} alt={product.name} />
          </div>
        </div>
        <div className="flex flex-grow flex-col">
          <div className="mt-3 flex flex-grow flex-col text-center md:text-left">
            <h3
              onClick={handleClick}
              className="cursor-pointer overflow-hidden text-ellipsis text-[0.9rem] font-semibold capitalize tracking-tight"
            >
              {product.title}
            </h3>
            <Link
              className="mb-2 mt-1 flex w-full cursor-pointer flex-col items-center justify-center gap-1 transition-opacity hover:opacity-80 md:flex-row md:justify-start"
              href={vendor?.url || ''}
              target="_blank"
              rel="noreferrer"
            >
              <div className="text-xs md:hidden">
                {getVendorNameBySlug(product.vendor)}
              </div>
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
              <div className="ml-1 hidden text-xs md:block">
                {getVendorNameBySlug(product.vendor)}
              </div>
            </Link>

            {product.quantity && (
              <div className="text-xs">
                {product.quantity}{' '}
                {product.quantity > 1 ? 'items available' : 'item available'}
              </div>
            )}
            <div className="mt-3">
              <div
                className="flex cursor-pointer flex-row items-center justify-center gap-2 transition-opacity hover:opacity-80 md:justify-start"
                onClick={handleClick}
              >
                <h4 className="flex items-start font-montserrat text-2xl font-semibold">
                  <span className="mt-1 text-sm">$</span>
                  {product.price.toFixed(2)}
                </h4>
              </div>
            </div>
          </div>
        </div>
        <Link
          href={product.link}
          target="_blank"
          rel="noreferrer"
          className="mt-4 w-full"
        >
          <Button
            className="w-full font-montserrat text-xs uppercase"
            variant="default"
            onClick={handleClick}
          >
            Buy
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ProductCatalogItem;
