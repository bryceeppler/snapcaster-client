import { Product } from '@/types';

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
    } catch (error) {
      console.error(`Invalid URL in product: ${product.link}`);
    }

    return acc;
  }, {});
}

function buildUpdateParameters(products: Product[]): string {
  return products
    .map((product) => `updates[${product.variant_id}]=1`)
    .join('&');
}

export function buildCartUpdateUrls(
  groupedProducts: Record<string, Product[]>
): string[] {
  const utmParams =
    'utm_source=sc&utm_medium=referral&utm_campaign=referral_multisearch';
  return Object.entries(groupedProducts).map(([host, products]) => {
    const queryParams = buildUpdateParameters(products);
    return `https://${host}/cart/update?${queryParams}&${utmParams}`;
  });
}
