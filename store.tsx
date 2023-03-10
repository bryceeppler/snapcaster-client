import { create } from 'zustand';
import axios from 'axios';

export interface SingleSearchResult {
  name: string;
  link: string;
  image: string;
  set: string;
  condition: string;
  foil: boolean;
  price: number;
  website: string;
}

export type MultiSearchCard = {
  cardName: string;
  variants: SingleSearchResult[];
}

export type MultiSearchCardState = {
  cardName: string;
  variants: SingleSearchResult[];
  selectedVariant: SingleSearchResult;
  selected: boolean;
}

// type MultiSearchResult = 
export interface Website {
  name: string;
  code: string;
  image: string;
}
const websites: Website[] = [
  {
    name: 'Aether Vault Games',
    code: 'aethervault',
    image: ''
  },
  {
    name: 'Atlas Collectables',
    code: 'atlas',
    image: ''
  },
  {
    name: 'Border City Games',
    code: 'bordercity',
    image: ''
  },
  {
    name: 'The Connection Games',
    code: 'connectiongames',
    image: ''
  },
  {
    name: 'Enter the Battlefield',
    code: 'enterthebattlefield',
    image: ''
  },
  {
    name: 'Everything Games',
    code: 'everythinggames',
    image: ''
  },
  {
    name: 'Exor Games',
    code: 'exorgames',
    image: ''
  },
  {
    name: 'Face to Face Games',
    code: 'facetoface',
    image: ''
  },
  {
    name: 'Fantasy Forged Games',
    code: 'fantasyforged',
    image: ''
  },
  {
    name: 'FirstPlayer',
    code: 'firstplayer',
    image: ''
  },
  {
    name: '401 Games',
    code: 'four01',
    image: ''
  },
  {
    name: 'Fusion Gaming',
    code: 'fusion',
    image: ''
  },
  {
    name: 'GameKnight',
    code: 'gameknight',
    image: ''
  },
  {
    name: 'Gamezilla',
    code: 'gamezilla',
    image: ''
  },
  {
    name: 'Gauntlet Games',
    code: 'gauntlet',
    image: ''
  },
  {
    name: 'Hairy Tarantula',
    code: 'hairyt',
    image: ''
  },
  {
    name: 'House of Cards',
    code: 'houseofcards',
    image: ''
  },
  {
    name: 'Jeux 3 Dragons',
    code: 'jeux3dragons',
    image: ''
  },
  {
    name: 'Manaforce',
    code: 'manaforce',
    image: ''
  },
  {
    name: 'Magic Stronghold',
    code: 'magicstronghold',
    image: ''
  },
  {
    name: 'Orchard City Games',
    code: 'orchardcity',
    image: ''
  },
  {
    name: 'Sequence Gaming Brockville',
    code: 'sequencegaming',
    image: ''
  },
  {
    name: 'The Comic Hunter',
    code: 'thecomichunter',
    image: ''
  },
  {
    name: 'Topdeck Hero',
    code: 'topdeckhero',
    image: ''
  },
  {
    name: "Wizard's Tower (kanatacg)",
    code: 'kanatacg',
    image: ''
  }
];

type State = {
  websites: Website[];
  singleSearchInput: string;
  setSingleSearchInput: (singleSearchInput: string) => void;
  singleSearchQuery: string;
  setSingleSearchQuery: (singleSearchQuery: string) => void;

  multiSearchInput: string;
  multiSearchQuery: string;
  multiSearchSelectedWebsites: string[];
  toggleMultiSearchSelectedWebsites: (website: string) => void;
  setMultiSearchInput: (multiSearchInput: string) => void;
  setMultiSearchQuery: (multiSearchQuery: string) => void;
  singleSearchOrderBy: string;
  setSingleSearchOrderBy: (singleSearchOrderBy: string) => void;
  singleSearchOrder: string;
  setSingleSearchOrder: (singleSearchOrder: string) => void;
  toggleSelectMultiSearchCard: (cardName: string) => void;
  singleSearchResults: SingleSearchResult[];
  setSingleSearchResults: (singleSearchResults: SingleSearchResult[]) => void;

  showSingleSearchFilters: boolean;
  toggleShowSingleSearchFilters: () => void;
  filteredSingleSearchResults: SingleSearchResult[];
  setFilteredSingleSearchResults: (
    filteredSingleSearchResults: SingleSearchResult[]
  ) => void;
  resetSingleSearchFilters: () => void;
  toggleSingleSearchCondition: (condition: string) => void;
  fetchMultiSearchResults: (multiSearchInput: string) => Promise<void>;
  toggleSingleSearchFoil: () => void;

  singleSearchConditions: {
    [key: string]: boolean;
  };

  singleSearchFoil: boolean;

  singleSearchResultsLoading: boolean;
  setSingleSearchResultsLoading: (singleSearchResultsLoading: boolean) => void;
  fetchSingleSearchResults: (searchInput: string) => Promise<void>;
  filterSingleSearchResults: () => void;
  multiSearchMode: string;
  toggleMultiSearchSelectAllStores: () => void;
  multiSearchResultsLoading: boolean;
  multiSearchResults: MultiSearchCard[];
  filteredMultiSearchResults: MultiSearchCardState[];
  updateSelectedVariant: (cardName: string, variant: SingleSearchResult) => void;
};

