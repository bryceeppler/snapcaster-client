import { create } from 'zustand';
import axiosInstance from '@/utils/axiosWrapper';
import { toast } from 'sonner';
import { useEffect, useRef } from 'react';

export const useOutsideClick = (callback: () => void) => {
  const sortRadioRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sortRadioRef.current &&
        !sortRadioRef.current.contains(event.target as Node)
      ) {
        callback();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback]);
  return sortRadioRef;
};

export interface PromoInformation {
  promoCode: string;
  discount: number;
}
export interface PromoMap {
  [key: string]: PromoInformation;
}
export interface Filter {
  name: string;
  abbreviation: string;
}

export interface SingleSearchResult {
  name: string;
  link: string;
  image: string;
  set: string;
  condition: string;
  foil: boolean;
  price: number;
  priceBeforeDiscount: number;
  website: string;
  s3_image_url?: string;
}

export type MultiSearchCard = {
  cardName: string;
  variants: SingleSearchResult[];
};

export type MultiSearchCardState = {
  cardName: string;
  variants: SingleSearchResult[];
  selectedVariant: SingleSearchResult;
  selected: boolean;
};

export interface Website {
  name: string;
  code: string;
  url: string;
  shopify: boolean;
  backend: string;
  image: string;
  promoCode: string;
  discount: number;
}

const websites: Website[] = [];
const websiteList: Filter[] = [];
const promoMap: PromoMap = {};

export type FilterTag = {
  name: string;
  displayName: string;
  selected: boolean;
};

export type PriceListEntry = {
  price: number;
  website: string;
  foil: boolean;
  condition: string;
};

export type CardPrices = {
  image: string;
  max: number;
  min: number;
  avg: number;
  foil_max?: number;
  foil_min?: number;
  foil_avg?: number;
  priceList: PriceListEntry[];
  date: string;
};
export type CarouselItemType = {
  name: string;
  image_url: string;
};
type State = {
  sponsor: string;
  websites: Website[];
  promoMap: PromoMap;

  sortMultiSearchVariants: (
    card: MultiSearchCardState,
    orderBy: string
  ) => void;
  calculateSetMultiSearchSelectedCost: () => void;
  multiSearchSelectedCost: number;
  missingMultiSearchResults: string[];
  resetMultiSearch: () => void;
  selectAllMultiSearchResults: () => void;

  getWebsiteNameByCode: (code: string) => string;
  multiSearchInput: string;
  multiSearchQuery: string;
  multiSearchSelectedWebsites: string[];
  toggleMultiSearchSelectedWebsites: (website: string) => void;
  setMultiSearchInput: (multiSearchInput: string) => void;
  setMultiSearchQuery: (multiSearchQuery: string) => void;
  toggleSelectMultiSearchCard: (cardName: string) => void;
  fetchMultiSearchResults: (multiSearchInput: string) => Promise<void>;

  multiSearchMode: string;
  toggleMultiSearchSelectAllStores: () => void;
  multiSearchResultsLoading: boolean;
  multiSearchResults: MultiSearchCard[];
  filteredMultiSearchResults: MultiSearchCardState[];
  updateSelectedVariant: (
    cardName: string,
    variant: SingleSearchResult
  ) => void;

  initWebsiteInformation: () => Promise<void>;
};

