import React from "react";
import useGlobalStore from "@/stores/globalStore";
import useMultiSearchStore from "@/stores/multiSearchStore";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";

export const Toolbar = () => {
  const { resetSearch, cart } = useMultiSearchStore();
  const { getWebsiteName } = useGlobalStore();
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
    <div className="flex w-full gap-4 rounded-lg border border-border bg-popover p-4">
      <Button
        size="sm"
        onClick={() => {
          resetSearch();
        }}
      >
        Reset
      </Button>
      <Button
        size="sm"
        onClick={() => {
          exportCart();
        }}
        className="hidden lg:block"
      >
        Export Cart
      </Button>
    </div>
  );
};
