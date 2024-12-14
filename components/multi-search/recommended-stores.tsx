import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import React, { useState } from 'react';
import useGlobalStore from '@/stores/globalStore';
import useMultiSearchStore from '@/stores/multiSearchStore';
import { Product } from '@/types';
import { Card, CardTitle, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@radix-ui/react-dialog';

export const RecommendedStores = () => {
  const { results, addToCart, isInCart } = useMultiSearchStore();
  const { getWebsiteName } = useGlobalStore();
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
    const websiteProductSet: { [vendor: string]: Set<string> } = {};
    const websiteProductPrices: {
      [vendor: string]: { [productName: string]: number };
    } = {};

    results.forEach((product) => {
      if (!product) {
        return;
      }
      product.forEach((card) => {
        if (!websiteProductSet[card.vendor]) {
          websiteProductSet[card.vendor] = new Set();
          websiteProductPrices[card.vendor] = {};
        }
        websiteProductSet[card.vendor].add(card.name);

        if (!websiteProductPrices[card.vendor][card.name]) {
          websiteProductPrices[card.vendor][card.name] = card.price;
        } else {
          websiteProductPrices[card.vendor][card.name] = Math.min(
            websiteProductPrices[card.vendor][card.name],
            card.price
          );
        }
      });
    });

    const websiteCount: { [vendor: string]: number } = {};
    const websiteTotalCost: { [vendor: string]: number } = {};
    Object.entries(websiteProductSet).forEach(([vendor, productSet]) => {
      if (!reccomendedWebsites.includes(vendor)) {
        return;
      }
      websiteCount[vendor] = productSet.size;
      websiteTotalCost[vendor] = Array.from(productSet).reduce(
        (acc, productName) => acc + websiteProductPrices[vendor][productName],
        0
      );
    });

    let sortedWebsites = Object.entries(websiteCount)
      .map(([vendor, count]) => ({
        vendor,
        count: Math.min(count, totalRequested),
        totalCost: websiteTotalCost[vendor]
      }))
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

  return (
    <Dialog>
      <Card className="flex flex-col gap-2 bg-popover pb-4 text-xs">
        <CardHeader className="text-left">
          <CardTitle className="text-lg">Recommended Stores</CardTitle>
        </CardHeader>
        <div className="flex flex-col gap-2 overflow-clip rounded-lg px-4">
          {getTopWebsites(results).map((websiteInfo, i) => {
            return (
              <DialogTrigger
                key={i}
                asChild
                onClick={() => {
                  {
                    setSelectedTopStore(websiteInfo.vendor);
                  }
                }}
              >
                <div className="border-1 rounded-lg border border-border px-4 py-3 text-left transition-colors hover:cursor-pointer hover:bg-accent">
                  <div className="text-xs font-semibold">
                    {' '}
                    {getWebsiteName(websiteInfo.vendor)}
                  </div>
                  <div className=" text-foreground">
                    ${websiteInfo.totalCost.toFixed(2)}
                  </div>
                  <div className=" mt-1 text-xs text-muted-foreground">
                    {websiteInfo.count}/{totalRequested} results in stock
                  </div>
                </div>
              </DialogTrigger>
            );
          })}
        </div>
      </Card>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add to cart</DialogTitle>
          <DialogDescription>
            {`Clicking below will add all results from to your cart.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              onClick={() => {
                results.forEach((result) => {
                  const obsidianProducts = result.filter(
                    (product) => product.vendor === selectedTopStore
                  );
                  if (obsidianProducts.length > 0) {
                    const cheapestProduct = obsidianProducts.reduce(
                      (acc, cur) => (acc.price < cur.price ? acc : cur)
                    );
                    if (cheapestProduct && !isInCart(cheapestProduct)) {
                      addToCart(cheapestProduct);
                    }
                  }
                });
              }}
            >
              Add to cart
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
