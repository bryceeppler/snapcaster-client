import React from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import useGlobalStore from "@/stores/globalStore";
import useMultiSearchStore from "@/stores/multiSearchStore";
import { Product } from "@/types";

import { Button } from "@/components/ui/button";

const CardOption = ({ product }: { product: Product }) => {
  const { getWebsiteName } = useGlobalStore();
  const { addToCart, isInCart, removeFromCart } = useMultiSearchStore();
  return (
    <div className="flex flex-row">
      <img src={product.image} alt={product.name} className="w-16 h-auto" />
      <div className="flex flex-col text-left ml-2">
        <div className="font-bold text-sm">
          {getWebsiteName(product.vendor)}
        </div>
        <div className="capitalize font-bold text-muted-foreground text-sm">
          {product.set}
        </div>
        <div className="font-bold flex flex-row gap-2">
          <div className="">
            <Badge
              className={` w-12 justify-center border-2 border-muted-foreground text-white ${
                product.finish ? "bg-foil bg-cover bg-center" : "bg-slate-700"
              }`}
            >
              {product.condition}
            </Badge>
          </div>
          <div>${product.price.toFixed(2)}</div>{" "}
        </div>
      </div>
      <div className="flex-grow"></div>
      {isInCart(product) ? (
        <Button
          onClick={() => {
            removeFromCart(product);
          }}
        >
          <Trash2 />
        </Button>
      ) : (
        <Button
          onClick={() => {
            addToCart(product);
          }}
        >
          Add to Cart
        </Button>
      )}
    </div>
  );
};

export const CardOptions = ({
  results,
  name,
}: {
  results: Product[];
  name: string;
}) => {
  return (
    <ScrollArea className="w-full h-[400px]">
      <div className="flex w-full flex-col gap-4 text-left">
        <div className="text-muted-foreground text-sm">Results for {name}</div>
        {results?.map((product, index) => {
          return <CardOption product={product} key={index} />;
        })}
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
};
