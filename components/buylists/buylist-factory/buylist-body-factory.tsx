//hooks and store states
import { BuylistUIState } from '@/stores/useBuylistStore';
//components
import { BuylistSearchResults } from '../search-results/search-results';
import { BuylistStoreOffers } from '../store-offers/store-offers-body';
import { BuylistStoreOfferBreakdown } from '../store-offers/store-offers-offer-breakdown';

interface IBuylistBodyFactoryProps {
  buylistUIState: BuylistUIState;
}

const BuylistBodyFactory = ({ buylistUIState }: IBuylistBodyFactoryProps) => {
  switch (buylistUIState) {
    case 'listSelectionState':
      return <BuylistSearchResults />;
    case 'searchResultsState':
      return <BuylistSearchResults />;
    case 'viewAllOffersState':
      return <BuylistStoreOffers />;
    case 'finalSubmissionState':
      return <BuylistStoreOfferBreakdown />;
  }
};

export default BuylistBodyFactory;
