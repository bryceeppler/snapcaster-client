import type { CrystalUrlConfig, UtmParams } from './urlBuilderInterfaces';

/**
 * Single Crystal Commerce URL Builder
 * Use Case: Build Crystal Commerce shopify URLs with product or cart paths, discounts, and UTM parameters
 */
export class CrystalUrlBuilder {
  private config: CrystalUrlConfig;

  constructor(baseUrl: string) {
    this.config = { baseUrl, type: 'product' };
  }

  /**
   * CrystalUrlBuilder updates it's UTM parameters fields before building the url
   * Purpose: Set the UTM parameters for the url builder. We apply the UTM parameters to the url so that when the user clicks the link, they are redirected to the product page with the UTM parameters applied
   */
  setUtmParams(params: UtmParams): CrystalUrlBuilder {
    if (params.utm_source) this.config.utmSource = params.utm_source;
    if (params.utm_medium) this.config.utmMedium = params.utm_medium;
    if (params.utm_campaign) this.config.utmCampaign = params.utm_campaign;
    return this;
  }

  /**
   * Build the UTM parameters
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
    return this.buildProductUrl();
  }
}

/**
 * Create a new CrystalUrlBuilder
 * Purpose: Create a new CrystalUrlBuilder. We apply the base url to the url builder so that we can build the url for the product page or cart checkout page
 */
export function createCrystalUrlBuilder(baseUrl: string): CrystalUrlBuilder {
  return new CrystalUrlBuilder(baseUrl);
}
