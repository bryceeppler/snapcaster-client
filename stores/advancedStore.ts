import { create } from 'zustand';
import { useRef, useEffect } from 'react';
import { useStore } from '@/stores/store';
import axiosInstance from '@/utils/axiosWrapper';

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

export interface Filter {
  name: string;
  abbreviation: string;
}

export interface AdvancedSearchResult {
  name: string;
  link: string;
  image: string;
  set: string;
  condition: string;
  foil: string;
  priceBeforeDiscount: number;
  price: number;
  website: string;
  preRelease: boolean;
  promo: boolean;
  promoPack: boolean;
  showcase: string;
  frame: string;
  alternateArt: boolean;
  alternateArtJapanese: boolean;
  artSeries: boolean;
  goldenStampedSeries: boolean;
}

const shopifyOnlySites = useStore.getState().websites.filter(function (item) {
  return item.shopify == true;
});

const websiteList: Filter[] = shopifyOnlySites.map((item) => ({
  name: item.name,
  abbreviation: item.code
}));

const setList: Filter[] = useStore.getState().setList.map((item) => ({
  name: item.name,
  abbreviation: item.abbreviation
}));

const conditionList: Filter[] = [
  {
    name: 'Near Mint',
    abbreviation: 'NM'
  },
  {
    name: 'Lightly Played',
    abbreviation: 'LP'
  },
  {
    name: 'Moderetly Played',
    abbreviation: 'MP'
  },
  {
    name: 'Heavily Played',
    abbreviation: 'HP'
  },
  {
    name: 'Damaged',
    abbreviation: 'DMG'
  }
];
const frameList: Filter[] = [
  {
    name: 'Borderless',
    abbreviation: 'borderless'
  },
  {
    name: 'Extended Art',
    abbreviation: 'extended art'
  },
  {
    name: 'Full Art',
    abbreviation: 'full art'
  },
  {
    name: 'Retro',
    abbreviation: 'retro'
  }
];

const sortByList: Filter[] = [
  {
    name: 'Price',
    abbreviation: 'price'
  },
  {
    name: 'Name',
    abbreviation: 'name'
  },
  {
    name: 'Website',
    abbreviation: 'website'
  },
  {
    name: 'Set',
    abbreviation: 'set'
  },
  {
    name: 'Condition',
    abbreviation: 'condition'
  }
];

const foilList: Filter[] = [
  {
    name: 'All Foils',
    abbreviation: 'all foils'
  },
  {
    name: 'Regular Foil',
    abbreviation: 'foil'
  },
  {
    name: 'Confetti',
    abbreviation: 'confetti'
  },
  {
    name: 'Etched',
    abbreviation: 'etched'
  },
  {
    name: 'Ampersand',
    abbreviation: 'ampersand'
  },
  {
    name: 'Neon Ink',
    abbreviation: 'neon ink'
  },
  {
    name: 'Gilded',
    abbreviation: 'gilded'
  },
  {
    name: 'Galaxy',
    abbreviation: 'galaxy'
  },
  {
    name: 'Surge',
    abbreviation: 'surge'
  },
  {
    name: 'Textured',
    abbreviation: 'textured'
  },
  {
    name: 'Serialized',
    abbreviation: 'serialized'
  },
  {
    name: 'Step and Compleat',
    abbreviation: 'compleat'
  },
  {
    name: 'Oil Slick',
    abbreviation: 'oil slick'
  },
  {
    name: 'Halo',
    abbreviation: 'halo'
  },
  {
    name: 'Invisible Ink',
    abbreviation: 'invisible ink'
  },
  {
    name: 'Rainbow',
    abbreviation: 'rainbow'
  },
  {
    name: 'Raised',
    abbreviation: 'raised'
  }
];

