/**
 * Utility for appending UTM parameters to advertisement links
 */

/**
 * Appends UTM parameters to a URL
 * @param url The original URL to append parameters to
 * @param params Optional custom UTM parameters
 * @returns URL with UTM parameters
 */
export function appendUtmParameters(
  url: string,
  params: {
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
    term?: string;
  } = {}
): string {
  if (!url) return '';

  try {
    // Create URL object to easily manipulate the URL
    const urlObj = new URL(url);

    // Set default UTM parameters
    const utmParams = {
      utm_source: params.source || 'sc',
      utm_medium: params.medium || 'referral',
      utm_campaign: params.campaign || 'referral_advertisement',
      ...(params.content && { utm_content: params.content }),
      ...(params.term && { utm_term: params.term })
    };

    // Append parameters to URL
    Object.entries(utmParams).forEach(([key, value]) => {
      urlObj.searchParams.set(key, value);
    });

    return urlObj.toString();
  } catch (error) {
    // If URL is invalid, return original URL
    console.error('Error appending UTM parameters:', error);
    return url;
  }
}