export const useStore = create<State>((set, get) => ({
  sponsor: 'reddragon',

  getWebsiteNameByCode: (code: string) => {
    return get().websites.find((w) => w.code === code)?.name || '';
  },
  sortMultiSearchVariants: (card, orderBy) => {
    const filteredMultiSearchResults = get().filteredMultiSearchResults;
    const cardIndex = filteredMultiSearchResults.findIndex(
      (c) => c.cardName === card.cardName
    );
    const cardToSort = filteredMultiSearchResults[cardIndex];
    const sortedVariants = cardToSort.variants.sort((a, b) => {
      if (orderBy === 'price') {
        return a.price - b.price;
      }
      if (orderBy === 'condition') {
        return a.condition.localeCompare(b.condition);
      }
      if (orderBy === 'website') {
        return a.website.localeCompare(b.website);
      }
      return 0;
    });
    const newCard: MultiSearchCardState = {
      ...cardToSort,
      variants: sortedVariants
    };
    const newFilteredMultiSearchResults = [
      ...filteredMultiSearchResults.slice(0, cardIndex),
      newCard,
      ...filteredMultiSearchResults.slice(cardIndex + 1)
    ];
    set({ filteredMultiSearchResults: newFilteredMultiSearchResults });
  },

  calculateSetMultiSearchSelectedCost: () => {
    const filteredMultiSearchResults = get().filteredMultiSearchResults;
    // if the length is 0, set to 0
    if (filteredMultiSearchResults.length === 0) {
      set({ multiSearchSelectedCost: 0 });
      return;
    }
    const selectedCards = filteredMultiSearchResults.filter(
      (card) => card.selected
    );
    const selectedCardsCost = selectedCards.reduce((acc, card) => {
      return acc + card.selectedVariant.price;
    }, 0);
    set({ multiSearchSelectedCost: selectedCardsCost });
  },

  multiSearchSelectedCost: 0,
  missingMultiSearchResults: [],
  resetMultiSearch: () => {
    // set multie search mode to search
    set({ multiSearchMode: 'search' });
  },
  selectAllMultiSearchResults: () => {
    const multiSearchResults = get().filteredMultiSearchResults;
    // if all card.selected are true, set all to false
    if (multiSearchResults.every((card) => card.selected)) {
      const newMultiSearchResults = multiSearchResults.map((card) => {
        return {
          ...card,
          selected: false
        };
      });
      set({ filteredMultiSearchResults: newMultiSearchResults });
      get().calculateSetMultiSearchSelectedCost();
      return;
    }
    // Otherwise, set all to true
    // set teach card.selected to true
    const newMultiSearchResults = multiSearchResults.map((card) => {
      return {
        ...card,
        selected: true
      };
    });
    set({ filteredMultiSearchResults: newMultiSearchResults });
    get().calculateSetMultiSearchSelectedCost();
  },

  websites: websites,
  promoMap: promoMap,
  multiSearchInput: '',
  multiSearchQuery: '',
  setMultiSearchInput: (multiSearchInput: string) => set({ multiSearchInput }),
  setMultiSearchQuery: (multiSearchQuery: string) => set({ multiSearchQuery }),

  multiSearchResultsLoading: false,
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

    try {
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_SEARCH_URL}/bulk`,
        {
          cardNames: filteredCardNames,
          websites: websiteCodes,
          worstCondition: 'nm'
        }
      );

      let results = response.data;
      // sort results by ascending price
      for (let i = 0; i < results.length; i++) {
        // sort card's results by ascending price
        // if no veriants, remove the card
        if (results[i].variants.length === 0) {
          results.splice(i, 1);
          i--;
          continue;
        }
        results[i].variants.sort(
          (a: SingleSearchResult, b: SingleSearchResult) => {
            return a.price - b.price;
          }
        );
      }
      // construct filteredMultiSearchResults by adding a 'selected' property to each card, and a 'selectedVariant' property to each card
      const filteredResults: MultiSearchCardState[] = results.map(
        (card: MultiSearchCard) => {
          return {
            ...card,
            selected: true,
            selectedVariant: card.variants[0]
          };
        }
      );
      set({ filteredMultiSearchResults: filteredResults });
      // set({ filteredMultiSearchResults: results });
      set({ multiSearchResults: results });
      set({ multiSearchResultsLoading: false });
      set({ multiSearchQuery: multiSearchInput });
      set({ multiSearchMode: 'results' });
      // set missingMultiSearchResults to the card name in filteredCardNames that is not in results
      const missingMultiSearchResults = filteredCardNames.filter((cardName) => {
        return !results.find(
          (card: MultiSearchCard) =>
            card.cardName.toLowerCase() === cardName.toLowerCase()
        );
      });
      set({ missingMultiSearchResults });
      get().calculateSetMultiSearchSelectedCost();
    } catch (error) {
      toast.error(`Error fetching multi search results`);

      set({ multiSearchResultsLoading: false });
    }
  },
  multiSearchResults: [],
  filteredMultiSearchResults: [],

  multiSearchMode: 'search',

  multiSearchSelectedWebsites: [],
  toggleMultiSearchSelectedWebsites: (website: string) => {
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
    if (get().multiSearchSelectedWebsites.length === get().websites.length) {
      set({ multiSearchSelectedWebsites: [] });
    } else {
      set({
        multiSearchSelectedWebsites: get().websites.map(
          (website: Website) => website.name
        )
      });
    }
  },
  updateSelectedVariant: (card: string, variant: SingleSearchResult) => {
    set({
      filteredMultiSearchResults: get().filteredMultiSearchResults.map(
        (cardState: MultiSearchCardState) => {
          if (cardState.cardName === card) {
            return {
              ...cardState,
              selectedVariant: variant,
              selected: true
            };
          } else {
            return cardState;
          }
        }
      )
    });
    get().calculateSetMultiSearchSelectedCost();
  },
  toggleSelectMultiSearchCard: (card: string) => {
    set({
      filteredMultiSearchResults: get().filteredMultiSearchResults.map(
        (cardState: MultiSearchCardState) => {
          if (cardState.cardName === card) {
            return {
              ...cardState,
              selected: !cardState.selected
            };
          } else {
            return cardState;
          }
        }
      )
    });
    get().calculateSetMultiSearchSelectedCost();
  },
  initWebsiteInformation: async () => {
    try {
      if (get().websites.length > 0) {
        return;
      }
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_SEARCH_URL}/websites`
      );
      let data = response.data;
      set({ websites: data.websiteList });

      let tempMap: PromoMap = {};
      for (const website of data.websiteList) {
        if (website['promoCode'] !== null) {
          tempMap[website['code']] = {
            promoCode: website['promoCode'],
            discount: website['discount']
          };
        }
      }
      set({ promoMap: tempMap });

      set({
        multiSearchSelectedWebsites: get().websites.map(
          (website: Website) => website.name
        )
      });
    } catch {
      console.log('getWebsiteInformation or promoMap ERROR');
    }
  }
}));