const showcaseTreatmentList: Filter[] = [
  {
    name: 'All Showcases',
    abbreviation: 'all showcases'
  },
  {
    name: 'Regular Showcase',
    abbreviation: 'showcase'
  },

  {
    name: 'Concept Praetors',
    abbreviation: 'concept praetors'
  },

  {
    name: 'Poster',
    abbreviation: 'poster'
  },

  {
    name: 'Dungeon Module',
    abbreviation: 'dungeon module'
  },

  {
    name: 'Phyrexian',
    abbreviation: 'phyrexian'
  },
  {
    name: 'Scrolls',
    abbreviation: 'scrolls'
  },
  {
    name: 'Anime',
    abbreviation: 'anime'
  },
  {
    name: 'Manga',
    abbreviation: 'manga'
  },
  {
    name: 'The Moonlit Lands',
    abbreviation: 'the moonlit lands'
  }
];

type State = {
  advancedSearchResults: AdvancedSearchResult[];

  sortByList: Filter[];
  selectedSortBy: string;
  advancedSearchInput: string;

  advnacedSearchTextBoxValue: string;

  conditionList: Filter[];
  selectedConditionsCount: number;
  selectedConditionsList: string[];

  frameList: Filter[];
  selectedFrameCount: number;
  selectedhFrameList: string[];

  websiteList: Filter[];
  selectedWebsiteCount: number;
  selectedWebsiteList: string[];

  foilList: Filter[];
  selectedFoilCount: number;
  selectedFoilList: string[];

  showcaseTreatmentList: Filter[];
  selectedShowcaseTreatmentCount: number;
  selectedShowcaseTreatmentList: string[];

  setList: Filter[];
  selectedSetCount: number;
  selectedSetList: string[];

  preReleaseChecked: boolean;
  promoPackChecked: boolean;
  promoChecked: boolean;
  alternateArtChecked: boolean;
  alternateArtJapaneseChecked: boolean;
  retroChecked: boolean;
  artSeriesChecked: boolean;
  goldenStampedChecked: boolean;
  numberChecked: boolean;
  cardNumber: number;

  advancedSearchLoading: boolean;

  setAdvancedSearchInput: (advancedSearchInput: string) => void;
  updateAdvnacedSearchTextBoxValue: (textField: string) => void;
  toggleRegularCheckboxes: (checkBoxTitle: string) => void;
  toggle: (fieldName: string, category: string) => void;

  updateSortByFilter: (sortValue: string) => void;
  resetFilters: () => void;
  fetchAdvancedSearchResults: (searchText: string) => Promise<void>;
  // initSetInformation: () => Promise<void>;
};

