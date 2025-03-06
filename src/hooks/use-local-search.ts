import { create } from 'zustand';

type LocalSearchStore = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

export const useLocalSearchStore = create<LocalSearchStore>((set) => ({
  searchQuery: '',
  setSearchQuery: (query: string) => set({ searchQuery: query })
}));
