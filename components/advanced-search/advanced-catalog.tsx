import React from 'react';
import AdvancedCatalogRow from './advanced-catalog-row';
import { advancedUseStore } from '@/stores/advancedStore';
import BackToTopButton from '../ui/back-to-top-btn';
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
          <AdvancedCatalogRow
            tcg="mtg"
            cardData={cardData}
          ></AdvancedCatalogRow>
        </div>
      ))}
      <BackToTopButton />
    </div>
  );
}
