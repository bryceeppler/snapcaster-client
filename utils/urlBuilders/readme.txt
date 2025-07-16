Last Updated July 14 205

Purpose: We are now handleing url building client side. We were applying things like utm parameters serverside in the past but now we want to do it here.
/utils/urlBuilders will determine the structure of outbound links to product and cart pages as well as apply discounts, product handles, product variant_ids, utm params, affilation tokens (when the shopify app is live)


Updates To ES Schemas:
- Each ES document stores a platform field: shopify | crystal | conduct which is used for what builder we want to used
- Shopify ES Documents have a handle field which is used to build the url that redirects  to the product page
- Shopify ES Documents link field is the base url of the website now. URL building now happens in the client.

Shopify URL Builder Checklist:
(TO DO) Sealed Search uses the url builder and applies the product handle, variant, discount redirect, and utm parameter
(Done) Single Search uses the url builder and applies the product handle, variant, discount redirect, and utm parameter
(Done) Multi Search uses the url builder and applies the product handle, variant, discount redirect, and utm parameter


Crystal Commerce Completed Checklist:
(Note) Currently unsure if we can even accomodate one click checkout for crystal commerce
(Note) the link field in a crystal commerce document is the actual product page unlike for shopify where its the base url
(Note) Honestly we might be able to to deprecate multi search if we make the site like skinport where people can add to cart and save their items.
(Note) Multi Search Reccomended stores is not applicable
(Done) Crystal URL Builder appends the url parameter

//////////////////////////
// Shopify URL Examples //
//////////////////////////

(1) Url Builder Order of operations:
Note: Discount and the discounts (1) products (2) and cart (3) paths are not applicable to non shopify platforms
- 1. discounts redirect => /discount/{discount_code}?redirect={products path or cart path} (Optional)
- 2.1 (Either products path or cart path) => /products/{product_handle}?variant={variant_id}
- 2.2 (Either products path or cart path) => /cart/{variant_id1}:{quantity},{variant_id2}:{quantity}
- 3. utm params (utm_source) => &utm_source={source}
- 4. utm params (utm_medium) => &utm_medium={medium}
- 5. utm params (utm_campaign) => &utm_campaign={campaign}
- 6. (Coming Soon) attribution token parameter on the /cart permalink once we have the shopify app ready


(2)Example Urls
- (product page) => /discount/OBSIDIAN+SNAPCASTER5?redirect=/products/shambling-shell-ravnica-city-of-guilds?variant=42703019278531&utm_source=sc&utm_medium=referral&utm_campaign=referral_singles
- (checkout page) => /discount/OBSIDIAN+SNAPCASTER5?redirect=/cart/43629330202819:1,43346607866051:1&utm_source=sc&utm_medium=referral&utm_campaign=referral_singles


(3) product page variations (brings straight to the product page)
- (visit product page (product handle plus vairiant id)) => /products/shambling-shell-ravnica-city-of-guilds?variant=42703019278531
- (add utm source param) => /products/shambling-shell-ravnica-city-of-guilds?variant=42703019278531&utm_source=sc
- (add utm medium param) => /products/shambling-shell-ravnica-city-of-guilds?variant=42703019278531&utm_medium=referral
- (add utm utm_campaign param) => /products/shambling-shell-ravnica-city-of-guilds?variant=42703019278531&utm_campaign=referral_singles
- (add utm utm_campaign param) => /products/shambling-shell-ravnica-city-of-guilds?variant=42703019278531&utm_source=sc&utm_medium=referral&utm_campaign=referral_singles
- (add discount code and redirect (gets auto applied on the user session so if they it gets applied and they can add to cart later)) => /discount/OBSIDIAN+SNAPCASTER5?redirect=/products/shambling-shell-ravnica-city-of-guilds?variant=42703019278531

(4) checkout page variations (brings straight to the checkout page)
Note: The checkout page will only have the items listed in the url meaning we don't have to worry about clearing the cart items then reapplying in case the user wants to make adjustments to the cart
- (cart with added items) => /cart/43629330202819:1,43346607866051:1
- (dicount code redirect to cart page) => /discount/OBSIDIAN+SNAPCASTER5?redirect=/cart/43629330202819:1,43346607866051:1
- (applying utm params to cart page) => /discount/OBSIDIAN+SNAPCASTER5?redirect=/cart/43629330202819:1,43346607866051:1&utm_source=sc&utm_medium=referral&utm_campaign=referral_singles

////////////////////////////
// Crystal/Conduct Stores //
////////////////////////////
- the link value will have the url to the actual product at the moment unlike shopify stores which will have the base url to the website so we can then build the url. As a result, utils/urlBuilders/conductUrlBuilder.ts and utils/urlBuilders/crystalUrlBuilder.ts simply have a function for just adding the utm parameters for now
- Conduct Commerce and Crystal Commerce Stores dont seem to have a 1 click checkout url resource so multi search will not support it right now.