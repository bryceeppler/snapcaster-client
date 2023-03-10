import { create } from "zustand";
import axios from "axios";

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

export interface Website {
  name: string;
  code: string;
  image: string;
}

type State = {
  websites: Website[];
  singleSearchInput: string;
  setSingleSearchInput: (singleSearchInput: string) => void;
  singleSearchQuery: string;
  setSingleSearchQuery: (singleSearchQuery: string) => void;
  
  multiSearchInput: string;
  multiSearchQuery: string;
  setMultiSearchInput: (multiSearchInput: string) => void;
  setMultiSearchQuery: (multiSearchQuery: string) => void;

  singleSearchResults: SingleSearchResult[];
  setSingleSearchResults: (singleSearchResults: SingleSearchResult[]) => void;
  
  showSingleSearchFilters: boolean;
  toggleShowSingleSearchFilters: () => void;
  filteredSingleSearchResults: SingleSearchResult[];
  setFilteredSingleSearchResults: (
    filteredSingleSearchResults: SingleSearchResult[]
  ) => void;

  singleSearchResultsLoading: boolean;
  setSingleSearchResultsLoading: (singleSearchResultsLoading: boolean) => void;
  fetchSingleSearchResults: (searchInput: string) => Promise<void>;
};

const websites: Website[] = [
  {
    name: "Aether Vault Games",
    code: "aethervault",
    image:""
  },
  {
    name: "Atlas Collectables",
    code: "atlas",
    image:""
  },
  {
    name: "Border City Games",
    code: "bordercity",
    image:""
  },
  {
    name: "The Connection Games",
    code: "connectiongames",
    image:""
  },
  {
    name: "Enter the Battlefield",
    code: "enterthebattlefield",
    image:""
  },
  {
    name: "Everything Games",
    code: "everythinggames",
    image:""
  },
  {
    name: "Exor Games",
    code: "exorgames",
    image:""
  },
  {
    name: "Face to Face Games",
    code: "facetoface",
    image:""
  },
  {
    name: "Fantasy Forged Games",
    code: "fantasyforged",
    image:""
  },
  {
    name: "FirstPlayer",
    code: "firstplayer",
    image:""
  },
  {
    name: "401 Games",
    code: "four01",
    image:""
  },
  {
    name: "Fusion Gaming",
    code: "fusion",
    image:""
  },
  {
    name: "GameKnight",
    code: "gameknight",
    image:""
  },
  {
    name: "Gamezilla",
    code: "gamezilla",
    image:""
  },
  {
    name: "Gauntlet Games",
    code: "gauntlet",
    image:""
  },
  {
    name: "Hairy Tarantula",
    code: "hairyt",
    image:""
  },
  {
    name: "House of Cards",
    code: "houseofcards",
    image:""
  },
  {
    name: "Jeux 3 Dragons",
    code: "jeux3dragons",
    image:""
  },
  {
    name: "Manaforce",
    code: "manaforce",
    image:""
  },
  {
    name: "Magic Stronghold",
    code: "magicstronghold",
    image:""
  },
  {
    name: "Orchard City Games",
    code: "orchardcity",
    image:""
  },
  {
    name: "Sequence Gaming Brockville",
    code: "sequencegaming",
    image:""
  },
  {
    name: "The Comic Hunter",
    code: "thecomichunter",
    image:""
  },
  {
    name: "Topdeck Hero",
    code: "topdeckhero",
    image:""
  },
  {
    name: "Wizard's Tower (kanatacg)",
    code: "kanatacg",
    image:""
  },
];
  

export const useStore = create<State>((set, get) => ({
  websites: websites,
  singleSearchInput: "",
  setSingleSearchInput: (singleSearchInput: string) =>
    set({ singleSearchInput }),
  showSingleSearchFilters: false,
  multiSearchInput: "",
  multiSearchQuery: "",
  setMultiSearchInput: (multiSearchInput: string) =>
    set({ multiSearchInput }),
  setMultiSearchQuery: (multiSearchQuery: string) =>
    set({ multiSearchQuery }),
  toggleShowSingleSearchFilters: () =>
    set({ showSingleSearchFilters: !get().showSingleSearchFilters }), 
  singleSearchQuery: "",
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
  setSingleSearchResultsLoading: (singleSearchResultsLoading: boolean) =>
    set({ singleSearchResultsLoading }),
  fetchSingleSearchResults: async (searchInput: string) => {
    set({ singleSearchResultsLoading: true });
    const response = await axios.post(`http://localhost:8000/search/single/`, {
      cardName: searchInput,
      websites: ["all"],
    });
    const results = response.data;
    console.log("results", results)
    // sort results by ascending price
    // results = [SingleSearchResult, SingleSearchResult, ...]
    // SingleSearchResult = { name: string, link: string, image: string, set: string, condition: string, foil: boolean, price: number, website: string }
    results.sort((a: SingleSearchResult, b: SingleSearchResult) => {
        return a.price - b.price;
    });

    set({ filteredSingleSearchResults: results });
    set({ singleSearchResults: results });
    set({ singleSearchResultsLoading: false });
    set({ singleSearchQuery: searchInput })
  },
}));
