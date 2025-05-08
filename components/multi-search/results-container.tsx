import { AlertTriangleIcon } from 'lucide-react';
import React from 'react';

import { CardInfo } from './card-info';

import useMultiSearchStore from '@/stores/multiSearchStore';
import type { Product } from '@/types';

export const ResultsContainer = ({ results }: { results: Product[][] }) => {
  const { notFound, resultsList } = useMultiSearchStore();
  return (
    <div className="results-container flex w-full flex-col gap-4">
      {notFound.length > 0 && (
        <div className="flex w-full flex-row rounded-lg border border-destructive bg-destructive/20 p-4">
          <AlertTriangleIcon className="mr-4 h-6 w-6" />
          <div className="flex flex-col gap-2 text-left">
            <h2 className="font-semibold">
              Could not find the following cards...
            </h2>
            <ul className="flex list-inside list-disc flex-col gap-2">
              {notFound.map((name, index) => {
                return <li key={index}>{name}</li>;
              })}
            </ul>
          </div>
        </div>
      )}
      {resultsList.map((result, index) => {
        if (!results[index]) {
          return null;
        }
        return (
          <CardInfo resultInfo={result} results={results[index]} key={index} />
        );
      })}
    </div>
  );
};
