import { create } from 'zustand';

type SearchStore = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

export const useSearchStore = create<SearchStore>((set) => ({
  searchQuery: '',
  setSearchQuery: (query: string) => set({ searchQuery: query })
}));
