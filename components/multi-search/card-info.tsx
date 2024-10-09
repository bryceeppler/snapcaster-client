import React from "react";
import { Product } from "@/types";
import { Separator } from "@/components/ui/separator";
import { CardOptions } from "./card-options";

export const CardInfo = ({
  resultInfo,
  results,
}: {
  resultInfo: { name: string; normalized_name: string };
  results: Product[];
}) => {
  return (
    <div className="w-full flex flex-col border border-border rounded-lg px-4">
      <div className="flex justify-between items-center my-4">
        <div className="text-lg font-bold">{resultInfo.name}</div>
        <div className="text-sm text-muted-foreground">
          {results?.length || 0} results
        </div>
      </div>
      <Separator />

      <CardOptions results={results} name={resultInfo.name} />
    </div>
  );
};
