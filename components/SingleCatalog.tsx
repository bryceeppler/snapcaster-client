import React from 'react';
import { useStore } from '@/stores/store';
import SingleCatalogRow from './SingleCatalogRow';
import { Button } from './ui/button';
type Props = {};

export default function SingleCatalog({}: Props) {
  const { filteredSingleSearchResults } = useStore();
  if (filteredSingleSearchResults.length === 0) {
    return (
      <div className="flex items-center justify-center pt-5">
        <div className="text-sm">No results found</div>
      </div>
    );
  }

  return (
    <div>
      {filteredSingleSearchResults.map((cardData, index) => (
        <SingleCatalogRow cardData={cardData} key={index} />
      ))}
      {filteredSingleSearchResults.length > 10 && (
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
