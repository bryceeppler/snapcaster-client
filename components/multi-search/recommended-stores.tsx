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
import React, { useState } from 'react';
import useGlobalStore from '@/stores/globalStore';
import useMultiSearchStore from '@/stores/multiSearchStore';
import { Product } from '@/types';
import { Card, CardTitle, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@radix-ui/react-dialog';
import { groupProductsByHost, buildCartUpdateUrls } from '@/utils/cartUrlBuilder';
import { ExternalLink } from 'lucide-react';
import { useTheme } from 'next-themes';

export const RecommendedStores = () => {
  const { results, addToCart, isInCart } = useMultiSearchStore();
  const { getWebsiteName, websites } = useGlobalStore();
  const { theme } = useTheme();
  const totalRequested = results.length;
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

    results.forEach((resultGroup) => {
      if (!resultGroup) return;
      
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
    });

    let sortedWebsites = Object.entries(websiteProducts)
      .map(([vendor, productsMap]) => {
        const products = Array.from(productsMap.values());
        return {
          vendor,
          products,
          count: Math.min(products.length, totalRequested),
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
    console.log(groupedProducts);
    const cartUrls = buildCartUpdateUrls(groupedProducts);
    console.log(cartUrls);
    // Open the first URL (there should only be one per vendor)
    if (cartUrls.length > 0) {
      window.open(cartUrls[0], '_blank');
    }
  };

  return (
    <Dialog>
      <Card className="col-span-12 flex flex-col gap-2 bg-popover pb-4 text-xs">
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
                <div className="mt-1 text-xs text-muted-foreground">
                  {websiteInfo.count}/{totalRequested} results in stock
                </div>
                <div className="text-foreground text-lg font-bold">
                  ${websiteInfo.totalCost.toFixed(2)}
                </div>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="h-7 mt-2 w-full"
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
