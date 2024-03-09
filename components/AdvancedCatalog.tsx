import React from 'react';
import AdvancedCatalogRow from './AdvancedCatalogRow';
import { advancedUseStore } from '@/stores/advancedStore';

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
      {/* if cardData is longer than 10, have a back to top button */}
      {advancedSearchResults.length > 10 && (
        <button
          onClick={() => {
            window.scrollTo(0, 0);
          }}
          className="btn-small mt-4"
        >
          Back to Top
        </button>
      )}
    </div>
  );
}
