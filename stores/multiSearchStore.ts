import { WebsiteMapping } from '@/types/website';
import { create } from 'zustand';
import axiosInstance from '@/utils/axiosWrapper';
import type { Tcgs } from '@/types';

type MultiSearchState = {
  mode: 'search' | 'results';
  selectedWebsites: WebsiteMapping[];
  tcg: Tcgs;
  searchInput: string;
  searchQuery: string;

  handleSubmit: () => void;
  setSearchInput: (value: string) => void;
  setTcg: (value: Tcgs) => void;
  onWebsiteSelect: (value: WebsiteMapping) => void;
};

const useMultiSearchStore = create<MultiSearchState>((set, get) => ({
  mode: 'search',
  selectedWebsites: [],
  tcg: 'mtg',
  searchInput: '',
  searchQuery: '',

  handleSubmit: () => {
    set({ searchQuery: get().searchInput });
  },
  setSearchInput: (value: string) => {
    set({ searchInput: value });
  },
  setTcg: (value: Tcgs) => {
    set({ tcg: value });
  },
  onWebsiteSelect: (value: WebsiteMapping) => {
    set((state) => {
      // Find the index of the website by its code
      const index = state.selectedWebsites.findIndex(
        (v) => v.code === value.code
      );

      // If the website is found, remove it from the list
      if (index > -1) {
        return {
          ...state,
          selectedWebsites: state.selectedWebsites.filter((_, i) => i !== index)
        };
      }

      // Otherwise, add it to the list
      return {
        ...state,
        selectedWebsites: [...state.selectedWebsites, value]
      };
    });
  }
}));

export default useMultiSearchStore;
