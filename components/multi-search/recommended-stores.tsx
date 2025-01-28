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
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React, { useState } from 'react';
import useGlobalStore from '@/stores/globalStore';
import useMultiSearchStore from '@/stores/multiSearchStore';
import { Product } from '@/types';
import { Card, CardTitle, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@radix-ui/react-dialog';
import { groupProductsByHost, buildCartUpdateUrls } from '@/utils/cartUrlBuilder';
import { ExternalLink, AlertCircle, AlertTriangle } from 'lucide-react';
import { useTheme } from 'next-themes';

export const RecommendedStores = () => {
  const { results, addToCart, isInCart, notFound } = useMultiSearchStore();
  const { getWebsiteName, websites } = useGlobalStore();
  const { theme } = useTheme();
  
  // Filter out null values and then get unique card names
  const allCardNames = new Set(results
    .filter(group => group && group[0])
    .map(group => group[0].name));
  
  const totalRequested = allCardNames.size;
  const reccomendedWebsites = [
    'obsidian',
    'levelup',
    'chimera',
    'exorgames',
    'mythicstore',
    'houseofcards'
  ];
  const [selectedTopStore, setSelectedTopStore] = useState('');

  const getTopWebsites = (results: Product[][]) => {
    const websiteProducts: { [vendor: string]: Map<string, Product> } = {};
    const websiteNotFound: { [vendor: string]: Set<string> } = {};

    // Initialize not found sets for each recommended website
    reccomendedWebsites.forEach(vendor => {
      websiteNotFound[vendor] = new Set();
    });

    // Process results to find available products
    results.forEach((resultGroup) => {
      if (!resultGroup || resultGroup.length === 0) return;
      const cardName = resultGroup[0].name; // Get the card name from the first result
      
      resultGroup.forEach((product) => {
        if (!reccomendedWebsites.includes(product.vendor)) return;

        if (!websiteProducts[product.vendor]) {
          websiteProducts[product.vendor] = new Map();
        }

        // If we already have this product, only update if the new one is cheaper
        const existingProduct = websiteProducts[product.vendor].get(product.name);
        if (!existingProduct || product.price < existingProduct.price) {
          websiteProducts[product.vendor].set(product.name, product);
        }
      });

      // For each recommended store, if they don't have this card, add it to not found
      reccomendedWebsites.forEach(vendor => {
        const vendorProducts = resultGroup.filter(p => p.vendor === vendor);
        if (vendorProducts.length === 0) {
          websiteNotFound[vendor].add(cardName);
        }
      });
    });

    let sortedWebsites = Object.entries(websiteProducts)
      .map(([vendor, productsMap]) => {
        const products = Array.from(productsMap.values());
        return {
          vendor,
          products,
          notFound: Array.from(websiteNotFound[vendor]),
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
      (site) => site.vendor === 'obsidian'
    );
    if (obsidianIndex !== -1) {
      const [obsidian] = sortedWebsites.splice(obsidianIndex, 1);
      sortedWebsites = [obsidian, ...sortedWebsites];
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
      <Card className="col-span-12 flex flex-col gap-2 bg-popover pb-4 text-xs recommended-stores">
        <CardHeader className="text-left">
          <CardTitle className="text-lg">Recommended Stores</CardTitle>
        </CardHeader>
        <div className="grid grid-cols-2 gap-2 overflow-clip rounded-lg px-4">
          {getTopWebsites(results).map((websiteInfo, i) => {
            const matchingWebsite = websites.find(
              (website) => websiteInfo.vendor === website.slug
            );
            return (
              <div key={i} className="col-span-2 sm:col-span-1 text-left border-1 rounded-lg border border-border px-4 py-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {matchingWebsite?.meta?.branding?.icons && (
                      <img
                        src={theme === 'dark' ? matchingWebsite.meta.branding.icons.dark : matchingWebsite.meta.branding.icons.light}
                        alt="Website"
                        className="h-5 w-5"
                      />
                    )}
                    <div className="text-sm font-semibold">
                      {getWebsiteName(websiteInfo.vendor)}
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
                  {websiteInfo.notFound.length > 0 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px]">
                          <p className="font-semibold mb-1">Not in stock:</p>
                          <ul className="list-disc pl-4 space-y-1">
                            {websiteInfo.notFound.map((card, index) => (
                              <li key={index} className="text-xs">{card}</li>
                            ))}
                          </ul>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="hover:underline store-availability">
                        {websiteInfo.count}/{allCardNames.size} results in stock
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Available at {getWebsiteName(websiteInfo.vendor)}</DialogTitle>
                        <DialogDescription>
                          {websiteInfo.count} out of {allCardNames.size} cards are available at this store
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Available Cards</h4>
                          <div className="max-h-[40vh] overflow-y-auto rounded-md border">
                            <table className="w-full">
                              <thead className="sticky top-0 bg-background">
                                <tr className="border-b">
                                  <th className="text-left py-2 px-4">Card</th>
                                  <th className="text-right py-2 px-4">Price</th>
                                  <th className="text-right py-2 px-4">Condition</th>
                                </tr>
                              </thead>
                              <tbody>
                                {websiteInfo.products.map((product, index) => (
                                  <tr key={index} className="border-b border-border/50">
                                    <td className="py-2 px-4">{product.name}</td>
                                    <td className="text-right py-2 px-4">${product.price.toFixed(2)}</td>
                                    <td className="text-right py-2 px-4">{product.condition}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {websiteInfo.notFound.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              Not Available
                              <span className="text-xs text-muted-foreground">
                                ({websiteInfo.notFound.length} cards)
                              </span>
                            </h4>
                            <div className="max-h-[20vh] overflow-y-auto rounded-md border">
                              <div className="p-4 grid grid-cols-2 gap-2">
                                {websiteInfo.notFound.map((card, index) => (
                                  <div key={index} className="text-sm text-muted-foreground">
                                    {card}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button onClick={() => handleCheckout(websiteInfo.products)}>
                          Checkout (${websiteInfo.totalCost.toFixed(2)})
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="text-foreground text-lg font-bold mt-1">
                  ${websiteInfo.totalCost.toFixed(2)}
                </div>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="h-7 mt-2 w-full store-checkout"
                    >
                      Buy Now! <ExternalLink className="ml-2 h-3 w-3" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">Checkout at {getWebsiteName(websiteInfo.vendor)}</h4>
                        <p className="text-sm text-muted-foreground">
                          You will be redirected to {getWebsiteName(websiteInfo.vendor)} to complete your purchase of {websiteInfo.count} card(s).
                        </p>
                      </div>
                      <Button onClick={() => handleCheckout(websiteInfo.products)}>
                        Proceed to Checkout
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            );
          })}
        </div>
      </Card>
    </Dialog>
  );
};
