// Old buylist cart component. Come back and fix after buylist add to cart logic has been added.

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { Button } from '../ui/button';
import CartStoreAccordian from './cart-store-accordian';
import useBuyListStore from '@/stores/buyListStore';
import { useEffect, useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';
type Props = {
  mobile: boolean;
};

export default function BuyListCart({ mobile }: Props) {
  const { buyListCartData, clearAllCartItems } = useBuyListStore();
  const [cashTotalAllStores, setCashTotalAllStores] = useState(0);
  const [creditTotalAllStores, setCreditTotalAllStores] = useState(0);
  useEffect(() => {
    let cashTotal = 0;
    let creditTotal = 0;

    buyListCartData.map((item: any) => {
      const key = Object.keys(item)[0];
      item[key].map((variant: any) => {
        cashTotal += variant.cashPrice * variant.quantity;
        creditTotal += variant.creditPrice * variant.quantity;
      });
    });

    setCashTotalAllStores(cashTotal);
    setCreditTotalAllStores(creditTotal);
  }, [buyListCartData]);

  return (
    <>
      {mobile == true ? (
        <Sheet>
          <SheetTrigger asChild={true} className="w-full">
            <Button className="relative flex w-full items-center justify-center">
              <p className="absolute left-1/2 -translate-x-1/2 transform">
                View Cart
              </p>
            </Button>
          </SheetTrigger>
          <SheetContent className="w-svw  sm:max-w-full">
            <SheetHeader>
              <SheetTitle className="text-left text-3xl font-semibold">
                Cart
              </SheetTitle>
            </SheetHeader>
            <div className="mt-8">
              <ScrollArea className="flex max-h-[85svh] flex-col overflow-y-auto rounded">
                {buyListCartData.map((item, key) => (
                  <CartStoreAccordian
                    key={key}
                    storeCartData={item}
                  ></CartStoreAccordian>
                ))}
                <div className="flex justify-between">
                  <div>
                    <p className="font-bold text-muted-foreground">Cash:</p>
                  </div>
                  <div>
                    <p className="font-semibold ">
                      ${cashTotalAllStores.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div>
                    <p className="font-bold text-muted-foreground">Credit:</p>
                  </div>
                  <div>
                    <p className="font-semibold ">
                      ${creditTotalAllStores.toFixed(2)}
                    </p>
                  </div>
                </div>
                {buyListCartData.length > 0 && (
                  <div className="mt-4 md:mt-2">
                    <Button
                      onClick={() => {
                        clearAllCartItems();
                      }}
                      className="w-full bg-red-500 font-bold hover:bg-red-600"
                    >
                      Clear Cart
                    </Button>
                  </div>
                )}
              </ScrollArea>
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <div className="sticky top-5 max-h-[85svh] ">
          <div className="mb-2 flex flex-col text-left capitalize">
            <h1 className="text-2xl font-bold">Cart</h1>

            <p className="text-sm text-gray-500">
              {' '}
              {buyListCartData.length} Stores Selected
            </p>
          </div>

          <ScrollArea
            className="flex max-h-[85svh] flex-col overflow-y-auto rounded"
            type="scroll"
          >
            <div>
              {buyListCartData.map((item, key) => (
                <CartStoreAccordian
                  key={key}
                  storeCartData={item}
                ></CartStoreAccordian>
              ))}
            </div>

            <div className="flex justify-between">
              <div>
                <p className="font-bold text-muted-foreground">Cash:</p>
              </div>
              <div>
                <p className="font-semibold ">
                  ${cashTotalAllStores.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="flex justify-between">
              <div>
                <p className="font-bold text-muted-foreground">Credit:</p>
              </div>
              <div>
                <p className="font-semibold ">
                  ${creditTotalAllStores.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="mt-2">
              <Button
                disabled={buyListCartData.length > 0 ? false : true}
                onClick={() => {
                  clearAllCartItems();
                }}
                className="w-full bg-red-500 font-bold hover:bg-red-600"
              >
                Clear Cart
              </Button>
            </div>
          </ScrollArea>
        </div>
      )}
    </>
  );
}
