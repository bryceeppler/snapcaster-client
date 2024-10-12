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
              <SheetTitle className="text-left text-3xl font-medium">
                Cart
              </SheetTitle>
            </SheetHeader>
            <div className="mt-8">
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
              <div className="mt-4 md:mt-2">
                <Button
                  onClick={() => {
                    clearAllCartItems();
                  }}
                  className="w-full bg-red-600 font-bold"
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <>
          <h1 className="pb-2 text-2xl">Cart</h1>
          <div className="">
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
              <p className="font-semibold ">${cashTotalAllStores.toFixed(2)}</p>
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
              onClick={() => {
                clearAllCartItems();
              }}
              className="w-full bg-red-600 font-bold"
            >
              Clear Cart
            </Button>
          </div>
        </>
      )}
    </>
  );
}
