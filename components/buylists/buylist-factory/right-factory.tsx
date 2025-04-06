import useBuyListStore, { LeftUIState } from '@/stores/useBuylistStore';

import { BuylistSearchResults } from '../search-results/search-results';
import { BuylistStoreOffers } from '../store-offers/store-offers';
import { BuylistStoreOfferBreakdown } from '../store-offers/store-offers-submission-details';
// // Define a props interface
interface BuylistRightSideBodyProps {
  leftUIState: LeftUIState;
}

{
}

const BuylistRightSideBodyFactory = ({
  leftUIState
}: BuylistRightSideBodyProps) => {
  switch (leftUIState) {
    case 'leftCartListSelection':
      return <BuylistSearchResults />;
    case 'leftCartEditWithViewOffers':
      return <BuylistSearchResults />;
    case 'leftCartEdit':
      return <BuylistStoreOffers />;
    case 'leftSubmitOffer':
      return <BuylistStoreOfferBreakdown />;
  }
};

export default BuylistRightSideBodyFactory;
