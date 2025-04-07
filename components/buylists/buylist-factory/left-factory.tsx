//hooks and store states
import { LeftUIState } from '@/stores/useBuylistStore';
//components
import { LeftCartListSelection } from '../saved-lists/saved-lists';
import { LeftCartEditWithViewOffers } from '../modify-list-items/modify-list-items';
import { LeftSubmitOffer } from '../store-offers/submit-offer-container';
//other
interface BuylistLeftSideBodyProps {
  leftUIState: LeftUIState;
}

const BuylistLeftSideBodyFactory = ({
  leftUIState
}: BuylistLeftSideBodyProps) => {
  switch (leftUIState) {
    case 'leftCartListSelection':
      return <LeftCartListSelection />;
    case 'leftCartEditWithViewOffers':
      return <LeftCartEditWithViewOffers />;
    case 'leftCartEdit':
      return <LeftCartEditWithViewOffers />;
    case 'leftSubmitOffer':
      return <LeftSubmitOffer />;
  }
};

export default BuylistLeftSideBodyFactory;
