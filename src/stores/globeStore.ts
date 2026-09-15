import { create } from "zustand";

export type GlobeStoreState = {
  hoveredCountryId: string | null;
  selectedCountryId: string | null;
  searchQuery: string;
  isPanelOpen: boolean;
};

export type GlobeStoreActions = {
  setHoveredCountryId: (id: string | null) => void;
  setSelectedCountryId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setPanelOpen: (open: boolean) => void;
  clearSelection: () => void;
};

export type GlobeStore = GlobeStoreState & GlobeStoreActions;

export const useGlobeStore = create<GlobeStore>((set) => ({
  hoveredCountryId: null,
  selectedCountryId: null,
  searchQuery: "",
  isPanelOpen: false,
  setHoveredCountryId: (id) => set({ hoveredCountryId: id }),
  setSelectedCountryId: (id) =>
    set({
      selectedCountryId: id,
      isPanelOpen: id !== null,
    }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setPanelOpen: (open) => set({ isPanelOpen: open }),
  clearSelection: () => set({ selectedCountryId: null, isPanelOpen: false }),
}));
