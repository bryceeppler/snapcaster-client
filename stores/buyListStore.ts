import { create } from 'zustand';
import axiosInstance from '@/utils/axiosWrapper';

export interface Filter {
  key: string;
  value: string;
}
type BuyListState = {
  dummyStoreData: Filter[];
  dummyConditionData: Filter[];
  dummyFoilData: Filter[];
  dummyRarityData: Filter[];
  dummySetData: Filter[];
  buyListQueryResults: any[];
  individualStoreCart: any[];
  buyListCartData: any[];
  addToCart: (store: string, cardData: any) => void;
  removeFromCart: (store: string, cardData: any) => void;
  clearAllCartItems: () => void;
};

const dummyStoreData: Filter[] = [
  { key: 'obsidian', value: 'Obsidian Games' },
  { key: 'chimera', value: 'Chimera Gaming' },
  { key: 'levelup', value: 'Level Up Games' },
  { key: 'exorgames', value: 'Exor Games' },
  { key: 'mythicstore', value: 'The Mythic Store' }
];
const dummyConditionData: Filter[] = [
  { key: 'nm', value: 'Near Mint' },
  { key: 'lp', value: 'Lightly Played' },
  { key: 'mp', value: 'Moderetly Played' },
  { key: 'hp', value: 'Heavily Played' },
  { key: 'dmg', value: 'Damaged' }
];

const dummyFoilData: Filter[] = [
  { key: 'foil', value: 'Foil' },
  { key: 'nonfoil', value: 'Non Foil' }
];

const dummyRarityData: Filter[] = [
  { key: 'common', value: 'Common' },
  { key: 'uncommon', value: 'Uncommon' },
  { key: 'rare', value: 'Rare' },
  { key: 'mythicrare', value: 'Mythic Rare' }
];

const dummySetData: Filter[] = [
  { key: 'modernhorizons2', value: 'Modern Horizons 2' },
  { key: 'modernhorizons3', value: 'Modern Horizons 3' }
];
const buyListQueryResults: any[] = [
  {
    name: 'Blood Moon - Borderless Anime (WOT)',
    set: 'Wilds of Eldraine: Enchanting Tales',
    foil: 'foil',
    rarity: 'uncommon',
    image:
      'https://store.401games.ca/cdn/shop/files/Blood-Moon-Borderless-Anime-WOT_394x.png?v=1698694124',
    nm: [
      { exor: { cashPrice: 1.0, creditPrice: 2.0 } },
      { levelup: { cashPrice: 3.0, creditPrice: 5.0 } }
    ],
    lp: [
      { exor: { cashPrice: 6.0, creditPrice: 7.0 } },
      { levelup: { cashPrice: 8.0, creditPrice: 9.0 } }
    ],
    mp: [
      { exor: { cashPrice: 10.0, creditPrice: 11.0 } },
      { levelup: { cashPrice: 12.0, creditPrice: 13.0 } }
    ],
    hp: [
      { exor: { cashPrice: 14.0, creditPrice: 15.0 } },
      { levelup: { cashPrice: 16.0, creditPrice: 17.0 } }
    ],
    dmg: []
  },
  {
    name: 'Fury Sliver',
    set: 'Time Spiral',
    foil: 'normal',
    rarity: 'uncommon',
    image:
      'https://store.401games.ca/cdn/shop/files/Fury-Sliver-TSP_394x.jpg?v=1698387902',
    nm: [
      { exor: { cashPrice: 1.0, creditPrice: 2.0 } },
      { levelup: { cashPrice: 3.0, creditPrice: 5.0 } }
    ],
    lp: [
      { exor: { cashPrice: 6.0, creditPrice: 7.0 } },
      { levelup: { cashPrice: 8.0, creditPrice: 9.0 } }
    ],
    mp: [
      { exor: { cashPrice: 10.0, creditPrice: 11.0 } },
      { levelup: { cashPrice: 12.0, creditPrice: 13.0 } }
    ],
    hp: [
      { exor: { cashPrice: 14.0, creditPrice: 15.0 } },
      { levelup: { cashPrice: 16.0, creditPrice: 17.0 } }
    ],
    dmg: []
  },
  {
    name: 'Sol Ring',
    set: 'fallout',
    foil: 'normal',
    rarity: 'uncommon',
    image:
      'https://cdn.shopify.com/s/files/1/0281/4803/9815/files/8b3ceeb4-d497-50b4-ad40-ad2a5bddba6d_c8d89ed9-eea9-4580-8279-fbf26b0ce3da.png?v=1723848976',
    nm: [
      { obsidian: { cashPrice: 1.0, creditPrice: 2.0 } },
      { levelup: { cashPrice: 3.0, creditPrice: 5.0 } }
    ],
    lp: [
      { obsidian: { cashPrice: 6.0, creditPrice: 7.0 } },
      { levelup: { cashPrice: 8.0, creditPrice: 9.0 } }
    ],
    mp: [
      { obsidian: { cashPrice: 10.0, creditPrice: 11.0 } },
      { levelup: { cashPrice: 12.0, creditPrice: 13.0 } }
    ],
    hp: [
      { obsidian: { cashPrice: 14.0, creditPrice: 15.0 } },
      { levelup: { cashPrice: 16.0, creditPrice: 17.0 } }
    ],
    dmg: []
  }
];

