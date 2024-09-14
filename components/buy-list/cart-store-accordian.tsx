import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import useBuyListStore from '@/stores/buyListStore';
import { PlusIcon, MinusIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';

type Props = { storeCartData: any };
export default function CartStoreAccordian({ storeCartData }: Props) {
  const { buyListCartData, addToCart, removeFromCart } = useBuyListStore();
  useEffect(() => {
    const key = Object.keys(storeCartData)[0];
    let cashTotal = 0;
    let creditTotal = 0;
    storeCartData[key].map((item: any) => {
      // console.log(`use state print: ${item.name} from ${item.set}`);
      cashTotal += item.cashPrice * item.quantity;
      creditTotal += item.creditPrice * item.quantity;
    });
    setTotalCash(cashTotal);
    setTotalCredit(creditTotal);
  }, [buyListCartData]);

  const [totalCash, setTotalCash] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1" className="rounded-md border-none">
        <AccordionTrigger className="border-border-colour mb-2 max-h-10 rounded-md border bg-popover px-2 text-sm font-bold">
          {`${Object.keys(storeCartData)[0]} (${
            storeCartData[Object.keys(storeCartData)[0]].length
          }) `}
        </AccordionTrigger>
        <AccordionContent>
          <div className="border-border-colour  rounded-md border bg-popover py-1">
            {/* item 1 in cart list */}
            {storeCartData[Object.keys(storeCartData)[0]].map(
              (item: any, key: number) => (
                <div key={key} className="grid grid-cols-12 py-2">
                  <div className="col-span-1 text-center">
                    <p className="font-semibold">{`(${item.quantity})`}</p>
                  </div>
                  <div className="col-span-9 ">
                    <p className="font-semibold">
                      {item.condition} - {item.name}
                    </p>
                    <p className="font-medium text-muted-foreground">
                      {item.set}
                    </p>
                    <div className="grid grid-cols-7">
                      <p className="col-span-1 w-full text-muted-foreground">
                        Cash:
                      </p>
                      <p className="col-span-6 col-start-2 w-min">
                        ${item.cashPrice * item.quantity}
                      </p>
                    </div>
                    <div className="grid grid-cols-7">
                      <p className="col-span-1 w-full text-muted-foreground">
                        Credit:
                      </p>
                      <p className="col-span-6 col-start-2 w-min">
                        {' '}
                        ${item.creditPrice * item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-2 ">
                    <div className="flex h-full items-center justify-between pr-2">
                      <button
                        onClick={() =>
                          removeFromCart(Object.keys(storeCartData)[0], item)
                        }
                      >
                        <MinusIcon className="h-6 w-6 stroke-1" />
                      </button>

                      <button
                        onClick={() =>
                          addToCart(Object.keys(storeCartData)[0], item)
                        }
                      >
                        <PlusIcon className="h-6 w-6 stroke-1" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}

            <div className="grid grid-cols-12">
              <div className="col-span-9 col-start-2">
                <p className="font-bold text-muted-foreground">Cash:</p>
              </div>
              <div className="col-span-2 col-start-11">
                <p className="font-bold ">${totalCash}</p>
              </div>
            </div>
            <div className="grid grid-cols-12">
              <div className="col-span-9 col-start-2">
                <p className="font-bold text-muted-foreground">Credit:</p>
              </div>
              <div className="col-span-2 col-start-11">
                <p className="font-bold ">${totalCredit}</p>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
