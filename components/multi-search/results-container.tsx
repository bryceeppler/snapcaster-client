import React from "react";
import useMultiSearchStore from "@/stores/multiSearchStore";
import { Product } from "@/types";
import { CardInfo } from "./card-info";

export const ResultsContainer = ({ results }: { results: Product[][] }) => {
  const { resultsList } = useMultiSearchStore();
  return (
    <div className="w-full rounded-md border border-border bg-popover p-4 flex flex-col gap-4">
      {resultsList.map((result, index) => {
        return (
          <CardInfo resultInfo={result} results={results[index]} key={index} />
        );
      })}
    </div>
  );
};
