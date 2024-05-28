import { create } from 'zustand';
import { useStore } from '@/stores/store';
import axiosInstance from '@/utils/axiosWrapper';
import type { Website } from '@/types/index';

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
  promo_prerelease: boolean;
  promo: boolean;
  promo_pack: boolean;
  showcase: string;
  frame: string;
  alternate_art: boolean;
  alternate_art_japanese: boolean;
  art_series: boolean;
  golden_stamped_art_series: boolean;
}

const websitesAdvanced: Website[] = [];

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
  setList: Filter[];

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

  websitesAdvanced: Website[];
  selectedWebsiteCount: number;
  selectedWebsiteList: string[];

  foilList: Filter[];
  selectedFoilCount: number;
  selectedFoilList: string[];

  showcaseTreatmentList: Filter[];
  selectedShowcaseTreatmentCount: number;
  selectedShowcaseTreatmentList: string[];

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
  initSetInformation: () => Promise<void>;
};

export const advancedUseStore = create<State>((set, get) => ({
  advancedSearchLoading: false,
  advancedSearchResults: [],

  advancedSearchInput: '',
  advnacedSearchTextBoxValue: '',

  websitesAdvanced: websitesAdvanced,
  selectedWebsiteList: [],
  selectedWebsiteCount: 0,

  setList: [],
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
    } else if (category == 'Showcase') {
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
          promo_prerelease: get().preReleaseChecked,
          promo_pack: get().promoPackChecked,
          promo: get().promoChecked,
          alternate_art: get().alternateArtChecked,
          alternate_art_japanese: get().alternateArtJapaneseChecked,
          art_series: get().artSeriesChecked,
          golden_stamped_art_series: get().goldenStampedChecked,
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
      console.log(get().advancedSearchResults);

      get().updateSortByFilter(get().selectedSortBy);
      set({ advancedSearchLoading: false });
    } catch {
      set({ advancedSearchLoading: false });
    }
  },
  initSetInformation: async () => {
    try {
      if (get().setList.length > 0) {
        return;
      }
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_SEARCH_URL}/sets`
      );
      let data = response.data;
      let result = [];
      for (const item of data.setList) {
        result.push({
          name: item.name,
          abbreviation: item.abbreviation
        });
      }
      set({ setList: result });
    } catch (error) {
      console.log('getSetInformation ERROR');
      console.log(error);
    }
  }
}));
