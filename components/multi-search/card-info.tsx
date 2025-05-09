import { CardOptions } from './card-options';

import { Card, CardContent } from '@/components/ui/card';
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
    <Card className="w-full">
      <CardContent className="pt-4 text-left">
        <div className="mb-2 flex flex-col">
          <div className="text-lg font-bold">{resultInfo.name}</div>
          <div className="text-sm text-muted-foreground">
            {results?.length || 0} results
          </div>
        </div>
        <Separator />

        <CardOptions results={results} />
      </CardContent>
    </Card>
  );
};
