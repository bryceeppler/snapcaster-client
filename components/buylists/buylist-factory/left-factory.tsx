import useBuyListStore, { LeftUIState } from '@/stores/useBuylistStore';
import {
  LeftCartEditWithViewOffers,
  LeftCartListSelection,
  LeftSubmitOffer
} from '../buylist-left-side-body';

// Define a props interface
interface BuylistLeftSideBodyProps {
  leftUIState: LeftUIState;
}

// Update the component to use props
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
    default:
      return null; // Add a default case
  }
};
export default BuylistLeftSideBodyFactory;
