import { create } from 'zustand';
import axios from 'axios';
import axiosInstance from '@/utils/axiosWrapper';
import { StringToBoolean } from 'class-variance-authority/dist/types';

export interface Filter {
  key: string;
  value: string;
}

export interface BuyListQueryResults {
  name: string ;
  set: any;
  foil: any;
  rarity: any;
  image:string;
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
  dummyStoreData: DropDownOptions;
  dummyConditionData: DropDownOptions;
  dummyFoilData: DropDownOptions;
  dummyRarityData: DropDownOptions;
  dummySetData: DropDownOptions;
  buyListQueryResults: BuyListQueryResults[];
  individualStoreCart: any[];
  buyListCartData: any[];
  addToCart: (store: string, cardData: any) => void;
  removeFromCart: (store: string, cardData: any) => void;
  clearAllCartItems: () => void;
  selectedStoreFilters: any[];
  selectedConditionFilters: any[];
  selectedFoilFilters: any[];
  selectedRarityFilters: any[];
  selectedSetFilters: any[];
  updateSelectedStoreFilters: (filters: string[]) => void;
  updateSelectedConditionFilters: (filters: string[]) => void;
  updateSelectedFoilFilters: (filters: string[]) => void;
  updateSelectedRarityFilters: (filters: string[]) => void;
  updateSelectedSetFilters: (filters: string[]) => void;
  atLeastOneFilter: boolean;
  checkAtleastOneFilter: () => void;
  resetAllFilters: () => void;
  selectedTCG: string;
  changeTCG: (tcg: string) => void;
  searchTerm: string;
  setSearchTerm: (searchBoxValue:string) => void;
  fetchCards: () => void;
  filtersVisibile:boolean;

};

const dummyStoreData: DropDownOptions = {
  Stores: [
    { key: 'obsidian', value: 'Obsidian Games' },
    { key: 'chimera', value: 'Chimera Gaming' },
    { key: 'levelup', value: 'Level Up Games' },
    { key: 'exorgames', value: 'Exor Games' },
    { key: 'mythicstore', value: 'The Mythic Store' }
  ]
};
const dummyConditionData: DropDownOptions = {
  Condition: [
    { key: 'nm', value: 'Near Mint' },
    { key: 'lp', value: 'Lightly Played' },
    { key: 'mp', value: 'Moderetly Played' },
    { key: 'hp', value: 'Heavily Played' },
    { key: 'dmg', value: 'Damaged' }
  ]
};

const dummyMTGFoilData: DropDownOptions = {
  Foil: [
    { key: 'foil', value: 'Foil' },
    { key: 'normal', value: 'Normal' }
  ]
};

const dummyPokemonFoilData: DropDownOptions = {
  Foil: [
    { key: 'foil', value: 'Foil' },
    { key: 'normal', value: 'Normal' }
  ]
};

const dummyLorcanaFoilData: DropDownOptions = {
  Foil: [
    { key: 'foil', value: 'Foil' },
    { key: 'normal', value: 'Normal' }
  ]
};

const dummyYugiohFoilData: DropDownOptions = {
  Edition: [
    { key: 'foil', value: 'Foil' },
    { key: 'normal', value: 'Normal' }
  ]
};

const dummyOnePieceFoilData: DropDownOptions = {
  Foil: [
    { key: 'foil', value: 'Foil' },
    { key: 'normal', value: 'Normal' }
  ]
};

const dummyMTGRarityData: DropDownOptions = {
  Rarirty: [
    { key: 'common', value: 'Common' },
    { key: 'uncommon', value: 'Uncommon' },
    { key: 'rare', value: 'Rare' },
    { key: 'mythicrare', value: 'Mythic Rare' }
  ]
};

const dummyOnePieceRarityData: DropDownOptions = {
  Rarirty: [
    { key: 'common', value: 'Common' },
    { key: 'uncommon', value: 'Uncommon' },
    { key: 'rare', value: 'Rare' },
    { key: 'superrare', value: 'Super Rare' },
    { key: 'secretrare', value: 'Secret Rare' },
    { key: 'promo', value: 'Promo' },
    { key: 'leader', value: 'Leader' },
    { key: 'don', value: 'DON!!' }
  ]
};

const dummyPokemonRarityData: DropDownOptions = {
  Rarirty: [
    { key: 'common', value: 'Common' },
    { key: 'uncommon', value: 'Uncommon' },
    { key: 'rare', value: 'Rare' },
    { key: 'holorare', value: 'Holo Rare' },
    { key: 'secretrare', value: 'Secret Rare' },
    { key: 'shinyrare', value: 'Shiny Rare' },
    { key: 'shinyultrarare', value: 'Shiny Ultra Rare' },
    { key: 'doublerare', value: 'Double Rare' },
    { key: 'hyperrare', value: 'Hyper Rare' },
    { key: 'illustrationrare', value: 'Illustration Rare' },
    { key: 'specialillustrationrare', value: 'Special Illustration Rare' },
    { key: 'raidiantrare', value: 'Radiant Rare' },
    { key: 'blackstarpromo', value: 'Black Star Promo' },
    { key: 'rareace', value: 'Rare Ace' },
    { key: 'promo', value: 'Promo' },
    { key: 'unspecified', value: 'Unspecified' }
  ]
};

