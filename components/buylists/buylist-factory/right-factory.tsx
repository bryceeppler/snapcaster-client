//hooks and store states
import { LeftUIState } from '@/stores/useBuylistStore';
//components
import { BuylistSearchResults } from '../search-results/search-results';
import { BuylistStoreOffers } from '../store-offers/store-offers';
import { BuylistStoreOfferBreakdown } from '../store-offers/store-offers-submission-details';
import { LeftCartEditWithViewOffers } from '../modify-list-items/modify-list-items';
//other
interface BuylistRightSideBodyProps {
  leftUIState: LeftUIState;
}

const BuylistRightSideBodyFactory = ({
  leftUIState
}: BuylistRightSideBodyProps) => {
  switch (leftUIState) {
    case 'leftCartListSelection':
      return <BuylistSearchResults />;
    case 'cart':
      return <BuylistSearchResults />;
    case 'leftCartEditWithViewOffers':
      return <BuylistSearchResults />;
    case 'leftCartEdit':
      return <BuylistStoreOffers />;
    case 'leftSubmitOffer':
      return <BuylistStoreOfferBreakdown />;
    // case 'cart':
    //   return <LeftCartEditWithViewOffers />;
  }
};

export default BuylistRightSideBodyFactory;
