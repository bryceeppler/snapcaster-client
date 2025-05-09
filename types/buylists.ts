export interface BuylistItem {
  id: number;
  cardName: string;
  setName: string;
  condition: string;
  condition_name?: string;
  rarity: string;
  foil: string;
  quantity: number;
  purchaseQuantity: number;
  maxPurchaseQuantity: number;
  unableToPurchaseQuantity?: number;
  cashPrice: number;
  creditPrice: number;
  bestCashOffer?: boolean;
  bestCreditOffer?: boolean;
  image: string;
  name?: string;
}

export type BuylistPaymentMethod = 'Cash' | 'Store Credit';

export interface StoreOfferData {
  storeName: string;
  cashSubtotal: string;
  creditSubtotal: string;
  items: BuylistItem[];
  unableToPurchaseItems: BuylistItem[];
}

/**
 * Props for the PriceRow component
 */
export interface PriceRowProps {
  /**
   * Label for the price row (e.g., "Credit", "Cash")
   */
  label: string;

  /**
   * Unit price value
   */
  unitPrice: string | number;

  /**
   * Quantity of items
   */
  quantity: number;

  /**
   * Whether this price is the best offer
   */
  isBestOffer?: boolean | undefined;

  /**
   * Text to display in the tooltip
   */
  tooltipText: string;
}
