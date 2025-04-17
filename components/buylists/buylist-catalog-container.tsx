import React from 'react';
import useBuyListStore from '@/stores/useBuylistStore';
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
    <div className="flex min-h-svh  flex-col  ">
      {/* Desktop Header */}
      {(buylistUIState === 'searchResultsState' ||
        buylistUIState === 'listSelectionState') && (
        <div className="z-30  bg-background md:sticky md:top-[114px]">
          <div className=" hidden md:block">
            <SearchResultsHeader />
            <div className="bg-background pb-1"></div>
          </div>
          {buylistUIState === 'searchResultsState' && (
            <div className="block md:hidden">
              <CurrentListHeader />
              <div className="bg-background pb-1"></div>
            </div>
          )}
        </div>
      )}

      {buylistUIState === 'viewAllOffersState' && (
        <div className="z-30  bg-background md:sticky md:top-[114px]">
          <ViewAllOffersHeader />
          <div className="bg-background pb-1"></div>
        </div>
      )}
      {buylistUIState === 'finalSubmissionState' && (
        <div className="z-30  bg-background md:sticky md:top-[114px]">
          <FinalSubmissionHeader />
          <div className="bg-background pb-1"></div>
        </div>
      )}
      {/* Body */}
      <div className="flex flex-1 gap-1">
        <BuylistBodyFactory buylistUIState={buylistUIState} />
      </div>
    </div>
  );
}
