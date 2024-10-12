import { create } from 'zustand';
import axios from 'axios';
import axiosInstance from '@/utils/axiosWrapper';
import { StringToBoolean } from 'class-variance-authority/dist/types';

export interface Filter {
  key: string;
  value: string;
}

export interface BuyListQueryResults {
  name: string;
  set: any;
  foil: any;
  rarity: any;
  image: string;
  nm?: any;
  lp?: any;
  mp?: any;
  hp?: any;
  dmg?: any;
}

export interface DropDownOptions {
  [key: string]: { key: string; value: string }[];
}
type BuyListState = {
  dummyFoilData: DropDownOptions;
  dummyRarityData: DropDownOptions;
  dummySetData: DropDownOptions;
  buyListQueryResults: BuyListQueryResults[];
  individualStoreCart: any[];
  buyListCartData: any[];
  showFilters: boolean;
  addToCart: (store: string, cardData: any) => void;
  removeFromCart: (store: string, cardData: any) => void;
  clearAllCartItems: () => void;
  selectedFoilFilters: any[];
  selectedRarityFilters: any[];
  selectedSetFilters: any[];
  updateSelectedFoilFilters: (filters: string[]) => void;
  updateSelectedRarityFilters: (filters: string[]) => void;
  updateSelectedSetFilters: (filters: string[]) => void;
  atLeastOneFilter: boolean;
  checkAtleastOneFilter: () => void;
  resetAllFilters: () => void;
  selectedTCG: string;
  changeTCG: (tcg: string) => void;
  searchTerm: string;
  setSearchTerm: (searchBoxValue: string) => void;
  fetchCards: () => void;
  filtersVisibile: boolean;
};

const buyListCartData: any[] = [
  {
    exorgames: [
      {
        name: 'Blood Moon - Borderless Anime (WOT)',
        set: 'Wilds of Eldraine: Enchanting Tales',
        condition: 'nm',
        foil: 'Foil',
        quantity: 2,
        cashPrice: 1,
        creditPrice: 2
      },
      {
        name: 'Fury Sliver',
        set: 'Time Spiral',
        condition: 'lp',
        foil: 'Normal',
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
        foil: 'Foil',
        quantity: 4,
        cashPrice: 1,
        creditPrice: 2
      },
      {
        name: 'Blood Moon',
        set: 'Eigth Edition',
        foil: 'Foil',
        condition: 'lp',
        quantity: 4,
        cashPrice: 2,
        creditPrice: 4
      }
    ]
  }
];

const useBuyListStore = create<BuyListState>((set, get) => ({
  dummyFoilData: {},
  dummyRarityData: {},
  dummySetData: {},
  buyListQueryResults: [],
  individualStoreCart: [],
  buyListCartData: buyListCartData,
  selectedStoreFilters: [],
  selectedConditionFilters: [],
  selectedFoilFilters: [],
  selectedRarityFilters: [],
  selectedSetFilters: [],
  atLeastOneFilter: false,
  selectedTCG: 'mtg',
  searchTerm: '',
  filtersVisibile: false,
  showFilters: false,

  updateSelectedFoilFilters(filters: string[]) {
    set({ selectedFoilFilters: filters });
  },
  updateSelectedRarityFilters(filters: string[]) {
    set({ selectedRarityFilters: filters });
  },
  updateSelectedSetFilters(filters: string[]) {
    set({ selectedSetFilters: filters });
  },
  checkAtleastOneFilter() {
    if (get().selectedFoilFilters.length !== 0) {
      set({ atLeastOneFilter: true });
      return;
    }
    if (get().selectedRarityFilters.length !== 0) {
      set({ atLeastOneFilter: true });
      return;
    }
    if (get().selectedSetFilters.length !== 0) {
      set({ atLeastOneFilter: true });
      return;
    }
    set({ atLeastOneFilter: false });
  },
  resetAllFilters() {
    set({
      selectedFoilFilters: [],
      selectedRarityFilters: [],
      selectedSetFilters: [],
      atLeastOneFilter: false
    });
  },
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
          card.condition === cardData.condition &&
          card.foil === cardData.foil &&
          card.rarity === cardData.rarity
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
          card.condition === cardData.condition &&
          card.foil === cardData.foil &&
          card.rarity === cardData.rarity
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
  },
  changeTCG(tcg: string) {
    set({ buyListQueryResults: [] });
    switch (tcg) {
      case 'mtg':
        set({
          dummyRarityData: { Rarity: [] },
          dummyFoilData: { Foil: [] },
          dummySetData: { Set: [] },
          showFilters: false,
          selectedTCG: 'mtg'
        });
        break;
      case 'onepiece':
        set({
          dummyRarityData: { Rarity: [] },
          dummyFoilData: { Foil: [] },
          dummySetData: { Set: [] },
          showFilters: false,
          selectedTCG: 'onepiece'
        });
        break;
      case 'pokemon':
        set({
          dummyRarityData: { Rarity: [] },
          dummyFoilData: { Foil: [] },
          dummySetData: { Set: [] },
          showFilters: false,
          selectedTCG: 'pokemon'
        });
        break;
      case 'lorcana':
        set({
          dummyRarityData: { Rarity: [] },
          dummyFoilData: { Foil: [] },
          dummySetData: { Set: [] },
          showFilters: false,
          selectedTCG: 'lorcana'
        });
        break;
      case 'yugioh':
        set({
          dummyRarityData: { Rarity: [] },
          dummyFoilData: { Edition: [] },
          dummySetData: { Set: [] },
          showFilters: false,
          selectedTCG: 'yugioh'
        });
        break;
    }
    set({ filtersVisibile: false });
  },

  fetchCards: async () => {
    const queryParams = new URLSearchParams({
      name: get().searchTerm,
      tcg: get().selectedTCG
    });
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BUYLISTS_URL}/search?${queryParams.toString()}`
    );

    if (response.status !== 200) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    set({ buyListQueryResults: response.data.results.slice(0, 500) });
    set({ filtersVisibile: true });

    const setData = {
      Sets: response.data.sets.map((item: string) => ({
        key: item.toLowerCase(),
        value: item
      }))
    };
    const rarityData = {
      Rarity: response.data.rarities.map((item: string) => ({
        key: item.toLowerCase(),
        value: item
      }))
    };
    const foilData = {
      Foil: response.data.foils.map((item: string) => ({
        key: item.toLowerCase(),
        value: item
      }))
    };
    set({
      dummySetData: setData,
      dummyRarityData: rarityData,
      dummyFoilData: foilData
    });
    set({ showFilters: true });
  },
  setSearchTerm(searchBoxValue: string) {
    set({ searchTerm: searchBoxValue });
  }
}));
export default useBuyListStore;