const buyListCartData: any[] = [
  {
    exor: [
      {
        name: 'Counterspell',
        set: 'Commander Masters',
        condition: 'nm',
        foil: 'normal',
        quantity: 2,
        cashPrice: 1,
        creditPrice: 2
      },
      {
        name: 'Blood Moon',
        set: 'Eigth Edition',
        condition: 'lp',
        foil: 'foil',
        quantity: 2,
        cashPrice: 2,
        creditPrice: 4
      }
    ]
  },
  {
    levelup: [
      {
        name: 'Counterspell',
        set: 'Commander Masters',
        condition: 'nm',
        foil: 'foil',
        quantity: 4,
        cashPrice: 1,
        creditPrice: 2
      },
      {
        name: 'Blood Moon',
        set: 'Eigth Edition',
        foil: 'foil',
        condition: 'lp',
        quantity: 4,
        cashPrice: 2,
        creditPrice: 4
      }
    ]
  }
];
/**
 * Zustand store for the single search page, including input, results, filtering, and sorting state
 */
const useBuyListStore = create<BuyListState>((set, get) => ({
  dummyStoreData: dummyStoreData,
  dummyConditionData: dummyConditionData,
  dummyFoilData: dummyFoilData,
  dummyRarityData: dummyRarityData,
  dummySetData: dummySetData,
  buyListQueryResults: buyListQueryResults,
  individualStoreCart: [],
  buyListCartData: buyListCartData,

  addToCart(store: string, cardData: any) {
    const currentCartData = get().buyListCartData;

    // Find the store in buyListCartData
    const storeIndex = currentCartData.findIndex((item: any) => item[store]);
    if (storeIndex !== -1) {
      // Get the store's card list
      const storeCart = currentCartData[storeIndex][store];

      // Find the card in the store's array
      const cardIndex = storeCart.findIndex(
        (card: any) =>
          card.name === cardData.name &&
          card.set === cardData.set &&
          card.condition === cardData.condition
      );

      if (cardIndex !== -1) {
        // If card exists, increment the quantity
        storeCart[cardIndex].quantity += 1;
      } else {
        // If card doesn't exist, add it to the store's array
        storeCart.push({ ...cardData, quantity: 1 });
      }
    } else {
      // If store doesn't exist in buyListCartData, add a new store with the card
      currentCartData.push({
        [store]: [{ ...cardData, quantity: 1 }]
      });
    }

    // Update Zustand state with the new cart data
    set({ buyListCartData: [...currentCartData] });
  },

  removeFromCart(store: string, cardData: any) {
    const currentCartData = get().buyListCartData;

    // Find the store in buyListCartData
    const storeIndex = currentCartData.findIndex((item: any) => item[store]);

    if (storeIndex !== -1) {
      const storeCart = currentCartData[storeIndex][store];

      // Find the card in the store's array
      const cardIndex = storeCart.findIndex(
        (card: any) =>
          card.name === cardData.name &&
          card.set === cardData.set &&
          card.condition === cardData.condition
      );

      if (cardIndex !== -1) {
        // Remove or decrement card quantity
        if (storeCart[cardIndex].quantity > 1) {
          storeCart[cardIndex].quantity -= 1;
        } else {
          storeCart.splice(cardIndex, 1);
        }

        // If no cards are left in the store, remove the store from the cart
        if (storeCart.length === 0) {
          currentCartData.splice(storeIndex, 1);
        }

        // Update Zustand state
        set({ buyListCartData: [...currentCartData] });
      }
    }
  },
  clearAllCartItems() {
    set({ buyListCartData: [] });
  }
}));
export default useBuyListStore;
