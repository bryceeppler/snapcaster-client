//hooks and store states
import React from 'react';
import useBuyListStore from '@/stores/useBuylistStore';
//components
import BuylistBodyFactory from './buylist-factory/buylist-body-factory';
import {
  ViewAllOffersHeader,
  SearchResultsHeader,
  FinalSubmissionHeader
} from './header/header';

import { CurrentListHeader } from './header/header';

export default function BuylistCatalog() {
  const { buylistUIState } = useBuyListStore();

  return (
    <div className="flex flex-col gap-1">
      {/* Desktop Header */}
      {(buylistUIState === 'searchResultsState' ||
        buylistUIState === 'listSelectionState') && (
        <>
          <div className="hidden md:block">
            <SearchResultsHeader />
          </div>
          {buylistUIState === 'searchResultsState' && (
            <div className="block md:hidden">
              <CurrentListHeader />
            </div>
          )}
        </>
      )}

      {buylistUIState === 'viewAllOffersState' && (
        <div className="">
          <ViewAllOffersHeader />
        </div>
      )}
      {buylistUIState === 'finalSubmissionState' && (
        <div className="">
          <FinalSubmissionHeader />
        </div>
      )}
      {/* Body */}
      <div className="flex gap-1">
        <BuylistBodyFactory buylistUIState={buylistUIState} />
      </div>
    </div>
  );
}