const dummyLorcanaRarityData: DropDownOptions = {
  Rarirty: [
    { key: 'common', value: 'Common' },
    { key: 'uncommon', value: 'Uncommon' },
    { key: 'rare', value: 'Rare' },
    { key: 'superrare', value: 'Super Rare' },
    { key: 'legendary', value: 'Legendary' },
    { key: 'enchanted', value: 'Enchanted' },
    { key: 'promo', value: 'Promo' }
  ]
};

const dummyYugiohRarityData: DropDownOptions = {
  Rarirty: [
    { key: 'common', value: 'Common' },
    { key: 'superrare', value: 'Super Rare' },
    { key: 'rare', value: 'Rare' },
    { key: 'ultra rare', value: 'Ultra Rare' },
    { key: 'secretrare', value: 'Secret Rare' },
    { key: 'ultimaterare', value: 'Ultimate Rare' },
    { key: 'starfoilrare', value: 'Starfoil Rare' },
    { key: 'goldrare', value: 'Gold Rare' },
    { key: 'mosaicrare', value: 'Mosaic Rare' },
    { key: 'quartercenturysecretrare', value: 'Quarter Century Secret Rare' },
    { key: 'shatterfoilrare', value: 'Shatterfoil Rare' },
    { key: 'prismaticsecretrare', value: 'Prismatic Secret Rare' },
    { key: 'collectorsrare', value: "Collector's Rare" },
    { key: 'prismaticultimaterare', value: 'Prismatic Ultimate Rare' },
    { key: 'prismaticcollectorsrare', value: "Prismatic Collector's Rare" },
    { key: 'platinumsecretrare', value: 'Platinum Secret Rare' },
    { key: 'goldsecretrare', value: 'Gold Secret Rare' },
    { key: 'parallelrare', value: 'Parallel Rare' },
    { key: 'starlightrare', value: 'Starlight Rare' },
    { key: 'ghostrare', value: 'Ghost Rare' },
    { key: 'promo', value: 'Promo' },
    { key: 'shoirtprint', value: 'Short Print' },
    { key: 'platinumrare', value: 'Platinum Rare' },
    { key: 'ghostgoldrare', value: 'Ghost/Gold Rare' },
    { key: '10000secretrare', value: '10000 Secret Rare' }
  ]
};

const dummySetData: DropDownOptions = {
  Set: [
    { key: 'modernhorizons2', value: 'Modern Horizons 2' },
    { key: 'modernhorizons3', value: 'Modern Horizons 3' }
  ]
};

const buyListQueryResultsDummyData: BuyListQueryResults[] = [
  {
    name: 'Blood Moon - Borderless Anime (WOT)',
    set: 'Wilds of Eldraine: Enchanting Tales',
    foil: 'Foil',
    rarity: 'uncommon',
    image:
      'https://store.401games.ca/cdn/shop/files/Blood-Moon-Borderless-Anime-WOT_394x.png?v=1698694124',
    nm: {
      exorgames: { cashPrice: 1.0, creditPrice: 2.0 },
      levelup: { cashPrice: 3.0, creditPrice: 5.0 }
    },
    lp: {
      exorgames: { cashPrice: 6.0, creditPrice: 7.0 },
      levelup: { cashPrice: 8.0, creditPrice: 9.0 }
    },
    mp: {
      exorgames: { cashPrice: 10.0, creditPrice: 11.0 },
      levelup: { cashPrice: 12.0, creditPrice: 13.0 }
    },
    hp: {
      exorgames: { cashPrice: 14.0, creditPrice: 15.0 },
      levelup: { cashPrice: 16.0, creditPrice: 17.0 }
    }
  },
  {
    name: 'Fury Sliver',
    set: 'Time Spiral',
    foil: 'Normal',
    rarity: 'uncommon',
    image:
      'https://store.401games.ca/cdn/shop/files/Fury-Sliver-TSP_394x.jpg?v=1698387902',
    nm: {
      exorgames: { cashPrice: 1.0, creditPrice: 2.0 },
      levelup: { cashPrice: 3.0, creditPrice: 5.0 }
    },
    lp: {
      exorgames: { cashPrice: 6.0, creditPrice: 7.0 },
      levelup: { cashPrice: 8.0, creditPrice: 9.0 }
    },
    mp: {
      exorgames: { cashPrice: 10.0, creditPrice: 11.0 },
      levelup: { cashPrice: 12.0, creditPrice: 13.0 }
    },
    hp: {
      exorgames: { cashPrice: 14.0, creditPrice: 15.0 },
      levelup: { cashPrice: 16.0, creditPrice: 17.0 }
    }
  },
  {
    name: 'Sol Ring',
    set: 'fallout',
    foil: 'Normal',
    rarity: 'uncommon',
    image:
      'https://cdn.shopify.com/s/files/1/0281/4803/9815/files/8b3ceeb4-d497-50b4-ad40-ad2a5bddba6d_c8d89ed9-eea9-4580-8279-fbf26b0ce3da.png?v=1723848976',
    nm: {
      obsidian: { cashPrice: 1.0, creditPrice: 2.0 },
      levelup: { cashPrice: 3.0, creditPrice: 5.0 }
    },
    lp: {
      obsidian: { cashPrice: 6.0, creditPrice: 7.0 },
      levelup: { cashPrice: 8.0, creditPrice: 9.0 }
    },
    mp: {
      obsidian: { cashPrice: 10.0, creditPrice: 11.0 },
      levelup: { cashPrice: 12.0, creditPrice: 13.0 }
    },
    hp: {
      obsidian: { cashPrice: 14.0, creditPrice: 15.0 },
      levelup: { cashPrice: 16.0, creditPrice: 17.0 }
    },
  }
];

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