export const advancedUseStore = create<State>((set, get) => ({
  advancedSearchLoading: false,
  advancedSearchResults: [],

  advancedSearchInput: '',
  advnacedSearchTextBoxValue: '',

  websiteList: websiteList,
  selectedWebsiteList: [],
  selectedWebsiteCount: 0,

  setList: setList,
  selectedSetList: [],
  selectedSetCount: 0,

  conditionList: conditionList,
  selectedConditionsList: [],
  selectedConditionsCount: 0,

  foilList: foilList,
  selectedFoilList: [],
  selectedFoilCount: 0,

  showcaseTreatmentList: showcaseTreatmentList,
  selectedShowcaseTreatmentList: [],
  selectedShowcaseTreatmentCount: 0,

  frameList: frameList,
  selectedhFrameList: [],
  selectedFrameCount: 0,

  preReleaseChecked: false,
  promoPackChecked: false,
  promoChecked: false,
  alternateArtChecked: false,
  alternateArtJapaneseChecked: false,
  retroChecked: false,
  artSeriesChecked: false,
  goldenStampedChecked: false,
  numberChecked: false,
  cardNumber: 0,

  sortByList: sortByList,
  selectedSortBy: 'price',

  updateAdvnacedSearchTextBoxValue: (textField: string) => {
    set({ advnacedSearchTextBoxValue: textField });
  },

  toggleRegularCheckboxes: (checkBoxTitle: string) => {
    switch (checkBoxTitle) {
      case 'numberCheckBox':
        set({ numberChecked: !get().numberChecked });
        if (get().numberChecked == false) {
          set({ cardNumber: 0 });
        }
        break;
      case 'goldenStampedSeriesCheckBox':
        set({ goldenStampedChecked: !get().goldenStampedChecked });
        break;
      case 'artSeriesCheckBox':
        set({ artSeriesChecked: !get().artSeriesChecked });
        break;
      case 'retroCheckBox':
        set({ retroChecked: !get().retroChecked });
        break;
      case 'alternateArtCheckBox':
        set({ alternateArtChecked: !get().alternateArtChecked });
        break;
      case 'alternateArtJapaneseCheckBox':
        set({
          alternateArtJapaneseChecked: !get().alternateArtJapaneseChecked
        });
        break;
      case 'promoCheckBox':
        set({ promoChecked: !get().promoChecked });
        break;
      case 'preReleaseCheckBox':
        set({ preReleaseChecked: !get().preReleaseChecked });
        break;
      case 'promoPackCheckBox':
        set({ promoPackChecked: !get().promoPackChecked });
        break;
    }
  },
  resetFilters: () => {
    set({
      advnacedSearchTextBoxValue: '',

      selectedConditionsList: [],
      selectedhFrameList: [],
      selectedWebsiteList: [],
      selectedFoilList: [],
      selectedShowcaseTreatmentList: [],
      selectedSetList: [],

      selectedConditionsCount: 0,
      selectedFrameCount: 0,
      selectedWebsiteCount: 0,
      selectedFoilCount: 0,
      selectedShowcaseTreatmentCount: 0,
      selectedSetCount: 0,

      preReleaseChecked: false,
      promoChecked: false,
      alternateArtChecked: false,
      retroChecked: false,
      artSeriesChecked: false,
      goldenStampedChecked: false,
      numberChecked: false,
      promoPackChecked: false,
      alternateArtJapaneseChecked: false,
      cardNumber: 0
    });
  },

  toggle: (fieldName: string, category: string) => {
    if (category == 'Condition') {
      if (get().selectedConditionsList.includes(fieldName)) {
        set({
          selectedConditionsList: get().selectedConditionsList.filter(
            (selectedField: string) => selectedField !== fieldName
          ),
          selectedConditionsCount: get().selectedConditionsCount - 1
        });
      } else {
        set({
          selectedConditionsList: [...get().selectedConditionsList, fieldName],
          selectedConditionsCount: get().selectedConditionsCount + 1
        });
      }
    } else if (category == 'Frame') {
      if (get().selectedhFrameList.includes(fieldName)) {
        set({
          selectedhFrameList: get().selectedhFrameList.filter(
            (selectedField: string) => selectedField !== fieldName
          ),
          selectedFrameCount: get().selectedFrameCount - 1
        });
      } else {
        set({
          selectedhFrameList: [...get().selectedhFrameList, fieldName],
          selectedFrameCount: get().selectedFrameCount + 1
        });
      }
    } else if (category == 'Websites') {
      if (get().selectedWebsiteList.includes(fieldName)) {
        set({
          selectedWebsiteList: get().selectedWebsiteList.filter(
            (selectedField: string) => selectedField !== fieldName
          ),
          selectedWebsiteCount: get().selectedWebsiteCount - 1
        });
      } else {
        set({
          selectedWebsiteList: [...get().selectedWebsiteList, fieldName],
          selectedWebsiteCount: get().selectedWebsiteCount + 1
        });
      }
    } else if (category == 'Foil') {
      if (get().selectedFoilList.includes(fieldName)) {
        set({
          selectedFoilList: get().selectedFoilList.filter(
            (selectedField: string) => selectedField !== fieldName
          ),
          selectedFoilCount: get().selectedFoilCount - 1
        });
      } else {
        set({
          selectedFoilList: [...get().selectedFoilList, fieldName],
          selectedFoilCount: get().selectedFoilCount + 1
        });
      }
    } else if (category == 'Showcase Treatment') {
      if (get().selectedShowcaseTreatmentList.includes(fieldName)) {
        set({
          selectedShowcaseTreatmentList:
            get().selectedShowcaseTreatmentList.filter(
              (selectedField: string) => selectedField !== fieldName
            ),
          selectedShowcaseTreatmentCount:
            get().selectedShowcaseTreatmentCount - 1
        });
      } else {
        set({
          selectedShowcaseTreatmentList: [
            ...get().selectedShowcaseTreatmentList,
            fieldName
          ],
          selectedShowcaseTreatmentCount:
            get().selectedShowcaseTreatmentCount + 1
        });
      }
    } else if (category == 'Set') {
      if (get().selectedSetList.includes(fieldName)) {
        set({
          selectedSetList: get().selectedSetList.filter(
            (selectedField: string) => selectedField !== fieldName
          ),
          selectedSetCount: get().selectedSetCount - 1
        });
      } else {
        set({
          selectedSetList: [...get().selectedSetList, fieldName],
          selectedSetCount: get().selectedSetCount + 1
        });
      }
    }
  },

  updateSortByFilter: (sortValue: string) => {
    set({ selectedSortBy: sortValue });
    if (get().selectedSortBy == 'price') {
      set({
        advancedSearchResults: get().advancedSearchResults.sort(
          (a, b) => a.price - b.price
        )
      });
    } else if (get().selectedSortBy == 'website') {
      set({
        advancedSearchResults: get().advancedSearchResults.sort((a, b) =>
          a.website === b.website
            ? a.price < b.price
              ? -1
              : 1
            : a.website < b.website
            ? -1
            : 1
        )
      });
    } else if (get().selectedSortBy == 'set') {
      set({
        advancedSearchResults: get().advancedSearchResults.sort((a, b) =>
          a.set === b.set
            ? a.price < b.price
              ? -1
              : 1
            : a.set < b.set
            ? -1
            : 1
        )
      });
    } else if (get().selectedSortBy == 'condition') {
      set({
        advancedSearchResults: get().advancedSearchResults.sort((a, b) =>
          a.condition === b.condition
            ? a.price < b.price
              ? -1
              : 1
            : a.condition < b.condition
            ? -1
            : 1
        )
      });
    } else if (get().selectedSortBy == 'name') {
      set({
        advancedSearchResults: get().advancedSearchResults.sort((a, b) =>
          a.name === b.name
            ? a.price < b.price
              ? -1
              : 1
            : a.name < b.name
            ? -1
            : 1
        )
      });
    }
  },
  setAdvancedSearchInput: (advancedSearchInput: string) =>
    set({ advancedSearchInput }),
  fetchAdvancedSearchResults: async (searchText: string) => {
    try {
      set({ advancedSearchResults: [] });
      set({ advancedSearchLoading: true });
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_SEARCH_URL}/advanced`,
        {
          // cardName: get().advnacedSearchTextBoxValue.trim(),
          cardName: searchText.trim(),
          website: get().selectedWebsiteList,
          condition: get().selectedConditionsList,
          foil: get().selectedFoilList,
          showcaseTreatment: get().selectedShowcaseTreatmentList,
          frame: get().selectedhFrameList,
          preRelease: get().preReleaseChecked,
          promoPack: get().promoPackChecked,
          promo: get().promoChecked,
          alternateArt: get().alternateArtChecked,
          alternateArtJapanese: get().alternateArtJapaneseChecked,
          artSeries: get().artSeriesChecked,
          goldenStampedSeries: get().goldenStampedChecked,
          set: get().selectedSetList
        }
      );
      for (const item of response.data) {
        item.priceBeforeDiscount = item.price;
        if (item.website in useStore.getState().promoMap) {
          item.price = (
            item.price * useStore.getState().promoMap[item.website]['discount']
          ).toFixed(2);
        }
      }

      set({ advancedSearchResults: response.data });
      get().updateSortByFilter(get().selectedSortBy);
      set({ advancedSearchLoading: false });
    } catch {
      set({ advancedSearchLoading: false });
    }
  }
}));
