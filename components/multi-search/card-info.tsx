import React from 'react';

import { CardOptions } from './card-options';

import { Separator } from '@/components/ui/separator';
import type { Product } from '@/types';

export const CardInfo = ({
  resultInfo,
  results
}: {
  resultInfo: { name: string; normalized_name: string };
  results: Product[];
}) => {
  return (
    <div className="flex w-full flex-col rounded-lg border border-border bg-popover">
      <div className="flex flex-col p-4 text-left">
        <div className="text-lg font-bold">{resultInfo.name}</div>
        <div className="text-sm text-muted-foreground">
          {results?.length || 0} results
        </div>
      </div>
      <Separator />

      <CardOptions results={results} />
    </div>
  );
};
