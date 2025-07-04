import { AlertTriangle, ExternalLink } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { useVendors } from '@/hooks/queries/useVendors';
import { VendorAssetTheme, VendorAssetType } from '@/services/vendorService';
import useMultiSearchStore from '@/stores/multiSearchStore';
import type { Product } from '@/types';
import {
  buildCartUpdateUrls,
  groupProductsByHost
} from '@/utils/cartUrlBuilder';

export const RecommendedStores = () => {
  const { results } = useMultiSearchStore();
  const { getVendorNameBySlug, vendors } = useVendors();
  const { theme } = useTheme();

  // Filter out null values and then get unique card names
  const allCardNames = new Set(
    results.filter((group) => group && group[0]).map((group) => group[0]?.name)
  );

  const reccomendedWebsites = [
    'obsidian',
    'levelup',
    'chimera',
    'exorgames',
    'houseofcards',
    'vortexgames'
  ];

  const getTopWebsites = (results: Product[][]) => {
    const websiteProducts: { [vendor: string]: Map<string, Product> } = {};
    const websiteNotFound: { [vendor: string]: Set<string> } = {};

    // Initialize not found sets for each recommended website
    reccomendedWebsites.forEach((vendor) => {
      websiteNotFound[vendor] = new Set();
    });

    // Process results to find available products
    results.forEach((resultGroup) => {
      if (!resultGroup || resultGroup.length === 0) return;
      const cardName = resultGroup[0]?.name; // Get the card name from the first result

      resultGroup.forEach((product) => {
        if (!reccomendedWebsites.includes(product.vendor)) return;

        if (!websiteProducts[product.vendor]) {
          websiteProducts[product.vendor] = new Map();
        }

        // If we already have this product, only update if the new one is cheaper
        const existingProduct = websiteProducts[product.vendor]?.get(
          product.name
        );
        if (!existingProduct || product.price < existingProduct.price) {
          websiteProducts[product.vendor]?.set(product.name, product);
        }
      });

      // For each recommended store, if they don't have this card, add it to not found
      reccomendedWebsites.forEach((vendor) => {
        const vendorProducts = resultGroup.filter((p) => p.vendor === vendor);
        if (vendorProducts.length === 0) {
          websiteNotFound[vendor]?.add(cardName || 'Not Found');
        }
      });
    });

    let sortedWebsites = Object.entries(websiteProducts)
      .map(([vendor, productsMap]) => {
        const products = Array.from(productsMap.values());
        return {
          vendor,
          products,
          notFound: Array.from(websiteNotFound[vendor] || []),
          count: products.length,
          totalCost: products.reduce((acc, product) => acc + product.price, 0)
        };
      })
      .sort((a, b) => {
        if (b.count !== a.count) {
          return b.count - a.count;
        }
        return a.totalCost - b.totalCost;
      });

    // Ensure "obsidian" appears at the top
    const obsidianIndex = sortedWebsites.findIndex(
      (site) => site.vendor === 'obsidiangamesvernon'
    );
    if (obsidianIndex !== -1) {
      const obsidianSite = sortedWebsites.splice(obsidianIndex, 1)[0];
      if (obsidianSite) {
        sortedWebsites = [obsidianSite, ...sortedWebsites];
      }
    }

    return sortedWebsites;
  };

  const handleCheckout = (products: Product[]) => {
    if (products.length === 0) return;

    // Group products by host and build cart URLs
    const groupedProducts = groupProductsByHost(products);
    const cartUrls = buildCartUpdateUrls(groupedProducts);
    // Open the first URL (there should only be one per vendor)
    if (cartUrls.length > 0) {
      window.open(cartUrls[0], '_blank');
    }
  };

  return (
    <Dialog>
      <Card className="col-span-12 flex flex-col text-xs">
        <CardHeader className="text-left">
          <CardTitle className="text-lg">Recommended Stores</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2 overflow-clip">
          {getTopWebsites(results).map((vendorInfo, i) => {
            const matchingVendor = vendors.find(
              (vendor) => vendorInfo.vendor === vendor.slug
            );
            const matchingVendorIcon = matchingVendor?.assets.find(
              (asset) =>
                asset.asset_type === VendorAssetType.ICON &&
                (asset.theme === theme ||
                  asset.theme === VendorAssetTheme.UNIVERSAL)
            );
            return (
              <div
                key={i}
                className="border-1 col-span-2 rounded-lg border border-border px-4 py-3 text-left sm:col-span-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {matchingVendorIcon && (
                      <img
                        src={matchingVendorIcon.url}
                        alt={getVendorNameBySlug(vendorInfo.vendor)}
                        className="h-5 w-5"
                      />
                    )}
                    <div className="text-sm font-semibold">
                      {getVendorNameBySlug(vendorInfo.vendor)}
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  {vendorInfo.notFound.length > 0 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px]">
                          <p className="mb-1 font-semibold">Not in stock:</p>
                          <ul className="list-disc space-y-1 pl-4">
                            {vendorInfo.notFound.map((card, index) => (
                              <li key={index} className="text-xs">
                                {card}
                              </li>
                            ))}
                          </ul>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="store-availability hover:underline">
                        {vendorInfo.count}/{allCardNames.size} results in stock
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          Available at {getVendorNameBySlug(vendorInfo.vendor)}
                        </DialogTitle>
                        <DialogDescription>
                          {vendorInfo.count} out of {allCardNames.size} cards
                          are available at this store
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h4 className="mb-2 font-medium">Available Cards</h4>
                          <div className="max-h-[40vh] overflow-y-auto rounded-md border">
                            <table className="w-full">
                              <thead className="sticky top-0 bg-background">
                                <tr className="border-b">
                                  <th className="px-4 py-2 text-left">Card</th>
                                  <th className="px-4 py-2 text-right">
                                    Price
                                  </th>
                                  <th className="px-4 py-2 text-right">
                                    Condition
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {vendorInfo.products.map((product, index) => (
                                  <tr
                                    key={index}
                                    className="border-b border-border/50"
                                  >
                                    <td className="px-4 py-2">
                                      {product.name}
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                      ${product.price.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                      {product.condition}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {vendorInfo.notFound.length > 0 && (
                          <div>
                            <h4 className="mb-2 flex items-center gap-2 font-medium">
                              Not Available
                              <span className="text-xs text-muted-foreground">
                                ({vendorInfo.notFound.length} cards)
                              </span>
                            </h4>
                            <div className="max-h-[20vh] overflow-y-auto rounded-md border">
                              <div className="grid grid-cols-2 gap-2 p-4">
                                {vendorInfo.notFound.map((card, index) => (
                                  <div
                                    key={index}
                                    className="text-sm text-muted-foreground"
                                  >
                                    {card}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button
                          onClick={() => handleCheckout(vendorInfo.products)}
                        >
                          Checkout (${vendorInfo.totalCost.toFixed(2)})
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="mt-1 text-lg font-bold text-foreground">
                  ${vendorInfo.totalCost.toFixed(2)}
                </div>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="store-checkout mt-2 h-7 w-full"
                    >
                      Buy Now! <ExternalLink className="ml-2 h-3 w-3" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">
                          Checkout at {getVendorNameBySlug(vendorInfo.vendor)}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          You will be redirected to{' '}
                          {getVendorNameBySlug(vendorInfo.vendor)} to complete
                          your purchase of {vendorInfo.count} card(s).
                        </p>
                      </div>
                      <Button
                        onClick={() => handleCheckout(vendorInfo.products)}
                      >
                        Proceed to Checkout
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </Dialog>
  );
};
