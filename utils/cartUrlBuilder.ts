import { createShopifyUrlBuilder } from './urlBuilders/shopifyUrlBuilder';
import { UtmPresets } from './urlBuilders/urlBuilderInterfaces';

import type { Product } from '@/types';

export function groupProductsByHost(
  products: Product[]
): Record<string, Product[]> {
  return products.reduce((acc: Record<string, Product[]>, product) => {
    try {
      const url = new URL(product.link);
      const host = url.hostname;

      if (!acc[host]) {
        acc[host] = [];
      }

      acc[host].push(product);
    } catch {
      console.error(`Invalid URL in product: ${product.link}`);
    }

    return acc;
  }, {});
}

/**
 * Multi Search Specific Url Builder
 * Purpose: Build the cart update urls for the grouped products. We apply the cart items, discount code, and UTM parameters to the url so that when the user clicks the link, they are redirected to the cart checkout page with the discount code applied and UTM parameters applied
 */
export function buildCartUpdateUrls(
  groupedProducts: Record<string, Product[]>,
  discountCode?: string
): string[] {
  const entries = Object.entries(groupedProducts);
  if (entries.length === 0) return [];

  const firstEntry = entries[0];
  if (!firstEntry) return [];

  const [host, products] = firstEntry;
  const baseUrl = `https://${host}/`;

  const cartItems = products
    .filter((product) => product.variant_id)
    .map((product) => ({
      variantId: product.variant_id!.toString(),
      quantity: 1
    }));
  if (products[0]?.platform === 'shopify') {
    const shopifyBuilder = createShopifyUrlBuilder(baseUrl)
      .setCart(cartItems)
      .setStorefront(true)
      .setUtmParams(UtmPresets.multi);

    if (discountCode) {
      shopifyBuilder.setDiscount(discountCode);
    }

    const shopifyUrl = shopifyBuilder.build();

    return [shopifyUrl];
  } else {
    return [baseUrl];
  }
}
