import type { ShopifyUrlConfig, UtmParams } from './urlBuilderInterfaces';

/**
 * Single/sealed/multi search Shopify URL Builder
 * Purpose: Build Shopify URLs with product or cart paths, discounts, and UTM parameters
 */
export class ShopifyUrlBuilder {
  private config: ShopifyUrlConfig;

  constructor(baseUrl: string) {
    this.config = { baseUrl, type: 'product' };
  }

  /**
   * ShopifyUrlBuilder updates it's product page configuration before building the url
   * Purpose: Set the product page configuration for the url builder. We apply the type (product or cart path), handle, and vairant id
   */
  setProduct(handle: string, variantId?: string): ShopifyUrlBuilder {
    this.config.type = 'product';
    this.config.productHandle = handle;
    if (variantId !== undefined) {
      this.config.variantId = variantId;
    }
    return this;
  }

  /**
   * ShopifyUrlBuilder updates it's cart items field before building the url
   * Purpose: Set the cart checkout page configuration for the url builder. We apply the type (product or cart path), and cart items that will show on the checkout screen on the vendors website
   */
  setCart(
    items: Array<{ variantId: string; quantity: number }>
  ): ShopifyUrlBuilder {
    this.config.type = 'cart';
    this.config.cartItems = items;
    return this;
  }

  /**
   * ShopifyUrlBuilder updates it's discount code field before building the url
   * Purpose: Set the discount code for the url builder. We apply the discount code to the url so that when the user clicks the link, they are redirected to the product page with the discount code applied
   */
  setDiscount(code: string): ShopifyUrlBuilder {
    this.config.discountCode = code;
    return this;
  }

  /**
   * ShopifyUrlBuilder updates it's UTM parameters fields before building the url
   * Purpose: Set the UTM parameters for the url builder. We apply the UTM parameters to the url so that when the user clicks the link, they are redirected to the product page with the UTM parameters applied
   */
  setUtmParams(params: UtmParams): ShopifyUrlBuilder {
    if (params.utm_source) this.config.utmSource = params.utm_source;
    if (params.utm_medium) this.config.utmMedium = params.utm_medium;
    if (params.utm_campaign) this.config.utmCampaign = params.utm_campaign;
    return this;
  }

  /**
   * Build UTM parameters
   * Purpose: Build the UTM parameters for the url. We apply the UTM parameters to the url so that when the user clicks the link, they are redirected to the product page with the UTM parameters applied
   */
  private buildUtmParams(): string {
    const params: string[] = [];
    if (this.config.utmSource)
      params.push(`utm_source=${this.config.utmSource}`);
    if (this.config.utmMedium)
      params.push(`utm_medium=${this.config.utmMedium}`);
    if (this.config.utmCampaign)
      params.push(`utm_campaign=${this.config.utmCampaign}`);
    return params.join('&');
  }

  /**
   * Build the product page url
   * Purpose: Build the product page url. We apply the product path, discount code, and UTM parameters to the url so that when the user clicks the link, they are redirected to the product page with the discount code applied and UTM parameters applied
   */
  private buildProductUrl(): string {
    let url = this.config.baseUrl;

    // Build product path
    let productPath = `products/${this.config.productHandle}`;
    if (this.config.variantId) {
      productPath += `?variant=${this.config.variantId}`;
    }

    // Add discount wrapper if needed
    if (this.config.discountCode) {
      url += `discount/${this.config.discountCode}`;
      url += `?redirect=/${productPath}`;
    } else {
      url += productPath;
    }

    // Add UTM parameters
    const utmParams = this.buildUtmParams();
    if (utmParams) {
      const separator = url.includes('?') ? '&' : '?';
      url += separator + utmParams;
    }

    return url;
  }

  /**
   * Build the cart checkout page url
   * Purpose: Build the cart checkout page url. We apply the cart path, discount code, and UTM parameters to the url so that when the user clicks the link, they are redirected to the cart checkout page with the discount code applied and UTM parameters applied
   */
  private buildCartUrl(): string {
    let url = this.config.baseUrl;

    // Build cart path
    const cartItemsString = this.config
      .cartItems!.map((item) => `${item.variantId}:${item.quantity}`)
      .join(',');
    const cartPath = `cart/${cartItemsString}`;

    // Add discount wrapper if needed
    if (this.config.discountCode) {
      url += `discount/${encodeURIComponent(this.config.discountCode)}`;
      url += `?redirect=/${encodeURIComponent(cartPath)}`;
    } else {
      url += cartPath;
    }

    // Add UTM parameters
    const utmParams = this.buildUtmParams();
    if (utmParams) {
      const separator = url.includes('?') ? '&' : '?';
      url += separator + utmParams;
    }

    return url;
  }

  /**
   * Build the final URL
   * Purpose: Build the final url. We apply the product path, discount code, and UTM parameters to the url so that when the user clicks the link, they are redirected to the product page with the discount code applied and UTM parameters applied
   */
  build(): string {
    if (this.config.type === 'product') {
      return this.buildProductUrl();
    } else {
      return this.buildCartUrl();
    }
  }
}

/**
 * Create a new ShopifyUrlBuilder
 * Purpose: Create a new ShopifyUrlBuilder. We apply the base url to the url builder so that we can build the url for the product page or cart checkout page
 */
export function createShopifyUrlBuilder(baseUrl: string): ShopifyUrlBuilder {
  return new ShopifyUrlBuilder(baseUrl);
}
