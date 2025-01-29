import useBuyListStore from '@/stores/buyListStore';
import CardImage from '../ui/card-image';
import { ScrollArea } from '../ui/scroll-area';
import { MinusIcon, PlusIcon } from 'lucide-react';

export default function SavedLists() {
  const { updateCartItemOptimistic, currentCart, currentCartData } =
    useBuyListStore();

  return (
    <>
      <div className="mb-8  mt-1 min-h-svh">
        <div className=" flex flex-col gap-1   "></div>
        <div className="rounded-lg border bg-popover px-3 py-1">
          <h1 className="text-center text-2xl font-bold"></h1>
          <div>
            <ScrollArea className="">
              {currentCart &&
                currentCartData &&
                currentCartData.map((item: any, index: any) => (
                  <div key={index} className=" my-2 flex flex-row gap-3 ">
                    <div className="w-20  min-w-20">
                      <CardImage imageUrl={item.image} alt={item.card_name} />
                    </div>

                    <div className="flex flex-col justify-between ">
                      <div>
                        <p>
                          {item.card_name} ({item.condition_name})
                        </p>

                        <p className="text-sm capitalize text-muted-foreground">
                          {item.set_name}: {item.rarity}, {item.foil}
                        </p>
                      </div>
                      <p
                        className="w-min cursor-pointer text-sm font-normal underline"
                        onClick={() => updateCartItemOptimistic(item, 0)}
                      >
                        Remove
                      </p>
                      <div className="grid h-9 w-28 grid-cols-3 items-center rounded-lg border px-2">
                        <button
                          onClick={() =>
                            updateCartItemOptimistic(item, item.quantity - 1)
                          }
                          className="flex justify-center"
                        >
                          <MinusIcon></MinusIcon>
                        </button>

                        <p className="text-center font-mono">{item.quantity}</p>

                        <button
                          onClick={() =>
                            updateCartItemOptimistic(item, item.quantity + 1)
                          }
                          className="flex justify-center"
                        >
                          <PlusIcon></PlusIcon>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </ScrollArea>
          </div>
        </div>
      </div>
    </>
  );
}
