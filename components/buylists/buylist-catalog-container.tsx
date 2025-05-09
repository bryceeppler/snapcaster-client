import { useEffect } from 'react';

import { BuylistSearchResults } from './search-results/search-results';
import { BuylistStoreOffers } from './store-offers/store-offers-body';
import { SubmitOffer } from './store-offers/submit-offer-body';

import useBuyListStore from '@/stores/useBuylistStore';

export default function BuylistCatalog() {
  const { buylistUIState, currentCartId, setAllCartsData } = useBuyListStore();

  // Fetch offers data when switching to offers view
  useEffect(() => {
    if (buylistUIState === 'viewAllOffersState' && currentCartId) {
      setAllCartsData(currentCartId);
    }
  }, [buylistUIState, currentCartId]);

  // Render the appropriate content based on the UI state
  const renderContent = () => {
    switch (buylistUIState) {
      case 'listSelectionState':
      case 'searchResultsState':
        return <BuylistSearchResults />;
      case 'viewAllOffersState':
        return <BuylistStoreOffers />;
      case 'finalSubmissionState':
        return <SubmitOffer />;
      default:
        return <BuylistSearchResults />;
    }
  };

  return <div className="w-full">{renderContent()}</div>;
}
