import { Product } from '@/types';

export function groupProductsByHost(products: Product[]): Record<string, Product[]> {
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

export function buildUpdateParameters(products: Product[]): string {
  return products
    .map(product => `updates[${product.variantId}]=1`)
    .join('&');
}

export function buildCartUpdateUrls(groupedProducts: Record<string, Product[]>): string[] {
  return Object.entries(groupedProducts).map(([host, products]) => {
    const queryParams = buildUpdateParameters(products);
    return `https://${host}/cart/update?${queryParams}`;
  });
} 