export const useStore = create<State>((set, get) => ({
  websites: websites,
  singleSearchInput: '',
  setSingleSearchInput: (singleSearchInput: string) =>
    set({ singleSearchInput }),
  showSingleSearchFilters: false,
  multiSearchInput: '',
  multiSearchQuery: '',
  setMultiSearchInput: (multiSearchInput: string) => set({ multiSearchInput }),
  setMultiSearchQuery: (multiSearchQuery: string) => set({ multiSearchQuery }),
  toggleShowSingleSearchFilters: () =>
    set({ showSingleSearchFilters: !get().showSingleSearchFilters }),
  singleSearchQuery: '',

  singleSearchConditions: {
    nm: true,
    lp: true,
    pl: true,
    mp: true,
    hp: true,
    dmg: true,
    scan: true,
    scn: true
  },

  singleSearchFoil: false,
  toggleSingleSearchFoil: () => {
    set({ singleSearchFoil: !get().singleSearchFoil });
    // call filter function
    get().filterSingleSearchResults();
  },

  setSingleSearchQuery: (singleSearchQuery: string) =>
    set({ singleSearchQuery }),
  singleSearchResults: [],
  filteredSingleSearchResults: [],
  setFilteredSingleSearchResults: (
    filteredSingleSearchResults: SingleSearchResult[]
  ) => set({ filteredSingleSearchResults }),
  setSingleSearchResults: (singleSearchResults: SingleSearchResult[]) =>
    set({ singleSearchResults }),
  singleSearchResultsLoading: false,

  multiSearchResultsLoading: false,
  setSingleSearchResultsLoading: (singleSearchResultsLoading: boolean) =>
    set({ singleSearchResultsLoading }),




  fetchMultiSearchResults: async (multiSearchInput: string) => {
    set({ multiSearchResultsLoading: true });
    const selectedWebsites = get().multiSearchSelectedWebsites;
    const websiteCodes = selectedWebsites.map((website) => {
      return get().websites.find((w) => w.name === website)?.code;
    });
    const cardNames = multiSearchInput.split('\n');
    // remove any empty strings
    const filteredCardNames = cardNames.filter((cardName) => cardName !== '');
    // match each website to it's code
    const response = await axios.post(`http://localhost:8000/search/bulk/`, {
      cardNames: filteredCardNames,
      websites: websiteCodes,
      worstCondition: 'nm'
    });
    let results = response.data;
    console.log('results', results);
    // sort results by ascending price
    // results.sort((a: MultiSearchCard, b: MultiSearchCard) => {
    //   return a.price - b.price;
    // });
    // for card in results
    for (let i = 0; i < results.length; i++) {
      // sort card's results by ascending price
      results[i].variants.sort((a: SingleSearchResult, b: SingleSearchResult) => {
        return a.price - b.price;
      });
    }
    // construct filteredMultiSearchResults by adding a 'selected' property to each card, and a 'selectedVariant' property to each card
    const filteredResults: MultiSearchCardState[] = results.map((card: MultiSearchCard) => {
      return {
        ...card,
        selected: true,
        selectedVariant: card.variants[0]
      };
    });
    set({ filteredMultiSearchResults: filteredResults });
    // set({ filteredMultiSearchResults: results });
    set({ multiSearchResults: results });
    set({ multiSearchResultsLoading: false });
    set({ multiSearchQuery: multiSearchInput });
    set({ multiSearchMode: 'results' });
  },
  multiSearchResults: [],
  filteredMultiSearchResults: [],

  fetchSingleSearchResults: async (searchInput: string) => {
    set({ singleSearchResultsLoading: true });
    const response = await axios.post(`http://localhost:8000/search/single/`, {
      cardName: searchInput,
      websites: ['all']
    });
    const results = response.data;
    console.log('results', results);
    // sort results by ascending price
    // results = [SingleSearchResult, SingleSearchResult, ...]
    // SingleSearchResult = { name: string, link: string, image: string, set: string, condition: string, foil: boolean, price: number, website: string }
    results.sort((a: SingleSearchResult, b: SingleSearchResult) => {
      return a.price - b.price;
    });

    set({ filteredSingleSearchResults: results });
    set({ singleSearchResults: results });
    set({ singleSearchResultsLoading: false });
    set({ singleSearchQuery: searchInput });
  },




  multiSearchMode: 'search',
  filterSingleSearchResults: () => {
    const conditions = get().singleSearchConditions;
    const foil = get().singleSearchFoil;
    const results = get().singleSearchResults;
    const orderBy = get().singleSearchOrderBy;
    const order = get().singleSearchOrder;
    const filteredResults = results.filter((result: SingleSearchResult) => {
      return (
        conditions[result.condition.toLowerCase()] &&
        (foil ? result.foil : true)
      );
    });
    // sort by orderBy in order
    filteredResults.sort((a: SingleSearchResult, b: SingleSearchResult) => {
      if (orderBy === 'price') {
        if (order === 'asc') {
          return a.price - b.price;
        } else {
          return b.price - a.price;
        }
      } else if (orderBy === 'name') {
        if (order === 'asc') {
          return a.name.localeCompare(b.name);
        } else {
          return b.name.localeCompare(a.name);
        }
      } else if (orderBy === 'set') {
        if (order === 'asc') {
          return a.set.localeCompare(b.set);
        } else {
          return b.set.localeCompare(a.set);
        }
      } else if (orderBy === 'website') {
        if (order === 'asc') {
          return a.website.localeCompare(b.website);
        } else {
          return b.website.localeCompare(a.website);
        }
      } else {
        return 0;
      }
    });

    set({ filteredSingleSearchResults: filteredResults });
  },

  toggleSingleSearchCondition: (condition: string) => {
    // toggle the condition in singleSearchConditions
    set({
      singleSearchConditions: {
        ...get().singleSearchConditions,
        [condition]: !get().singleSearchConditions[condition]
      }
    });

    // call filterSingleSearchResults
    get().filterSingleSearchResults();
  },

  resetSingleSearchFilters: () => {
    // set all conditions to true
    set({
      singleSearchConditions: {
        nm: true,
        lp: true,
        pl: true,
        mp: true,
        hp: true,
        dmg: true,
        scan: true,
        scn: true
      }
    });
    // set foil to false
    set({ singleSearchFoil: false });
    // set orderBy to price
    set({ singleSearchOrderBy: 'price' });
    // set order to asc
    set({ singleSearchOrder: 'asc' });

    // call filterSingleSearchResults
    get().filterSingleSearchResults();
  },

  singleSearchOrder: 'asc',
  singleSearchOrderBy: 'price',
  setSingleSearchOrder: (singleSearchOrder: string) => {
    set({ singleSearchOrder });
    get().filterSingleSearchResults();
  },
  setSingleSearchOrderBy: (singleSearchOrderBy: string) => {
    set({ singleSearchOrderBy });
    get().filterSingleSearchResults();
  },

  // multiSearchSelectedWebsites = website.name for each website in websites
  multiSearchSelectedWebsites: websites.map((website: Website) => website.name),
  toggleMultiSearchSelectedWebsites: (website: string) => {
    // if website is in multiSearchSelectedWebsites, remove it
    // else add it
    if (get().multiSearchSelectedWebsites.includes(website)) {
      set({
        multiSearchSelectedWebsites: get().multiSearchSelectedWebsites.filter(
          (selectedWebsite: string) => selectedWebsite !== website
        )
      });
    }
    // else add it
    else {
      set({
        multiSearchSelectedWebsites: [
          ...get().multiSearchSelectedWebsites,
          website
        ]
      });
    }
  },
  toggleMultiSearchSelectAllStores: () => {
    if (get().multiSearchSelectedWebsites.length === websites.length) {
      set({ multiSearchSelectedWebsites: [] });
    } else {
      set({
        multiSearchSelectedWebsites: websites.map(
          (website: Website) => website.name
        )
      });
    }
  },
  updateSelectedVariant: (card: string, variant: SingleSearchResult) => {
    set({
      filteredMultiSearchResults: get().filteredMultiSearchResults.map((cardState: MultiSearchCardState) => {
        if (cardState.cardName === card) {
          return {
            ...cardState,
            selectedVariant: variant
          };
        } else {
          return cardState;
        }
      })
    });
  },
  toggleSelectMultiSearchCard: (card: string) => {
    set({
      filteredMultiSearchResults: get().filteredMultiSearchResults.map((cardState: MultiSearchCardState) => {
        if (cardState.cardName === card) {
          return {
            ...cardState,
            selected: !cardState.selected
          };
        } else {
          return cardState;
        }
      })
    });
  }
}));
