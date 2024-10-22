import { create } from 'zustand';
import axios from 'axios';

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
  foilData: DropDownOptions;
  rarityData: DropDownOptions;
  setData: DropDownOptions;
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
  selectedSortBy: string;
  updateSelectedSortBy: (sortByOption: string) => void;
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

const useBuyListStore = create<BuyListState>((set, get) => ({
  foilData: {},
  rarityData: {},
  setData: {},
  buyListQueryResults: [],
  individualStoreCart: [],
  buyListCartData: [],
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
  selectedSortBy: 'best-match',
  updateSelectedSortBy(sortByOption: string) {
    set({ selectedSortBy: sortByOption });
  },

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
      // Remove or decrement card quantity
      if (cardIndex !== -1) {
        if (storeCart[cardIndex].quantity > 1) {
          storeCart[cardIndex].quantity -= 1;
        } else {
          storeCart.splice(cardIndex, 1);
        }

        // If no cards are left in the store, remove the store from the cart
        if (storeCart.length === 0) {
          currentCartData.splice(storeIndex, 1);
        }
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
          rarityData: { Rarity: [] },
          foilData: { Foil: [] },
          setData: { Set: [] },
          showFilters: false,
          selectedTCG: 'mtg'
        });
        break;
      case 'onepiece':
        set({
          rarityData: { Rarity: [] },
          foilData: { Foil: [] },
          setData: { Set: [] },
          showFilters: false,
          selectedTCG: 'onepiece'
        });
        break;
      case 'pokemon':
        set({
          rarityData: { Rarity: [] },
          foilData: { Foil: [] },
          setData: { Set: [] },
          showFilters: false,
          selectedTCG: 'pokemon'
        });
        break;
      case 'lorcana':
        set({
          rarityData: { Rarity: [] },
          foilData: { Foil: [] },
          setData: { Set: [] },
          showFilters: false,
          selectedTCG: 'lorcana'
        });
        break;
      case 'yugioh':
        set({
          rarityData: { Rarity: [] },
          foilData: { Edition: [] },
          setData: { Set: [] },
          showFilters: false,
          selectedTCG: 'yugioh'
        });
        break;
    }
    set({ filtersVisibile: false });
  },

  fetchCards: async () => {
    if (get().searchTerm) {
      const queryParams = new URLSearchParams({
        name: get().searchTerm,
        tcg: get().selectedTCG,
        sortBy: get().selectedSortBy,
        sets: get()
          .selectedSetFilters.map((set) => encodeURIComponent(set))
          .join(','), // Comma-separated values
        foils: get()
          .selectedFoilFilters.map((foil) => encodeURIComponent(foil))
          .join(','), // Comma-separated values
        rarities: get()
          .selectedRarityFilters.map((rarity) => encodeURIComponent(rarity))
          .join(',') // Comma-separated values
      });
      const response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_BUYLISTS_URL
        }/search?${queryParams.toString()}`
      );

      if (response.status !== 200) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      set({ buyListQueryResults: response.data.results.slice(0, 500) });
      set({ filtersVisibile: true });

      const setData = {
        Sets: response.data.sets
          .sort((a: string, b: string) => a.localeCompare(b)) // Sort the sets alphabetically
          .map((item: string) => ({
            key: item,
            value: item
          }))
      };
      const rarityData = {
        Rarity: response.data.rarities
          .sort((a: string, b: string) => a.localeCompare(b)) // Sort the sets alphabetically
          .map((item: string) => ({
            key: item,
            value: item
          }))
      };
      const foilData = {
        Foil: response.data.foils
          .sort((a: string, b: string) => a.localeCompare(b)) // Sort the sets alphabetically
          .map((item: string) => ({
            key: item,
            value: item
          }))
      };
      set({
        setData: setData,
        rarityData: rarityData,
        foilData: foilData
      });
      set({ showFilters: true });
    }
  },

  setSearchTerm(searchBoxValue: string) {
    set({ searchTerm: searchBoxValue });
  }
}));
export default useBuyListStore;
