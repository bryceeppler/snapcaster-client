import { BuylistUIState } from '@/stores/useBuylistStore';
import { BuylistSearchResults } from '../search-results/search-results';
import { BuylistStoreOffers } from '../store-offers/store-offers-body';
import { SubmitOffer } from '../store-offers/submit-offer-body';

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
      return <SubmitOffer />;
  }
};

export default BuylistBodyFactory;
