import { ArrowLeft, ShoppingCart, Download, HelpCircle } from 'lucide-react';
import React from 'react';
import { useState, useEffect } from 'react';

import { Cart } from './cart';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from '@/components/ui/dialog';
import { useVendors } from '@/hooks/queries/useVendors';
import useMultiSearchStore from '@/stores/multiSearchStore';
import type { Product } from '@/types';
import { createConductUrlBuilder } from '@/utils/urlBuilders/conductUrlBuilder';
import { createCrystalUrlBuilder } from '@/utils/urlBuilders/crystalUrlBuilder';
import { createShopifyUrlBuilder } from '@/utils/urlBuilders/shopifyUrlBuilder';
import { UtmPresets } from '@/utils/urlBuilders/urlBuilderInterfaces';
export const Toolbar = () => {
  const { resetSearch, cart } = useMultiSearchStore();
  const { getVendorNameBySlug } = useVendors();
  const [showHelp, setShowHelp] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const useMediaQuery = (width: number): boolean => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth <= width);
      window.addEventListener('resize', handleResize);
      handleResize(); // Call once to set the initial value

      return () => window.removeEventListener('resize', handleResize);
    }, [width]);

    return isMobile;
  };
  const isMobile = useMediaQuery(768);
  const exportCart = () => {
    const groupedByWebsite = cart.reduce((acc, product) => {
      const websiteName = getVendorNameBySlug(product.vendor);
      if (!acc[websiteName]) {
        acc[websiteName] = [];
      }
      acc[websiteName].push(product);
      return acc;
    }, {} as { [vendor: string]: Product[] });

    const cartData = Object.entries(groupedByWebsite)
      .map(([vendor, products]) => {
        const productsText = products
          .map(
            (product) =>
              `  Name: ${product.name}\n  Price: $${product.price.toFixed(
                2
              )}\n  Set: ${product.set}\n  Condition: ${
                product.condition
              }\n  Link: ${
                product.platform === 'shopify'
                  ? createShopifyUrlBuilder(product.link)
                      .setProduct(product.handle, product.variant_id)
                      .setUtmParams(UtmPresets.singles)
                      .build()
                  : product.platform === 'crystal'
                  ? createCrystalUrlBuilder(product.link)
                      .setUtmParams(UtmPresets.singles)
                      .build()
                  : createConductUrlBuilder(product.link)
                      .setUtmParams(UtmPresets.singles)
                      .build()
              }\n`
          )
          .join('\n');
        return `Website: ${vendor}\n\n${productsText}`;
      })
      .join('\n\n');

    const text = `Cart Summary\n\n${cartData}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cart.txt';
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <>
      <div
        className={`sticky ${
          isMobile ? 'top-16' : 'top-28'
        } z-50 flex w-full items-center justify-between gap-4 rounded-lg border border-border bg-popover/95 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-popover/75`}
      >
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              resetSearch();
            }}
            variant="ghost"
            size="sm"
            className="back-button gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {!isMobile && <span>Back</span>}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHelp(true)}
            className="help-button gap-2"
          >
            <HelpCircle className="h-4 w-4" />
            Help
          </Button>
          {/* <Button
            variant="ghost"
            size="sm"
            onClick={() => setRunTour(true)}
            className="tour-button gap-2"
          >
            <PlayCircle className="h-4 w-4" />
            Take Tour
          </Button> */}
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={exportCart}
            variant="ghost"
            size="sm"
            className="export-cart-button hidden gap-2 lg:flex"
          >
            <Download className="h-4 w-4" />
            Export Cart
          </Button>
          <Dialog open={showCart} onOpenChange={setShowCart}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="cart-button text-foreground"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Cart ({cart.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Shopping Cart</DialogTitle>
                <DialogDescription hidden>
                  Add more cards to your cart or remove items.
                </DialogDescription>
              </DialogHeader>
              <Cart />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>How to Use Multi-Search</DialogTitle>
            <DialogDescription hidden>
              See how to use Multi-Search.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* 1. Search for your cards, 2. Build your cart, 3. Checkout or export your cart */}
            <div>
              <p>1. Search for your cards</p>
              <p>2. Build your cart</p>
              <p>3. Checkout or export your cart</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