/**
 * Zustand store for the single search page, including input, results, filtering, and sorting state
 */
const useBuyListStore = create<BuyListState>((set, get) => ({
  dummyStoreData: dummyStoreData,
  dummyConditionData: dummyConditionData,
  dummyFoilData: dummyMTGFoilData,
  dummyRarityData: dummyMTGRarityData,
  dummySetData: dummySetData,
  buyListQueryResults: buyListQueryResultsDummyData,
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
  filtersVisibile:false,
  updateSelectedStoreFilters(filters: string[]) {
    set({ selectedStoreFilters: filters });
  },
  updateSelectedConditionFilters(filters: string[]) {
    set({ selectedStoreFilters: filters });
  },
  updateSelectedFoilFilters(filters: string[]) {
    set({ selectedStoreFilters: filters });
  },
  updateSelectedRarityFilters(filters: string[]) {
    set({ selectedStoreFilters: filters });
  },
  updateSelectedSetFilters(filters: string[]) {
    set({ selectedStoreFilters: filters });
  },
  checkAtleastOneFilter() {
    if (get().selectedStoreFilters.length !== 0) {
      set({ atLeastOneFilter: true });
      return;
    }
    if (get().selectedConditionFilters.length !== 0) {
      set({ atLeastOneFilter: true });
      return;
    }
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
    set({ selectedStoreFilters: [] });
    set({ selectedConditionFilters: [] });
    set({ selectedFoilFilters: [] });
    set({ selectedRarityFilters: [] });
    set({ selectedSetFilters: [] });
    set({ atLeastOneFilter: false });
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
  },
  changeTCG(tcg: string) {
    //clear selected filters (will need to do for the other options down the line too)
    // set({ selectedRarityFilters: [] });
    switch (tcg) {
      case 'mtg':
        set({ dummyRarityData: dummyMTGRarityData });
        set({ dummyFoilData: dummyMTGFoilData });
        set({ selectedTCG: 'mtg' });
        break;
      case 'onepiece':
        set({ dummyRarityData: dummyOnePieceRarityData });
        set({ dummyFoilData: dummyOnePieceFoilData });
        set({ selectedTCG: 'onepiece' });
        break;
      case 'pokemon':
        set({ dummyRarityData: dummyPokemonRarityData });
        set({ dummyFoilData: dummyPokemonFoilData });
        set({ selectedTCG: 'pokemon' });
        break;
      case 'lorcana':
        set({ dummyRarityData: dummyLorcanaRarityData });
        set({ dummyFoilData: dummyLorcanaFoilData });
        set({ selectedTCG: 'lorcana' });
        break;
      case 'yugioh':
        set({ dummyRarityData: dummyYugiohRarityData });
        set({ dummyFoilData: dummyYugiohFoilData });
        set({ selectedTCG: 'yugioh' });
        break;
    }
    set({filtersVisibile:false})
  },
  fetchCards: async () =>{
    const queryParams = new URLSearchParams({
      name:get().searchTerm,
      tcg:get().selectedTCG
    });
    // Fetch data from the API
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BUYLISTS_URL}/search?${queryParams.toString()}`
    );

    if (response.status !== 200) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const x:BuyListQueryResults[]  = response.data.results;

    set({buyListQueryResults:x.slice(0, 100)})
    set({filtersVisibile:true})
    
  },
  setSearchTerm (searchBoxValue:string){
    set({searchTerm:searchBoxValue});
  }
}));
export default useBuyListStore;
