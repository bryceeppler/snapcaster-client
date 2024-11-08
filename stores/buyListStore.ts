import { create } from 'zustand';
import axios from 'axios';
import { Tcg, BuyListQueryCard,BuyListCartStoreData,BuyListCartCardData } from '@/types/product';

interface DropDownOptions {
  [key: string]: { key: string; value: string }[];
}

type BuyListState = {
  foilData: DropDownOptions;
  rarityData: DropDownOptions;
  setData: DropDownOptions;
  buyListQueryResults: BuyListQueryCard[];
  buyListCartData: BuyListCartStoreData[];
  showFilters: boolean;
  maxResultsPerPage: number;
  currentPage: number;
  totalPages:number ;
  resultsTotal:number ;
  setCurrentPage: (currentPage: number) => void;
  addToCart: (store: string, cardData: BuyListCartCardData) => void;
  removeFromCart: (store: string, cardData: BuyListCartCardData) => void;
  clearAllCartItems: () => void;
  selectedFoilFilters: string[];
  selectedRarityFilters: string[];
  selectedSetFilters: string[];
  selectedSortBy: string;
  updateSelectedSortBy: (sortByOption: string) => void;
  updateSelectedFoilFilters: (filters: string[]) => void;
  updateSelectedRarityFilters: (filters: string[]) => void;
  updateSelectedSetFilters: (filters: string[]) => void;
  atLeastOneFilter: boolean;
  checkAtleastOneFilter: () => void;
  resetAllFilters: () => void;
  selectedTCG: Tcg;
  changeTCG: (tcg: Tcg) => void;
  searchTerm: string;
  setSearchTerm: (searchBoxValue: string) => void;
  fetchCards: () => void;
};

const useBuyListStore = create<BuyListState>((set, get) => ({
  foilData: {},
  rarityData: {},
  setData: {},
  buyListQueryResults: [],
  buyListCartData: [],
  selectedStoreFilters: [],
  selectedConditionFilters: [],
  selectedFoilFilters: [],
  selectedRarityFilters: [],
  selectedSetFilters: [],
  atLeastOneFilter: false,
  selectedTCG: 'mtg',
  searchTerm: '',
  showFilters: false,
  maxResultsPerPage: 100,
  currentPage: 1,
  totalPages:0,
  resultsTotal:0,
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
  changeTCG(tcg: Tcg) {
    // reset query results, filters, tcg category, and pagination states
    set({
      buyListQueryResults: [],
      rarityData: { Rarity: [] },
      foilData: { Foil: [] },
      setData: { Set: [] },
      showFilters: false,
      selectedTCG: tcg,
      currentPage:1,
      totalPages:0,
      resultsTotal:0
    });
  },

  fetchCards: async () => {
    if (get().searchTerm) {
      const queryParams = new URLSearchParams({
        name: get().searchTerm,
        tcg: get().selectedTCG,
        sortBy: get().selectedSortBy,
        pageNumber:get().currentPage.toString(),
        maxResultsPerPage:get().maxResultsPerPage.toString(),
        sets: get()
          .selectedSetFilters.map((set) => encodeURIComponent(set))
          .join(','),
        foils: get()
          .selectedFoilFilters.map((foil) => encodeURIComponent(foil))
          .join(','),
        rarities: get()
          .selectedRarityFilters.map((rarity) => encodeURIComponent(rarity))
          .join(',')
      });

      const response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_BUYLISTS_URL
        }/search?${queryParams.toString()}`
      );

      if (response.status !== 200) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const setData = {
        Sets: response.data.sets
          .sort((a: string, b: string) => a.localeCompare(b))
          .map((item: string) => ({
            key: item,
            value: item
          }))
      };
      const rarityData = {
        Rarity: response.data.rarities
          .sort((a: string, b: string) => a.localeCompare(b))
          .map((item: string) => ({
            key: item,
            value: item
          }))
      };
      const foilData = {
        Foil: response.data.foils
          .sort((a: string, b: string) => a.localeCompare(b))
          .map((item: string) => ({
            key: item,
            value: item
          }))
      };
      set({
        buyListQueryResults: response.data.results.slice(0, 500),
        totalPages:response.data.pagination.numPages,
        resultsTotal:response.data.pagination.numResults,
        setData: setData,
        rarityData: rarityData,
        foilData: foilData,
        showFilters: true,
      });
    }
  },

  setSearchTerm(searchBoxValue: string) {
    set({ searchTerm: searchBoxValue });
  },
  setCurrentPage(currentPage:number){
    set({currentPage:currentPage})
  }

}));
export default useBuyListStore;
