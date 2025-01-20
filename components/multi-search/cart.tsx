import React from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";
import useGlobalStore from "@/stores/globalStore";
import useMultiSearchStore from "@/stores/multiSearchStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";

export const Cart = () => {
  const { cart, removeFromCart } = useMultiSearchStore();
  const { getWebsiteName } = useGlobalStore();

  const storeSummary = cart.reduce((acc, product) => {
    const websiteName = getWebsiteName(product.vendor);
    if (!acc[websiteName]) {
      acc[websiteName] = {
        count: 0,
        subtotal: 0
      };
    }
    acc[websiteName].count += 1;
    acc[websiteName].subtotal += product.price;
    return acc;
  }, {} as { [website: string]: { count: number; subtotal: number } });

  return (
    <div className="flex h-full flex-col">
      <SheetHeader className="text-left px-1">
        <SheetTitle>Shopping Cart ({cart.length})</SheetTitle>
      </SheetHeader>
      <div className="flex flex-1 flex-col gap-4 py-4">
        {cart.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center text-sm text-muted-foreground">
            <p>Your cart is empty</p>
          </div>
        )}
        <ScrollArea className="flex-1 rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.map((product, i) => (
                <TableRow key={i}>
                  <TableCell className="py-2 text-left text-xs">
                    {product.name}
                  </TableCell>
                  <TableCell className="py-2 text-right">
                    ${product.price}
                  </TableCell>
                  <TableCell className="py-2 text-right">
                    <Button
                      onClick={() => {
                        removeFromCart(product);
                      }}
                      variant="ghost"
                      size="icon"
                    >
                      <Trash2 size={15} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
        <ScrollArea className="flex-1 rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Vendor</TableHead>
                <TableHead className="max-w-[40px] text-right">Qty</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(storeSummary).map(([store, summary], i) => (
                <TableRow key={i} className="text-xs">
                  <TableCell className="text-left">{store}</TableCell>
                  <TableCell className="text-right">{summary.count}</TableCell>
                  <TableCell>${summary.subtotal.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </div>
      <div className="border-t border-border pt-4">
        <div className="flex w-full justify-between px-2">
          <span className="font-bold">Total</span>
          <span>
            ${cart.reduce((acc, product) => acc + product.price, 0).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};