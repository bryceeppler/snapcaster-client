import React from "react";
import useGlobalStore from "@/stores/globalStore";
import useMultiSearchStore from "@/stores/multiSearchStore";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart, Download, HelpCircle, PlayCircle } from 'lucide-react';
import { Cart } from './cart';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { InteractiveGuide } from "./interactive-guide";

export const Toolbar = () => {
  const { resetSearch, cart } = useMultiSearchStore();
  const { getWebsiteName } = useGlobalStore();
  const [showHelp, setShowHelp] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [runTour, setRunTour] = useState(false);
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
    <>
      <div className={`sticky ${isMobile ? "top-16" : "top-28"} z-50 flex w-full items-center justify-between gap-4 rounded-lg border border-border bg-popover/95 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-popover/75`}>
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
            className="export-cart-button hidden lg:flex gap-2"
          >
            <Download className="h-4 w-4" />
            Export Cart
          </Button>
          <Dialog open={showCart} onOpenChange={setShowCart}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="cart-button text-foreground">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart ({cart.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Shopping Cart</DialogTitle>
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
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p>Try our interactive tour to see how to use Multi-Search.</p> 
            </div>

          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={() => {
              setShowHelp(false);
              setRunTour(true);
            }}>
              Take Interactive Tour
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <InteractiveGuide 
        run={runTour} 
        onFinish={() => setRunTour(false)} 
      />
    </>
  );
};
