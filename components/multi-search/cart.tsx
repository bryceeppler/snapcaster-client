import { ExternalLink, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { useVendors } from '@/hooks/queries/useVendors';
import useMultiSearchStore from '@/stores/multiSearchStore';
import type { Product } from '@/types';
import {
  buildCartUpdateUrls,
  groupProductsByHost
} from '@/utils/cartUrlBuilder';

export const Cart = () => {
  const { cart, removeFromCart } = useMultiSearchStore();
  const { getVendorNameBySlug } = useVendors();

  const recommendedStores = [
    'obsidiangamesvernon',
    'levelup',
    'chimera',
    'exorgames',
    'houseofcards',
    'vortexgames'
  ];

  const handleCheckout = (products: Product[]) => {
    if (products.length === 0) return;
    const groupedProducts = groupProductsByHost(products);
    const cartUrls = buildCartUpdateUrls(groupedProducts);
    if (cartUrls.length > 0) {
      window.open(cartUrls[0], '_blank');
    }
  };

  const storeSummary = cart.reduce((acc, product) => {
    const vendorName = getVendorNameBySlug(product.vendor);
    if (!acc[vendorName]) {
      acc[vendorName] = {
        count: 0,
        subtotal: 0,
        products: [],
        vendor: product.vendor
      };
    }
    acc[vendorName].count += 1;
    acc[vendorName].subtotal += product.price;
    acc[vendorName].products.push(product);
    return acc;
  }, {} as { [vendor: string]: { count: number; subtotal: number; products: Product[]; vendor: string } });

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center text-sm text-muted-foreground">
        <p>Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <ScrollArea className="h-[300px] rounded-lg border border-border">
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
                <TableCell className="py-2 text-left">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold">{product.name}</span>
                    <span className="text-xs font-medium uppercase text-muted-foreground">
                      {product.set}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {getVendorNameBySlug(product.vendor)}
                    </span>
                  </div>
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

      <ScrollArea className="h-[200px] rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Vendor</TableHead>
              <TableHead className="max-w-[40px] text-right">Qty</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(storeSummary).map(([store, summary], i) => (
              <TableRow key={i} className="text-xs">
                <TableCell className="text-left">
                  <div className="flex flex-col gap-2">
                    <span>{store}</span>
                    {recommendedStores.includes(summary.vendor) && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            size="sm"
                            className="store-checkout h-5 w-full max-w-[100px] text-xs"
                          >
                            Buy Now! <ExternalLink className="ml-2 h-3 w-3" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <h4 className="font-medium leading-none">
                                Checkout at {store}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                You will be redirected to {store} to complete
                                your purchase of {summary.count} card(s).
                              </p>
                            </div>
                            <Button
                              onClick={() => handleCheckout(summary.products)}
                            >
                              Proceed to Checkout
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">{summary.count}</TableCell>
                <TableCell className="text-right">
                  ${summary.subtotal.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ScrollBar orientation="vertical" />
      </ScrollArea>

      <div className="flex w-full justify-between border-t border-border px-2 pt-2">
        <span className="font-bold">Total</span>
        <span>
          ${cart.reduce((acc, product) => acc + product.price, 0).toFixed(2)}
        </span>
      </div>
    </div>
  );
};
