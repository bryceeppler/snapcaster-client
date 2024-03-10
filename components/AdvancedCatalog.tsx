import React from 'react';
import AdvancedCatalogRow from './AdvancedCatalogRow';
import { advancedUseStore } from '@/stores/advancedStore';
import { Button } from './ui/button';

type Props = {};

export default function AdvancedCatalog({}: Props) {
  const { advancedSearchResults } = advancedUseStore();
  if (advancedSearchResults.length === 0) {
    return (
      <div className="flex items-center justify-center pt-5">
        <div className="text-sm">No results found</div>
      </div>
    );
  }

  return (
    <div>
      {advancedSearchResults.map((cardData, index) => (
        <div key={index}>
          <AdvancedCatalogRow cardData={cardData}></AdvancedCatalogRow>
        </div>
      ))}
      {advancedSearchResults.length > 10 && (
        <Button
          onClick={() => {
            window.scrollTo(0, 0);
          }}
          className="mt-4 w-full"
        >
          Back to Top
        </Button>
      )}
    </div>
  );
}
