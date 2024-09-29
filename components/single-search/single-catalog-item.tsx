import React from "react";
import { SingleCatalogCard } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";
import CardImage from "../ui/card-image";
import useGlobalStore from "@/stores/globalStore";
import { useSingleSearchStore } from "@/stores/useSingleSearchStore";

import { handleBuyClick } from "../../utils/analytics";

type Props = {
  product: SingleCatalogCard;
};

const SingleCatalogItem = ({ product }: Props) => {
  const { websites } = useGlobalStore();
  const { resultsTcg } = useSingleSearchStore();
  const findWebsiteNameByCode = (slug: string) => {
    const website = websites.find((website) => website.slug === slug);
    return website ? website.name : "Website not found";
  };

  return (
    <div className="flex flex-col">
      <div
        className={`group flex h-full flex-col rounded-t-lg border border-accent bg-popover ${
          product.promoted ? "bg-primary/10 p-6" : "p-6"
        }`}
      >
        <div className="relative mx-auto max-w-[150px] md:max-w-[250px]">
          <CardImage imageUrl={product.image} alt={product.name} />
          {product.promoted && (
            <Badge className="absolute -left-2 -top-2 bg-gradient-to-tr from-primary to-red-700 shadow">
              Promoted
            </Badge>
          )}
        </div>
        <div className="flex flex-grow flex-col gap-1 pt-2 text-left">
          <div className="text-xs font-bold uppercase text-muted-foreground">
            {product.set}
          </div>

          <h3 className="text-sm font-bold capitalize tracking-tight">{`${
            product.name
          } ${
            product.collector_number ? `(${product.collector_number})` : ""
          }`}</h3>

          <h4 className="text-xs  font-semibold capitalize tracking-tight text-muted-foreground">{` ${
            product.frame ? product.frame : ""
          }  ${
            product.foil !== "foil" && product.foil != null ? product.foil : ""
          } ${product.showcase ? product.showcase : ""} ${
            product.alternate_art ? product.alternate_art : ""
          } ${product.promo ? product.promo : ""} ${
            product.art_series ? product.art_series : ""
          }`}</h4>

          <div className="flex flex-row gap-2">
            {websites.map(
              (website, index) =>
                product.vendor === website.slug &&
                website.imageUrl && (
                  <img
                    src={website.imageUrl}
                    alt="Website"
                    className="h-4 w-4"
                    key={index}
                  />
                )
            )}

            <div className="text-xs">
              {findWebsiteNameByCode(product.vendor)}
            </div>
          </div>
        </div>

        {product.discount_code && (
            <div className="mt-3 flex w-full" key={product.vendor}>
              <div className="text-left text-[0.7rem] tracking-tighter text-muted-foreground">
                With code <br />
                <span className="text-xs font-bold">
                  {product.discount_code}
                </span>
              </div>
            </div>
          )}

        <div className="mt-3">
          {product.discounted_price && (
              <h4 className="text-right text-xs text-muted-foreground line-through">
                ${Number(product.price)?.toFixed(2)}
              </h4>
            )}
          <div className="   flex flex-row justify-between">
            <div className="flex flex-col justify-end">
              <Badge
                className={` border-2 border-accent-foreground text-white ${
                  product.foil ? "bg-foil bg-cover bg-center" : "bg-accent"
                }`}
              >
                {product.condition}
              </Badge>
            </div>
            <h4>${Number(product.discounted_price || product.price).toFixed(2)}</h4>
          </div>
        </div>
      </div>
      <Link
        href={product.link}
        target="_blank"
        rel="noreferrer"
        className="w-full"
      >
        <Button
          className="w-full rounded-b-lg rounded-t-none"
          onClick={() =>
            handleBuyClick(
              product.link,
              product.price,
              product.name,
              product.promoted ?? false,
              resultsTcg
            )
          }
        >
          Buy
        </Button>
      </Link>
    </div>
  );
};

export default SingleCatalogItem;
