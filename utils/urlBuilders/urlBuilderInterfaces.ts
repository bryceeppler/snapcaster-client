/**
 * Base configuration For URL Builder
 * Purpose: Base configuration for URL Builder for attribution, utm params, cart info, product page info, and discount code redirects for shopify/crystal/conduct platform stores
 */
export interface BaseUrlConfig {
  baseUrl: string;
  discountCode?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

/**
 * Shopify-specific configuration
 * Purpose: Build Shopify URLs with product or cart paths, discounts, and UTM parameters
 */
export interface ShopifyUrlConfig extends BaseUrlConfig {
  type: 'product' | 'cart';
  productHandle?: string;
  variantId?: string | undefined; // Allow undefined
  cartItems?: Array<{ variantId: string; quantity: number }>;
}

/**
 * Crystal-specific configuration
 * Purpose: Build Crystal URLs with productpage or cart checkout paths, apply discounts, and apply UTM parameters
 */
export interface CrystalUrlConfig extends BaseUrlConfig {
  type: 'product' | 'cart';
  productHandle?: string;
  variantId?: string | undefined; // Allow undefined
  cartItems?: Array<{ variantId: string; quantity: number }>;
}
export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

/**
 * Predefined UTM parameter sets for common use cases
 * Purpose: Predefined UTM parameter sets for common outbound links for marketing attribution
 */
export const UtmPresets = {
  singles: {
    utm_source: 'sc',
    utm_medium: 'referral',
    utm_campaign: 'referral_singles'
  },
  sealed: {
    utm_source: 'sc',
    utm_medium: 'referral',
    utm_campaign: 'referral_sealed'
  },
  multi: {
    utm_source: 'sc',
    utm_medium: 'referral',
    utm_campaign: 'referral_multi'
  }
} as const;
