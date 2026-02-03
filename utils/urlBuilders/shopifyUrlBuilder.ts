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
      this.config.variantId = String(variantId);
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
   * ShopifyUrlBuilder updates storefront field before building the url
   * Purpose: When true, cart links will redirect to the storefront cart page instead of checkout
   */
  setStorefront(value: boolean): ShopifyUrlBuilder {
    this.config.storefront = value;
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
    // (Temp Fix for Sealed link field affecting sealed from the shopify app only) Strip products/{productHandle} from the end of baseUrl if present
    if (this.config.productHandle) {
      const suffix = `/products/${this.config.productHandle}`;
      if (url.endsWith(`${suffix}/`)) {
        url = url.slice(0, -(suffix.length + 1));
      } else if (url.endsWith(suffix)) {
        url = url.slice(0, -suffix.length);
      }
    }

    // Build base product path (without variant - variant goes outside redirect)
    const baseProductPath = `/products/${this.config.productHandle}`;
    
    // Add discount wrapper if needed
    if (this.config.discountCode) {
      url += `/discount/${this.config.discountCode}`;
      url += `?redirect=${encodeURIComponent(baseProductPath)}`;
      if (this.config.variantId) {
        url += `&variant=${this.config.variantId}`;
      }
    } else {
      if (this.config.variantId) {
        url += `${baseProductPath}?variant=${this.config.variantId}`;
      } else {
        url += baseProductPath;
      }
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
   * Build the cart add url
   * Purpose: Build the cart add url using /cart/add format. This adds items to the existing cart without replacing it. We apply the cart items, discount code, storefront parameter, and UTM parameters via return_to
   */
  private buildCartUrl(): string {
    let url = this.config.baseUrl;

    // Build cart/add path with items as query parameters
    url += 'cart/add';

    // Add items as query parameters
    const itemsParams = this.config
      .cartItems!.map((item) => `items[][id]=${item.variantId}&items[][quantity]=${item.quantity}`)
      .join('&');

    url += `?${itemsParams}`;

    // Build return_to path with discount, storefront, and UTM params
    let returnToPath = '/cart';
    const returnParams: string[] = [];

    // Add discount code to return_to if needed
    if (this.config.discountCode) {
      returnParams.push(`discount=${encodeURIComponent(this.config.discountCode)}`);
    }

    // Add storefront parameter to return_to if needed (goes to cart page instead of checkout)
    if (this.config.storefront) {
      returnParams.push('storefront=true');
    }

    // Add UTM parameters to return_to
    const utmParams = this.buildUtmParams();
    if (utmParams) {
      returnParams.push(utmParams);
    }

    // Construct return_to with all parameters
    if (returnParams.length > 0) {
      returnToPath += '?' + returnParams.join('&');
    }

    // Add return_to parameter
    url += `&return_to=${encodeURIComponent(returnToPath)}`;

    console.log('cart url', url);
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
