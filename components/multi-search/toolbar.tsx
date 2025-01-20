import React from "react";
import useGlobalStore from "@/stores/globalStore";
import useMultiSearchStore from "@/stores/multiSearchStore";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Cart } from './cart';
import { useState, useEffect } from 'react';
export const Toolbar = () => {
  const { resetSearch, cart } = useMultiSearchStore();
  const { getWebsiteName } = useGlobalStore();
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
      const websiteName = getWebsiteName(product.vendor);
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
              }\n  Link: ${product.link}\n`
          )
          .join("\n");
        return `Website: ${vendor}\n\n${productsText}`;
      })
      .join("\n\n");

    const text = `Cart Summary\n\n${cartData}`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cart.txt";
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className={`text-primary-foreground sticky ${isMobile ? "top-16" : "top-28"} z-50 flex w-full items-center justify-between gap-4 rounded-lg border border-border bg-primary/95 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-primary/75`}>
      <Button
        onClick={() => {
          resetSearch();
        }}
        variant="ghost"
        size="sm"
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      <div className="flex items-center gap-2">
        <Button
          onClick={exportCart}
          variant="ghost"
          size="sm"
          className="hidden lg:flex"
        >
          Export Cart
        </Button>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="text-foreground">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart ({cart.length})
            </Button>
          </SheetTrigger>
          <SheetContent className="w-svw sm:max-w-[400px]">
            <Cart />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};
